import { Component, computed, inject, input, output, signal } from '@angular/core';

import {
  AdminProductDocument,
  AdminProductImage,
  AdminProductWriteInput,
  AdminTenantId,
} from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminStorageService } from '../services/admin-storage.service';

const MAX_PRODUCT_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ProductStatusFilter = 'all' | 'active' | 'inactive';

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

interface AdminProductPreview {
  title: string;
  slug: string;
  description: string;
  priceLabel: string;
  compareAtPriceLabel: string;
  category: string;
  statusLabel: string;
  imageUrl: string | null;
  imageAlt: string;
  imagesCount: number;
  tags: string[];
  highlights: string[];
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
  readonly currencyCode = input('BRL');
  readonly canEditProducts = input.required<boolean>();
  readonly productChanged = output<AdminProductDocument>();

  private readonly adminFirestore = inject(AdminFirestoreService);
  private readonly adminStorage = inject(AdminStorageService);

  protected readonly selectedProductId = signal<string | null>(null);
  protected readonly form = signal<AdminProductFormState>(this.createInitialFormState());
  protected readonly isSaving = signal(false);
  protected readonly isUploading = signal(false);
  protected readonly pendingProductId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly productStatusFilter = signal<ProductStatusFilter>('all');

  protected readonly isReadOnly = computed(() => !this.canEditProducts());
  protected readonly validationIssues = computed(() => this.collectValidationIssues(this.form()));
  protected readonly productPreview = computed(() => this.buildProductPreview(this.form()));
  protected readonly selectedProduct = computed(() => {
    const productId = this.selectedProductId();

    return productId ? (this.products().find((product) => product.id === productId) ?? null) : null;
  });
  protected readonly isEditing = computed(() => Boolean(this.selectedProductId()));
  protected readonly sortedProducts = computed(() =>
    [...this.products()].sort((left, right) => left.title.localeCompare(right.title)),
  );
  protected readonly filteredProducts = computed(() => {
    const filter = this.productStatusFilter();
    const products = this.sortedProducts();

    if (filter === 'active') {
      return products.filter((product) => product.active);
    }

    if (filter === 'inactive') {
      return products.filter((product) => !product.active);
    }

    return products;
  });
  protected readonly activeProductsCount = computed(
    () => this.products().filter((product) => product.active).length,
  );
  protected readonly inactiveProductsCount = computed(
    () => this.products().filter((product) => !product.active).length,
  );
  protected readonly productFilterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
  ] satisfies Array<{ value: ProductStatusFilter; label: string }>;

  protected productFilterCount(filter: ProductStatusFilter): number {
    if (filter === 'active') {
      return this.activeProductsCount();
    }

    if (filter === 'inactive') {
      return this.inactiveProductsCount();
    }

    return this.products().length;
  }

  protected startCreate(): void {
    if (this.isUploading()) {
      this.errorMessage.set('Aguarde o envio das imagens terminar.');
      return;
    }

    this.selectedProductId.set(null);
    this.form.set(this.createInitialFormState());
    this.clearFeedback();
  }

  protected editProduct(product: AdminProductDocument): void {
    if (this.isUploading()) {
      this.errorMessage.set('Aguarde o envio das imagens terminar.');
      return;
    }

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

  protected handleImageUpload(event: Event): void {
    void this.uploadImages(event);
  }

  protected setProductStatusFilter(filter: ProductStatusFilter): void {
    this.productStatusFilter.set(filter);
  }

  protected productThumbnail(product: AdminProductDocument): string | null {
    return (product.images ?? []).find((image) => this.isValidUrl(image.url))?.url ?? null;
  }

  protected async handleToggleActive(product: AdminProductDocument): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu acesso atual permite apenas leitura.');
      return;
    }

    if (this.isUploading()) {
      this.errorMessage.set('Aguarde o envio das imagens terminar.');
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
      currency: this.currencyCode(),
    }).format(value ?? 0);
  }

  private async saveProduct(): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu acesso atual permite apenas leitura.');
      return;
    }

    if (this.isUploading()) {
      this.errorMessage.set('Aguarde o envio das imagens terminar.');
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

  private async uploadImages(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (this.isReadOnly()) {
      this.errorMessage.set('Seu acesso atual permite apenas leitura.');
      input.value = '';
      return;
    }

    if (files.length === 0) {
      return;
    }

    const productSlug = this.resolveProductSlugForUpload();
    const validationMessage =
      this.validateImageFiles(files) ?? this.validateUploadSlug(productSlug);

    if (validationMessage) {
      this.errorMessage.set(validationMessage);
      input.value = '';
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const uploadedImages = await Promise.all(
        files.map((file) =>
          this.adminStorage.uploadProductImage({
            tenantId: this.tenantId(),
            productSlug,
            file,
          }),
        ),
      );

      this.form.update((form) => ({
        ...form,
        slug: form.slug.trim() || productSlug,
        imagesText: this.mergeImageUrls(
          form.imagesText,
          uploadedImages.map((image) => image.url),
        ),
      }));
      this.successMessage.set(
        uploadedImages.length === 1 ? 'Imagem enviada.' : 'Imagens enviadas.',
      );
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.isUploading.set(false);
      input.value = '';
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
    return this.validationIssues()[0] ?? null;
  }

  private collectValidationIssues(form: AdminProductFormState): string[] {
    const issues: string[] = [];
    const title = form.title.trim();
    const slug = form.slug.trim();
    const description = form.description.trim();
    const price = this.parseOptionalNumber(form.price);
    const compareAtPrice = this.parseOptionalNumber(form.compareAtPrice);
    const images = this.parseImages(form.imagesText, title);

    if (!title) {
      issues.push('Informe o titulo do produto.');
    }

    if (!slug) {
      issues.push('Informe o slug do produto.');
    } else if (!PRODUCT_SLUG_PATTERN.test(slug)) {
      issues.push('Use um slug em minusculas, numeros e hifens.');
    } else if (this.isDuplicateSlug(slug)) {
      issues.push('Ja existe um produto com este slug.');
    }

    if (!description) {
      issues.push('Informe a descricao curta.');
    }

    if (price === undefined || price <= 0) {
      issues.push('Informe um preco valido.');
    }

    if (compareAtPrice !== undefined && price !== undefined && compareAtPrice < price) {
      issues.push('O preco comparativo deve ser maior ou igual ao preco.');
    }

    if (images.length === 0) {
      issues.push('Informe ao menos uma imagem.');
    }

    if (images.some((image) => !this.isValidUrl(image.url))) {
      issues.push('Informe URLs validas para as imagens.');
    }

    return issues;
  }

  private buildProductPreview(form: AdminProductFormState): AdminProductPreview {
    const title = form.title.trim();
    const description = form.description.trim();
    const price = this.parseOptionalNumber(form.price);
    const compareAtPrice = this.parseOptionalNumber(form.compareAtPrice);
    const tags = this.parseTextList(form.tagsText);
    const highlights = this.parseTextList(form.highlightsText);
    const images = this.parseImages(form.imagesText, title);
    const imageUrl = images.find((image) => this.isValidUrl(image.url))?.url ?? null;

    return {
      title: title || 'Produto sem titulo',
      slug: form.slug.trim() || 'slug-pendente',
      description: description || 'Descricao pendente',
      priceLabel: price === undefined ? 'Preco pendente' : this.formatPrice(price),
      compareAtPriceLabel:
        compareAtPrice === undefined ? 'Sem preco comparativo' : this.formatPrice(compareAtPrice),
      category: form.category.trim() || 'Sem categoria',
      statusLabel: form.active ? 'Ativo' : 'Inativo',
      imageUrl,
      imageAlt: title || 'Preview do produto',
      imagesCount: images.length,
      tags,
      highlights,
    };
  }

  private isDuplicateSlug(slug: string): boolean {
    const selectedProductId = this.selectedProductId();

    return this.products().some(
      (product) => product.slug === slug && product.id !== selectedProductId,
    );
  }

  private validateImageFiles(files: File[]): string | null {
    const unsupportedFile = files.find((file) => !file.type.startsWith('image/'));

    if (unsupportedFile) {
      return 'Envie apenas arquivos de imagem.';
    }

    const oversizedFile = files.find((file) => file.size > MAX_PRODUCT_IMAGE_FILE_SIZE_BYTES);

    if (oversizedFile) {
      return 'Cada imagem deve ter no maximo 5 MB.';
    }

    return null;
  }

  private validateUploadSlug(productSlug: string): string | null {
    if (!productSlug) {
      return 'Informe titulo ou slug antes de enviar imagens.';
    }

    if (!PRODUCT_SLUG_PATTERN.test(productSlug)) {
      return 'Use um slug em minusculas, numeros e hifens antes do upload.';
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

  private mergeImageUrls(currentValue: string, uploadedUrls: string[]): string {
    const currentUrls = currentValue
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    return [...currentUrls, ...uploadedUrls].join('\n');
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

  private resolveProductSlugForUpload(): string {
    const form = this.form();

    return form.slug.trim() || this.slugify(form.title);
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
