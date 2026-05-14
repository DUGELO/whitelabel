import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { AdminProductDocument, AdminProductWriteInput } from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminProducts } from './admin-products';

describe('AdminProducts', () => {
  let fixture: ComponentFixture<AdminProducts>;
  let firestoreService: {
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    setProductActive: ReturnType<typeof vi.fn>;
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
      createProduct: vi.fn().mockImplementation(
        (_tenantId: string, payload: AdminProductWriteInput) =>
          Promise.resolve({
            id: 'created-product',
            tenantId: 'atelier-aurea',
            ...payload,
          }),
      ),
      updateProduct: vi.fn().mockImplementation(
        (_tenantId: string, productId: string, payload: AdminProductWriteInput) =>
          Promise.resolve({
            id: productId,
            tenantId: 'atelier-aurea',
            ...payload,
          }),
      ),
      setProductActive: vi.fn().mockResolvedValue({ ...product, active: false }),
    };

    await TestBed.configureTestingModule({
      imports: [AdminProducts],
      providers: [{ provide: AdminFirestoreService, useValue: firestoreService }],
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

    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(saveButton.disabled).toBe(true);
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
