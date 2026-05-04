import { Injectable, inject } from '@angular/core';
import { db } from './firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { mapToProduct } from '../../features/product/mapToProduct';
import { StorefrontConfig } from '../../core/storefront/storefront-config';

@Injectable({ providedIn: 'root' })
export class ProductFirestoreService {

async getProducts(tenantId: string) {
  const ref = collection(db, `tenants/${tenantId}/products`);
  const snapshot = await getDocs(ref);

  console.log('SNAPSHOT SIZE:', snapshot.size);
  console.log('DOCS:', snapshot.docs);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
}