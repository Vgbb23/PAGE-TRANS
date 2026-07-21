export const BRAND = {
  name: 'Quantum Nutrition Trans Resveratrol',
  company: 'Quantum Nutrition®',
  shortName: 'Trans Resveratrol',
  tagline:
    'Trans Resveratrol em cápsulas — suplemento alimentar premium para quem valoriza antioxidantes, pureza e envelhecimento saudável.',
  logo: '/quantum-trans-resveratrol-product.webp',
  heroImage: '/quantum-trans-resveratrol-hero.webp',
  productImage: '/quantum-trans-resveratrol-product.png',
  capsuleImage: '/quantum-trans-resveratrol-capsula.webp',
  qualityImage: '/quantum-trans-resveratrol-laudo.png',
  nutritionImage: '/quantum-trans-resveratrol-tabela.png',
} as const;

export const SEO = {
  title: 'Trans Resveratrol Quantum Nutrition | Suplemento Premium 60 Cápsulas',
  description:
    'Trans Resveratrol Quantum Nutrition — forma biologicamente ativa (Trans), alta pureza e 60 cápsulas. Suplemento alimentar premium para quem busca antioxidantes e qualidade de vida.',
  slug: 'trans-resveratrol-quantum-nutrition',
  h1: 'Proteção antioxidante para quem quer viver mais e melhor.',
  keywords: [
    'trans resveratrol',
    'resveratrol',
    'quantum nutrition',
    'suplemento antioxidante',
    'envelhecimento saudável',
    'longevidade',
    'suplemento premium',
    'polifenol',
    'forma trans resveratrol',
    '60 cápsulas',
  ],
} as const;

export interface Offer {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  installments: string;
  image: string;
  popular: boolean;
  capsules: string;
}

export const OFFERS: Offer[] = [
  {
    id: 1,
    name: 'KIT ESSENCIAL',
    price: '34,90',
    originalPrice: '69,90',
    installments: '3x de R$ 11,63',
    image: '/quantum-trans-resveratrol-product.webp',
    popular: false,
    capsules: '1 frasco • 60 cápsulas',
  },
  {
    id: 2,
    name: 'KIT DUPLO',
    price: '49,90',
    originalPrice: '99,80',
    installments: '3x de R$ 16,63',
    image: '/quantum-trans-resveratrol-offer-2.png',
    popular: true,
    capsules: '2 frascos • 120 cápsulas',
  },
  {
    id: 3,
    name: 'MELHOR CUSTO-BENEFÍCIO',
    price: '69,90',
    originalPrice: '149,70',
    installments: '3x de R$ 23,30',
    image: '/quantum-trans-resveratrol-offer-3.png',
    popular: false,
    capsules: '3 frascos • 180 cápsulas',
  },
];
