import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { storage } from '../../../core/firebase/firebase.config';
import { AdminTenantId } from '../models/admin-firestore.models';

export interface AdminProductImageUploadInput {
  tenantId: AdminTenantId;
  productSlug: string;
  file: File;
}

export interface AdminProductImageUploadResult {
  url: string;
  path: string;
  fileName: string;
  contentType: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminStorageService {
  async uploadProductImage({
    tenantId,
    productSlug,
    file,
  }: AdminProductImageUploadInput): Promise<AdminProductImageUploadResult> {
    const tenantSegment = this.requireStorageSegment(tenantId, 'tenantId');
    const productSegment = this.requireStorageSegment(productSlug, 'slug do produto');
    const fileName = this.buildFileName(file.name);
    const path = `tenants/${tenantSegment}/products/${productSegment}/${fileName}`;
    const storageRef = ref(storage, path);
    const contentType = file.type || 'application/octet-stream';
    const snapshot = await uploadBytes(storageRef, file, { contentType });
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path,
      fileName,
      contentType,
      size: file.size,
    };
  }

  private buildFileName(fileName: string): string {
    const safeName =
      fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'image';

    return `${Date.now()}-${safeName}`;
  }

  private requireStorageSegment(value: string, label: string): string {
    const segment = value.trim();

    if (!segment || segment.includes('/')) {
      throw new Error(`Informe um ${label} valido para enviar imagens.`);
    }

    return segment;
  }
}
