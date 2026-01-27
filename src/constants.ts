import { Product, Country, PaymentMethod } from './types';

export const CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Beauté', 'Sport'];

export const COUNTRIES: Country[] = [
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    prefix: '+225',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MTN_MONEY, PaymentMethod.WAVE, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    prefix: '+221',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.FREE_MONEY, PaymentMethod.WAVE]
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    prefix: '+237',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MTN_MONEY]
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    prefix: '+223',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'BJ',
    name: 'Bénin',
    flag: '🇧🇯',
    prefix: '+229',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY, PaymentMethod.MTN_MONEY]
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    prefix: '+226',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    prefix: '+228',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    prefix: '+241',
    operators: [PaymentMethod.ORANGE_MONEY]
  },
  {
    code: 'CG',
    name: 'Congo',
    flag: '🇨🇬',
    prefix: '+242',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'CD',
    name: 'République Démocratique du Congo',
    flag: '🇨🇩',
    prefix: '+243',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MTN_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    prefix: '+227',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'GW',
    name: 'Guinée-Bissau',
    flag: '🇬🇼',
    prefix: '+245',
    operators: [PaymentMethod.ORANGE_MONEY]
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    prefix: '+254',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.WAVE]
  },
  {
    code: 'TZ',
    name: 'Tanzanie',
    flag: '🇹🇿',
    prefix: '+255',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.WAVE]
  },
  {
    code: 'UG',
    name: 'Ouganda',
    flag: '🇺🇬',
    prefix: '+256',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MTN_MONEY]
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    prefix: '+250',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MTN_MONEY]
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    prefix: '+233',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.WAVE]
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    prefix: '+234',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  },
  {
    code: 'ZA',
    name: 'Afrique du Sud',
    flag: '🇿🇦',
    prefix: '+27',
    operators: [PaymentMethod.ORANGE_MONEY]
  },
  {
    code: 'MA',
    name: 'Maroc',
    flag: '🇲🇦',
    prefix: '+212',
    operators: [PaymentMethod.ORANGE_MONEY, PaymentMethod.MOOV_MONEY]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Le dernier smartphone Apple avec processeur A17 Bionic et appareil photo 48MP.',
    price: 850000,
    category: 'Électronique',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    sellerId: 'vendeur-1'
  },
  {
    id: '2',
    name: 'Baskets Nike Air Max',
    description: 'Confort exceptionnel et design iconique pour vos sorties quotidiennes.',
    price: 75000,
    category: 'Mode',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    sellerId: 'vendeur-1'
  },
  {
    id: '3',
    name: 'Machine à Café Espresso',
    description: 'Commencez votre journée avec un café riche et onctueux à la maison.',
    price: 125000,
    category: 'Maison',
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=600',
    rating: 4.2,
    sellerId: 'vendeur-1'
  },
  {
    id: '4',
    name: 'Casque Bluetooth Sony WH',
    description: 'Réduction de bruit active et autonomie de 30 heures.',
    price: 180000,
    category: 'Électronique',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    sellerId: 'vendeur-1'
  },
  {
    id: '5',
    name: 'Sac à Main de Luxe',
    description: 'Élégance et qualité supérieure en cuir véritable.',
    price: 45000,
    category: 'Mode',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    sellerId: 'vendeur-1'
  },
  {
    id: '6',
    name: 'Montre Intelligente Series 8',
    description: 'Suivez votre santé et restez connecté à chaque instant.',
    price: 220000,
    category: 'Électronique',
    image: 'https://images.unsplash.com/photo-1544117518-30dd5ff7a986?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    sellerId: 'vendeur-1'
  }
];