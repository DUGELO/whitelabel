import { STOREFRONT_CONFIG } from '../../core/storefront/storefront-config';
import { mapToProduct } from './mapToProduct';

describe('mapToProduct', () => {
  it('should build product action links from the active storefront config', () => {
    const product = mapToProduct(
      {
        id: 'produto-1',
        slug: 'produto-1',
        title: 'Produto Teste',
        description: 'Descricao teste',
        price: 120,
        images: [{ url: 'produto.jpg', alt: 'Produto teste' }],
      },
      {
        ...STOREFRONT_CONFIG,
        socialLinks: {
          instagramUrl: 'https://instagram.com/loja',
          whatsappUrl: 'https://wa.me/5598984655819',
        },
        catalog: {
          ...STOREFRONT_CONFIG.catalog,
          currencyCode: 'USD',
          defaultWhatsAppMessage: 'Tenho interesse em:',
        },
      },
    );

    expect(product.price.currencyCode).toBe('USD');
    expect(product.actionLinks.productUrl).toBe('/products/produto-1');
    expect(product.actionLinks.instagramUrl).toBe('https://instagram.com/loja');
    expect(product.actionLinks.whatsappUrl).toContain('https://wa.me/5598984655819');
    expect(product.actionLinks.whatsappUrl).toContain('Tenho+interesse+em%3A+Produto+Teste');
  });
});
