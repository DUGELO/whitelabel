import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { AdminProductDocument, AdminProductWriteInput } from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminStorageService } from '../services/admin-storage.service';
import { AdminProducts } from './admin-products';

describe('AdminProducts', () => {
  let fixture: ComponentFixture<AdminProducts>;
  let firestoreService: {
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    setProductActive: ReturnType<typeof vi.fn>;
  };
  let storageService: {
    uploadProductImage: ReturnType<typeof vi.fn>;
  };

  const product: AdminProductDocument = {
    id: 'product-1',
    active: true,
    tenantId: 'atelier-aurea',
    title: 'Anel Lumiere',
    slug: 'anel-lumiere',
    description: 'Anel autoral.',
    longDescription: 'Anel autoral com banho premium.',
    price: 120,
    compareAtPrice: 150,
    category: 'Aneis',
    tags: ['anel', 'lumiere'],
    highlights: ['Banho premium'],
    images: [{ url: 'https://cdn.test/anel.jpg', alt: 'Anel Lumiere', order: 0, kind: 'image' }],
    rating: 5,
    reviewCount: 4,
  };

  beforeEach(async () => {
    firestoreService = {
      createProduct: vi
        .fn()
        .mockImplementation((_tenantId: string, payload: AdminProductWriteInput) =>
          Promise.resolve({
            id: 'created-product',
            tenantId: 'atelier-aurea',
            ...payload,
          }),
        ),
      updateProduct: vi
        .fn()
        .mockImplementation(
          (_tenantId: string, productId: string, payload: AdminProductWriteInput) =>
            Promise.resolve({
              id: productId,
              tenantId: 'atelier-aurea',
              ...payload,
            }),
        ),
      setProductActive: vi.fn().mockResolvedValue({ ...product, active: false }),
    };
    storageService = {
      uploadProductImage: vi.fn().mockResolvedValue({
        url: 'https://storage.test/colar.jpg',
        path: 'tenants/atelier-aurea/products/colar-aurora/colar.jpg',
        fileName: 'colar.jpg',
        contentType: 'image/jpeg',
        size: 24,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AdminProducts],
      providers: [
        { provide: AdminFirestoreService, useValue: firestoreService },
        { provide: AdminStorageService, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProducts);
    fixture.componentRef.setInput('tenantId', 'atelier-aurea');
    fixture.componentRef.setInput('products', [product]);
    fixture.componentRef.setInput('canEditProducts', true);
    fixture.detectChanges();
  });

  it('should create a product through the admin Firestore service', async () => {
    clickButton('Novo produto');
    updateInput('title', 'Colar Aurora');
    updateInput('slug', 'colar-aurora');
    updateTextarea('description', 'Colar com acabamento premium.');
    updateInput('price', '180');
    updateTextarea('imagesText', 'https://cdn.test/colar.jpg');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.createProduct).toHaveBeenCalledWith(
      'atelier-aurea',
      expect.objectContaining({
        active: false,
        title: 'Colar Aurora',
        slug: 'colar-aurora',
        description: 'Colar com acabamento premium.',
        price: 180,
        images: [
          expect.objectContaining({
            url: 'https://cdn.test/colar.jpg',
            kind: 'image',
          }),
        ],
      }),
    );
  });

  it('should upload product images and save the resulting URLs', async () => {
    const image = new File(['image'], 'colar.jpg', { type: 'image/jpeg' });

    clickButton('Novo produto');
    updateInput('title', 'Colar Aurora');
    updateInput('slug', 'colar-aurora');
    updateTextarea('description', 'Colar com acabamento premium.');
    updateInput('price', '180');
    uploadFiles('imageUpload', [image]);

    await vi.waitFor(() => {
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea[name="imagesText"]'))
        .nativeElement as HTMLTextAreaElement;

      expect(textarea.value).toContain('https://storage.test/colar.jpg');
    });

    submitForm();

    await fixture.whenStable();

    expect(storageService.uploadProductImage).toHaveBeenCalledWith({
      tenantId: 'atelier-aurea',
      productSlug: 'colar-aurora',
      file: image,
    });
    expect(firestoreService.createProduct).toHaveBeenCalledWith(
      'atelier-aurea',
      expect.objectContaining({
        images: [
          expect.objectContaining({
            url: 'https://storage.test/colar.jpg',
            kind: 'image',
          }),
        ],
      }),
    );
  });

  it('should render a product preview from the current form', () => {
    clickButton('Novo produto');
    updateInput('title', 'Colar Aurora');
    updateInput('slug', 'colar-aurora');
    updateTextarea('description', 'Colar com acabamento premium.');
    updateInput('price', '180');
    updateTextarea('imagesText', 'https://cdn.test/colar.jpg');

    expect(fixture.nativeElement.textContent).toContain('Resumo do produto');
    expect(fixture.nativeElement.textContent).toContain('Colar Aurora');
    expect(fixture.nativeElement.textContent).toContain('R$');
    expect(fixture.nativeElement.textContent).toContain('Produto pronto para salvar');
  });

  it('should format admin product prices with the storefront currency', () => {
    fixture.componentRef.setInput('currencyCode', 'USD');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('US$');
  });

  it('should filter the product list by publication status', () => {
    fixture.componentRef.setInput('products', [
      product,
      {
        ...product,
        id: 'product-2',
        active: false,
        title: 'Colar Pausa',
        slug: 'colar-pausa',
        price: 80,
      },
    ]);
    fixture.detectChanges();

    clickButton('Inativos');

    expect(fixture.nativeElement.textContent).toContain('Colar Pausa');
    expect(fixture.nativeElement.textContent).not.toContain('Anel Lumiere');

    clickButton('Ativos');

    expect(fixture.nativeElement.textContent).toContain('Anel Lumiere');
    expect(fixture.nativeElement.textContent).not.toContain('Colar Pausa');
  });

  it('should block duplicate product slugs before saving', async () => {
    clickButton('Novo produto');
    updateInput('title', 'Outro Anel');
    updateInput('slug', 'anel-lumiere');
    updateTextarea('description', 'Produto com slug duplicado.');
    updateInput('price', '180');
    updateTextarea('imagesText', 'https://cdn.test/outro-anel.jpg');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.createProduct).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Ja existe um produto com este slug.');
  });

  it('should update an existing product', async () => {
    clickByAttribute('data-product-edit', 'product-1');
    updateInput('title', 'Anel Lumiere Atualizado');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.updateProduct).toHaveBeenCalledWith(
      'atelier-aurea',
      'product-1',
      expect.objectContaining({
        title: 'Anel Lumiere Atualizado',
        slug: 'anel-lumiere',
      }),
    );
  });

  it('should toggle product active state', async () => {
    clickByAttribute('data-product-toggle', 'product-1');

    await fixture.whenStable();

    expect(firestoreService.setProductActive).toHaveBeenCalledWith(
      'atelier-aurea',
      'product-1',
      false,
    );
  });

  it('should keep viewer role read-only', () => {
    fixture.componentRef.setInput('canEditProducts', false);
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    const uploadInput = fixture.nativeElement.querySelector(
      'input[name="imageUpload"]',
    ) as HTMLInputElement;

    expect(saveButton.disabled).toBe(true);
    expect(uploadInput.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('apenas leitura');
  });

  function updateInput(name: string, value: string): void {
    const input = fixture.debugElement.query(By.css(`input[name="${name}"]`))
      .nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function updateTextarea(name: string, value: string): void {
    const textarea = fixture.debugElement.query(By.css(`textarea[name="${name}"]`))
      .nativeElement as HTMLTextAreaElement;
    textarea.value = value;
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitForm(): void {
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  function uploadFiles(name: string, files: File[]): void {
    const input = fixture.debugElement.query(By.css(`input[name="${name}"]`))
      .nativeElement as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: files,
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function clickButton(text: string): void {
    const button = fixture.debugElement
      .queryAll(By.css('button'))
      .find((item) => (item.nativeElement as HTMLButtonElement).textContent?.includes(text))
      ?.nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }

  function clickByAttribute(attribute: string, value: string): void {
    const button = fixture.debugElement.query(By.css(`button[${attribute}="${value}"]`))
      .nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }
});
