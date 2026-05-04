import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD4isJNY4plXGsEWG5OCNTbplTQHiZuC34",
  authDomain: "whitelabel-6fb71.firebaseapp.com",
  projectId: "whitelabel-6fb71",
  storageBucket: "whitelabel-6fb71.firebasestorage.app",
  messagingSenderId: "96149507052",
  appId: "1:96149507052:web:375bf572df918609928ec9",
  measurementId: "G-1YFPSPK804"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 SEU MOCK (importe ou cole aqui)
import { CATALOG_SEED_DATA} from './CATALOG-SEED-DATA.ts';

// 🔥 MAPPER
function mapProduct(product: any, tenantId: string) {
  return {
    title: product.name,
    slug: product.slug,

    description: product.description,
    longDescription: product.longDescription ?? product.description,

    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,

    images: [
      {
        url: product.imgUrl,
        alt: product.imageAlt ?? product.name,
      },
      ...(product.gallery ?? [])
    ],

    category: product.category ?? null,

    tags: product.tags ?? [],
    highlights: product.highlights ?? [],

    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,

    active: true,

    tenantId,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

// 🔥 EXECUÇÃO
async function seed() {
  const tenantId = 'whitelabel';
  const ref = collection(db, `tenants/${tenantId}/products`);

  for (const product of CATALOG_SEED_DATA) {
    const mapped = mapProduct(product, tenantId);
    await addDoc(ref, mapped);
    console.log(`✔ Produto inserido: ${product.name}`);
  }

  console.log('🔥 SEED FINALIZADO');
}

seed().catch(console.error);