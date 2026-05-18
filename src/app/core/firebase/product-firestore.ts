import { Injectable } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class ProductFirestoreService {
  async getProducts(tenantId: string): Promise<Array<{ id: string; [key: string]: unknown }>> {
    const localE2EProducts = readLocalE2EProducts(tenantId);

    if (localE2EProducts) {
      return localE2EProducts;
    }

    const productsQuery = query(
      collection(db, `tenants/${tenantId}/products`),
      where('active', '==', true),
    );
    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map((productSnapshot) => ({
      id: productSnapshot.id,
      ...productSnapshot.data(),
    }));
  }
}

function readLocalE2EProducts(
  tenantId: string,
): Array<{ id: string; [key: string]: unknown }> | null {
  if (!isLocalE2ERuntime()) {
    return null;
  }

  const runtime = globalThis as typeof globalThis & {
    __WHITE_LABEL_E2E_PRODUCTS__?: unknown;
  };
  const products = runtime.__WHITE_LABEL_E2E_PRODUCTS__;

  if (Array.isArray(products)) {
    return products.filter(isFirestoreProductLike);
  }

  if (isRecord(products) && Array.isArray(products[tenantId])) {
    return products[tenantId].filter(isFirestoreProductLike);
  }

  return [];
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

function isFirestoreProductLike(value: unknown): value is { id: string; [key: string]: unknown } {
  return Boolean(value && typeof value === 'object' && 'id' in value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
