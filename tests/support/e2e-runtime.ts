import { Page } from '@playwright/test';

import { STOREFRONT_CONFIG, StorefrontConfig } from '../../src/app/core/storefront/storefront-config';
import { StorefrontThemeConfig } from '../../src/app/core/theme/models/theme-config.types';

declare global {
  interface Window {
    __WHITE_LABEL_E2E__?: boolean;
    __WHITE_LABEL_E2E_PRODUCTS__?: unknown;
    __WHITE_LABEL_E2E_STOREFRONT_CONFIG__?: unknown;
  }
}

export const regressionProducts = [
  {
    id: 'ring-solitaire',
    slug: 'anel-solitario-aurora',
    title: 'Anel Solitario Aurora',
    description: 'Ouro 18k com diamante central para pedidos inesqueciveis.',
    longDescription:
      'Uma joia autoral com acabamento polido, diamante central e aro confortavel para uso diario.',
    price: 3500,
    compareAtPrice: 4100,
    category: 'Aneis',
    tags: ['anel', 'ouro', 'diamante', 'noivado'],
    rating: 4.9,
    reviewCount: 128,
    highlights: ['Ouro 18k', 'Diamante certificado', 'Ajuste incluso'],
    images: [
      {
        url: '/jewelry-ring-solitaire.svg',
        alt: 'Anel solitario em ouro com diamante',
      },
    ],
  },
  {
    id: 'bracelet-tennis',
    slug: 'pulseira-tennis-luz',
    title: 'Pulseira Tennis Luz',
    description: 'Pulseira cravejada com brilho continuo e fecho de seguranca.',
    longDescription:
      'Criada para composicoes sofisticadas, com pedras alinhadas e acabamento de alta durabilidade.',
    price: 5200,
    category: 'Pulseiras',
    tags: ['pulseira', 'tennis', 'presente'],
    rating: 4.8,
    reviewCount: 86,
    highlights: ['Fecho duplo', 'Pronta para presente'],
    images: [
      {
        url: '/jewelry-bracelet-tennis.svg',
        alt: 'Pulseira tennis cravejada',
      },
    ],
  },
  {
    id: 'necklace-drop',
    slug: 'colar-gota-serena',
    title: 'Colar Gota Serena',
    description: 'Colar delicado com pingente gota para camadas minimalistas.',
    longDescription:
      'Uma peca leve com corrente ajustavel, pensada para combinar com joias de uso cotidiano.',
    price: 2200,
    category: 'Colares',
    tags: ['colar', 'pingente', 'minimalista'],
    rating: 4.7,
    reviewCount: 54,
    highlights: ['Corrente ajustavel', 'Prata 925'],
    images: [
      {
        url: '/jewelry-necklace-drop.svg',
        alt: 'Colar com pingente em formato de gota',
      },
    ],
  },
  {
    id: 'earrings-hoops',
    slug: 'brincos-argola-riviera',
    title: 'Brincos Argola Riviera',
    description: 'Argolas polidas com presenca luminosa para composicoes noturnas.',
    longDescription:
      'Brincos em formato de argola com desenho leve, encaixe confortavel e acabamento premium.',
    price: 2800,
    category: 'Brincos',
    tags: ['brincos', 'argola', 'rivieria'],
    rating: 4.6,
    reviewCount: 41,
    highlights: ['Banho premium', 'Fecho italiano'],
    images: [
      {
        url: '/jewelry-earrings-hoops.svg',
        alt: 'Brincos de argola polidos',
      },
    ],
  },
];

export async function seedE2ERuntime(
  page: Page,
  config: StorefrontConfig = createStorefrontConfig(),
): Promise<void> {
  await page.addInitScript(
    ({ products, storefrontConfig }) => {
      window.__WHITE_LABEL_E2E__ = true;
      window.__WHITE_LABEL_E2E_PRODUCTS__ = products;
      window.__WHITE_LABEL_E2E_STOREFRONT_CONFIG__ = storefrontConfig;
    },
    {
      products: regressionProducts,
      storefrontConfig: config,
    },
  );
}

export function createStorefrontConfig(theme: StorefrontThemeConfig = STOREFRONT_CONFIG.theme) {
  return {
    ...STOREFRONT_CONFIG,
    tenantId: `e2e-${theme.preset}`,
    brand: {
      ...STOREFRONT_CONFIG.brand,
      name: `Loja ${theme.preset}`,
      logoAlt: `Loja ${theme.preset}`,
      homeAriaLabel: `Loja ${theme.preset} home`,
    },
    theme,
  };
}
