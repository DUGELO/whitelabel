import type { Meta, StoryObj } from '@storybook/angular';

import { ProductCard } from './product-card';

const baseProduct = {
  id: 1,
  slug: 'linen-midi-dress',
  title: 'Vestido Midi de Linho',
  shortDescription: 'Modelagem leve para campanhas de giro rapido no Instagram.',
  longDescription: 'Vestido com caimento solto, tecido leve e foco em conversao comercial.',
  imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Vestido midi em destaque',
  category: 'Vestidos',
  tags: ['novo', 'leve'],
  rating: 4.8,
  reviewCount: 126,
  highlights: ['Tecido leve', 'Entrega rapida'],
  media: [
    {
      src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Vestido midi em destaque',
      kind: 'image' as const,
    },
  ],
  price: {
    amount: 129.9,
    currencyCode: 'BRL',
    compareAtAmount: 159.9,
  },
  actionLinks: {
    productUrl: '/products/linen-midi-dress',
    whatsappUrl: 'https://wa.me/5511999999999?text=Tenho%20interesse%20neste%20produto',
    instagramUrl: 'https://instagram.com/catalogflow',
  },
};

const meta: Meta<ProductCard> = {
  title: 'Design System/Product Card',
  component: ProductCard,
  args: {
    product: baseProduct,
  },
};

export default meta;

type Story = StoryObj<ProductCard>;

export const Default: Story = {};

export const PromotionalPrice: Story = {
  args: {
    product: {
      ...baseProduct,
      price: {
        ...baseProduct.price,
        amount: 99.9,
        compareAtAmount: 149.9,
      },
    },
  },
};

export const WithoutImage: Story = {
  args: {
    product: {
      ...baseProduct,
      imageUrl: 'https://placehold.co/1200x900/f8f4ef/665e59?text=Sem+imagem',
      imageAlt: 'Produto sem imagem principal',
    },
  },
};

export const AlternateBranding: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:var(--spacing-lg);max-width:360px;background:color-mix(in srgb, var(--color-background-surface-soft) 40%, transparent);">
        <app-product-card [product]="product"></app-product-card>
      </div>
    `,
  }),
  args: {
    product: {
      ...baseProduct,
      title: 'Colecao Natural Premium',
    },
  },
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="max-width:360px;padding:var(--spacing-lg);border:1px solid var(--color-border);border-radius:var(--border-radius-card);background:var(--color-surface);">
        <div style="aspect-ratio:4/3;background:var(--color-surface-soft);border-radius:var(--border-radius-card);"></div>
        <div style="height:var(--spacing-lg);background:var(--color-surface-soft);margin-top:var(--spacing-md);border-radius:var(--border-radius-sm);"></div>
        <div style="height:var(--spacing-md);background:var(--color-surface-soft);margin-top:var(--spacing-sm-md);border-radius:var(--border-radius-sm);width:70%;"></div>
      </div>
    `,
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <div style="max-width:360px;padding:var(--spacing-lg);border:1px dashed var(--color-border);border-radius:var(--border-radius-card);background:var(--color-surface);text-align:center;">
        <h3 style="margin:0 0 var(--spacing-sm-md);">Nenhum produto na vitrine</h3>
        <p style="margin:0;color:var(--color-text-muted);">Use esta variante para validar estados vazios da vitrine.</p>
      </div>
    `,
  }),
};

export const PrimaryAndSecondaryCtas: Story = {
  args: {
    product: {
      ...baseProduct,
      title: 'Colecao com CTA completo',
    },
  },
};
