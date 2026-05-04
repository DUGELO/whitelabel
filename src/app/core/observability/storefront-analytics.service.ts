import { Injectable, signal } from '@angular/core';

type AnalyticsEventName =
  | 'catalog_loaded'
  | 'catalog_load_error'
  | 'product_clicked'
  | 'primary_cta_clicked'
  | 'secondary_cta_clicked'
  | 'instagram_clicked'
  | 'whatsapp_clicked'
  | 'search_no_results';

export interface AnalyticsEventPayload {
  productId?: string;
  productSlug?: string;
  productTitle?: string;
  searchTerm?: string;
  category?: string;
  brandName?: string;
  channel?: string;
}

export interface AnalyticsEventRecord {
  name: AnalyticsEventName;
  payload: AnalyticsEventPayload;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorefrontAnalyticsService {
  readonly events = signal<AnalyticsEventRecord[]>([]);
  private readonly emittedSearchSignatures = new Set<string>();

  track(name: AnalyticsEventName, payload: AnalyticsEventPayload): void {
    this.events.update((events) => [
      ...events,
      {
        name,
        payload,
        timestamp: new Date().toISOString(),
      },
    ]);

    console.info('[storefront-analytics]', name, payload);
  }

  trackSearchNoResults(payload: AnalyticsEventPayload): void {
    const signature = JSON.stringify(payload);
    if (this.emittedSearchSignatures.has(signature)) {
      return;
    }

    this.emittedSearchSignatures.add(signature);
    this.track('search_no_results', payload);
  }
}