import { Component, computed, inject, input, output, signal } from '@angular/core';

import {
  AdminProductDocument,
  AdminProductImage,
  AdminProductWriteInput,
  AdminTenantId,
} from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';

interface AdminProductFormState {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  price: string;
  compareAtPrice: string;
  category: string;
  tagsText: string;
  highlightsText: string;
  imagesText: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-products',
  imports: [],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
})
export class AdminProducts {
  readonly tenantId = input.required<AdminTenantId>();
  readonly products = input.required<AdminProductDocument[]>();
  readonly canEditProducts = input.required<boolean>();
  readonly productChanged = output<AdminProductDocument>();

  private readonly adminFirestore = inject(AdminFirestoreService);

  protected readonly selectedProductId = signal<string | null>(null);
  protected readonly form = signal<AdminProductFormState>(this.createInitialFormState());
  protected readonly isSaving = signal(false);
  protected readonly pendingProductId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly isReadOnly = computed(() => !this.canEditProducts());
  protected readonly selectedProduct = computed(() => {
    const productId = this.selectedProductId();

    return productId ? this.products().find((product) => product.id === productId) ?? null : null;
  });
  protected readonly isEditing = computed(() => Boolean(this.selectedProductId()));
  protected readonly sortedProducts = computed(() =>
    [...this.products()].sort((left, right) => left.title.localeCompare(right.title)),
  );
  protected readonly activeProductsCount = computed(
    () => this.products().filter((product) => product.active).length,
  );

  protected startCreate(): void {
    this.selectedProductId.set(null);
    this.form.set(this.createInitialFormState());
    this.clearFeedback();
  }

  protected editProduct(product: AdminProductDocument): void {
    this.selectedProductId.set(product.id);
    this.form.set(this.createFormFromProduct(product));
    this.clearFeedback();
  }

  protected updateTextField(field: keyof AdminProductFormState, event: Event): void {
    const value = this.readInputValue(event);

    this.form.update((form) => {
      const nextForm = {
        ...form,
        [field]: value,
      };

      if (field === 'title' && !this.isEditing() && !form.slug.trim()) {
        nextForm.slug = this.slugify(value);
      }

      return nextForm;
    });
    this.clearFeedback();
  }

  protected updateActive(event: Event): void {
    const active = (event.target as HTMLInputElement).checked;
    this.form.update((form) => ({ ...form, active }));
    this.clearFeedback();
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    void this.saveProduct();
  }

  protected async handleToggleActive(product: AdminProductDocument): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu role atual permite apenas leitura.');
      return;
    }

    this.pendingProductId.set(product.id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const savedProduct = await this.adminFirestore.setProductActive(
        this.tenantId(),
        product.id,
        !product.active,
      );

      this.productChanged.emit(savedProduct);

      if (this.selectedProductId() === savedProduct.id) {
        this.form.set(this.createFormFromProduct(savedProduct));
      }

      this.successMessage.set(savedProduct.active ? 'Produto ativado.' : 'Produto desativado.');
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.pendingProductId.set(null);
    }
  }

  protected formatPrice(value: number | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  private async saveProduct(): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu role atual permite apenas leitura.');
      return;
    }

    const validationMessage = this.validateForm();

    if (validationMessage) {
      this.errorMessage.set(validationMessage);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const productId = this.selectedProductId();
      const payload = this.buildProductPayload();
      const savedProduct = productId
        ? await this.adminFirestore.updateProduct(this.tenantId(), productId, payload)
        : await this.adminFirestore.createProduct(this.tenantId(), payload);

      this.productChanged.emit(savedProduct);
      this.selectedProductId.set(savedProduct.id);
      this.form.set(this.createFormFromProduct(savedProduct));
      this.successMessage.set(productId ? 'Produto atualizado.' : 'Produto criado.');
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.isSaving.set(false);
    }
  }

  private buildProductPayload(): AdminProductWriteInput {
    const selectedProduct = this.selectedProduct();
    const form = this.form();
    const compareAtPrice = this.parseOptionalNumber(form.compareAtPrice);

    return {
      active: form.active,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || undefined,
      price: this.parseRequiredNumber(form.price),
      compareAtPrice,
      category: form.category.trim() || undefined,
      tags: this.parseTextList(form.tagsText),
      highlights: this.parseTextList(form.highlightsText),
      images: this.parseImages(form.imagesText, form.title.trim()),
      rating: selectedProduct?.rating ?? 0,
      reviewCount: selectedProduct?.reviewCount ?? 0,
    };
  }

  private validateForm(): string | null {
    const form = this.form();
    const price = this.parseOptionalNumber(form.price);
    const compareAtPrice = this.parseOptionalNumber(form.compareAtPrice);
    const images = this.parseImages(form.imagesText, form.title.trim());

    if (!form.title.trim()) {
      return 'Informe o titulo do produto.';
    }

    if (!form.slug.trim()) {
      return 'Informe o slug do produto.';
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      return 'Use um slug em minusculas, numeros e hifens.';
    }

    if (!form.description.trim()) {
      return 'Informe a descricao curta.';
    }

    if (price === undefined || price <= 0) {
      return 'Informe um preco valido.';
    }

    if (compareAtPrice !== undefined && compareAtPrice < price) {
      return 'O preco comparativo deve ser maior ou igual ao preco.';
    }

    if (images.length === 0) {
      return 'Informe ao menos uma imagem.';
    }

    if (images.some((image) => !this.isValidUrl(image.url))) {
      return 'Informe URLs validas para as imagens.';
    }

    return null;
  }

  private createInitialFormState(): AdminProductFormState {
    return {
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      price: '',
      compareAtPrice: '',
      category: '',
      tagsText: '',
      highlightsText: '',
      imagesText: '',
      active: false,
    };
  }

  private createFormFromProduct(product: AdminProductDocument): AdminProductFormState {
    return {
      title: product.title ?? '',
      slug: product.slug ?? '',
      description: product.description ?? '',
      longDescription: product.longDescription ?? '',
      price: this.formatNumberInput(product.price),
      compareAtPrice: this.formatNumberInput(product.compareAtPrice),
      category: product.category ?? '',
      tagsText: (product.tags ?? []).join(', '),
      highlightsText: (product.highlights ?? []).join('\n'),
      imagesText: (product.images ?? []).map((image) => image.url).join('\n'),
      active: product.active ?? false,
    };
  }

  private parseTextList(value: string): string[] {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private parseImages(value: string, productTitle: string): AdminProductImage[] {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((url, index) => ({
        url,
        alt: productTitle,
        order: index,
        kind: 'image' as const,
      }));
  }

  private parseRequiredNumber(value: string): number {
    return Number(value.replace(',', '.'));
  }

  private parseOptionalNumber(value: string): number | undefined {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return undefined;
    }

    const numberValue = Number(normalizedValue.replace(',', '.'));

    return Number.isFinite(numberValue) ? numberValue : undefined;
  }

  private formatNumberInput(value: number | undefined): string {
    return value === undefined || value === null ? '' : String(value);
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);

      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private clearFeedback(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Nao foi possivel salvar o produto agora.';
  }
}
