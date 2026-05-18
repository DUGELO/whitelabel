import { Injectable } from '@angular/core';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase/firebase.config';
import { STOREFRONT_CONFIG, StorefrontConfig } from './storefront-config';
import {
  StorefrontRuntimeSettingsDocument,
  StorefrontRuntimeTenantDocument,
  mapRuntimeStorefrontConfig,
} from './storefront-runtime-config.mapper';

@Injectable({
  providedIn: 'root',
})
export class StorefrontRuntimeConfigService {
  async loadConfig(): Promise<StorefrontConfig> {
    const localE2EConfig = readLocalE2EStorefrontConfig();

    if (localE2EConfig) {
      return localE2EConfig;
    }

    const tenantId = this.resolveTenantId();
    const [settings, tenant] = await Promise.all([
      this.readSettings(tenantId),
      this.readTenant(tenantId),
    ]);

    return mapRuntimeStorefrontConfig({
      tenantId,
      tenant,
      settings,
      fallback: STOREFRONT_CONFIG,
    });
  }

  resolveTenantId(): string {
    const queryTenantId = this.readTenantIdFromQueryString();

    return queryTenantId || STOREFRONT_CONFIG.tenantId;
  }

  private async readSettings(
    tenantId: string,
  ): Promise<StorefrontRuntimeSettingsDocument | null> {
    try {
      const snapshot = await getDoc(doc(db, `tenants/${tenantId}/settings`, 'main'));

      return snapshot.exists() ? (snapshot.data() as StorefrontRuntimeSettingsDocument) : null;
    } catch (error) {
      console.warn('[storefront-runtime-config] settings/main could not be loaded.', error);
      return null;
    }
  }

  private async readTenant(tenantId: string): Promise<StorefrontRuntimeTenantDocument | null> {
    try {
      const snapshot = await getDoc(doc(db, 'tenants', tenantId));

      return snapshot.exists() ? (snapshot.data() as StorefrontRuntimeTenantDocument) : null;
    } catch (error) {
      console.warn('[storefront-runtime-config] tenant legacy document could not be loaded.', error);
      return null;
    }
  }

  private readTenantIdFromQueryString(): string | null {
    try {
      const tenantId = new URL(globalThis.location.href).searchParams.get('tenantId')?.trim();

      return tenantId || null;
    } catch {
      return null;
    }
  }
}

function readLocalE2EStorefrontConfig(): StorefrontConfig | null {
  if (!isLocalE2ERuntime()) {
    return null;
  }

  const runtime = globalThis as typeof globalThis & {
    __WHITE_LABEL_E2E_STOREFRONT_CONFIG__?: unknown;
  };
  const config = runtime.__WHITE_LABEL_E2E_STOREFRONT_CONFIG__;

  return isStorefrontConfigLike(config) ? (config as StorefrontConfig) : STOREFRONT_CONFIG;
}

function isLocalE2ERuntime(): boolean {
  const runtime = globalThis as typeof globalThis & {
    __WHITE_LABEL_E2E__?: unknown;
    location?: Location;
  };
  const hostname = runtime.location?.hostname;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

  return runtime.__WHITE_LABEL_E2E__ === true && isLocalHost;
}

function isStorefrontConfigLike(value: unknown): value is StorefrontConfig {
  return Boolean(
    value
      && typeof value === 'object'
      && 'tenantId' in value
      && 'brand' in value
      && 'theme' in value
      && 'content' in value,
  );
}
