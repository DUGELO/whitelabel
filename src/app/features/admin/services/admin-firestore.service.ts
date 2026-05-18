import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore';

import { db } from '../../../core/firebase/firebase.config';
import {
  AdminProductDocument,
  AdminProductWriteInput,
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

  async saveStorefrontSettings(
    tenantId: AdminTenantId,
    settings: AdminStorefrontSettingsDocument,
  ): Promise<AdminSettingsReadResult> {
    const { createdAt, updatedAt, ...settingsWithoutTimestamps } = settings;
    const payload = {
      ...this.removeUndefinedFields(settingsWithoutTimestamps),
      createdAt: createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, `tenants/${tenantId}/settings`, 'main'), payload);

    const savedSettings = await this.getStorefrontSettings(tenantId);

    if (!savedSettings) {
      throw new Error('Settings saved, but tenant could not be reloaded.');
    }

    return savedSettings;
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

  async createProduct(
    tenantId: AdminTenantId,
    product: AdminProductWriteInput,
  ): Promise<AdminProductDocument> {
    const payload = {
      ...this.removeUndefinedFields(product),
      tenantId,
      rating: product.rating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const productRef = await addDoc(collection(db, `tenants/${tenantId}/products`), payload);

    return this.readProductDocument(productRef);
  }

  async updateProduct(
    tenantId: AdminTenantId,
    productId: string,
    product: AdminProductWriteInput,
  ): Promise<AdminProductDocument> {
    const productRef = doc(db, `tenants/${tenantId}/products`, productId);
    const payload = {
      ...this.removeUndefinedFields(product),
      tenantId,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(productRef, payload);

    return this.readProductDocument(productRef);
  }

  async setProductActive(
    tenantId: AdminTenantId,
    productId: string,
    active: boolean,
  ): Promise<AdminProductDocument> {
    const productRef = doc(db, `tenants/${tenantId}/products`, productId);

    await updateDoc(productRef, {
      active,
      updatedAt: serverTimestamp(),
    });

    return this.readProductDocument(productRef);
  }

  private async readProductDocument(productRef: DocumentReference): Promise<AdminProductDocument> {
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      throw new Error('Product saved, but document could not be reloaded.');
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as AdminProductDocument;
  }

  private removeUndefinedFields<T>(value: T): T {
    if (Array.isArray(value)) {
      return value.map((item) => this.removeUndefinedFields(item)) as T;
    }

    if (value && typeof value === 'object') {
      return Object.entries(value).reduce<Record<string, unknown>>((result, [key, item]) => {
        if (item !== undefined) {
          result[key] = this.removeUndefinedFields(item);
        }

        return result;
      }, {}) as T;
    }

    return value;
  }
}
