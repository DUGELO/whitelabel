import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { db } from '../../../core/firebase/firebase.config';
import {
  AdminProductDocument,
  AdminSettingsReadResult,
  AdminStorefrontSettingsDocument,
  AdminTenantDocument,
  AdminTenantId,
  AdminTenantUserDocument,
} from '../models/admin-firestore.models';
import { buildAdminSettingsReadResult } from '../mappers/admin-settings.mapper';

@Injectable({
  providedIn: 'root',
})
export class AdminFirestoreService {
  async getTenant(tenantId: AdminTenantId): Promise<AdminTenantDocument | null> {
    const snapshot = await getDoc(doc(db, 'tenants', tenantId));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as AdminTenantDocument;
  }

  async getTenantUser(
    tenantId: AdminTenantId,
    uid: string,
  ): Promise<AdminTenantUserDocument | null> {
    const snapshot = await getDoc(doc(db, `tenants/${tenantId}/users`, uid));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as AdminTenantUserDocument;
  }

  async getStorefrontSettings(tenantId: AdminTenantId): Promise<AdminSettingsReadResult | null> {
    const tenant = await this.getTenant(tenantId);

    if (!tenant) {
      return null;
    }

    const settingsSnapshot = await getDoc(doc(db, `tenants/${tenantId}/settings`, 'main'));
    const settings = settingsSnapshot.exists()
      ? (settingsSnapshot.data() as AdminStorefrontSettingsDocument)
      : null;

    return buildAdminSettingsReadResult(tenant, settings);
  }

  async getProducts(tenantId: AdminTenantId): Promise<AdminProductDocument[]> {
    const snapshot = await getDocs(collection(db, `tenants/${tenantId}/products`));

    return snapshot.docs.map(
      (productSnapshot) =>
        ({
          id: productSnapshot.id,
          ...productSnapshot.data(),
        }) as AdminProductDocument,
    );
  }
}
