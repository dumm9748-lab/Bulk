import { BakeryItem, BoxType, CustomerOrderInfo } from '../types/order';

export const BAKERY_CATALOG: BakeryItem[] = [
  {
    id: 'almond-cookies',
    name: 'Almond Cookies',
    category: 'Confectionery',
    sku: 'CNF-ALM-01',
    unitPrice: 10.00,
    weightGrams: 50,
    dietary: ['Vegetarian'],
    shelfLifeDays: 30,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Crispy buttery roasted almond cookies with cardamom aroma.',
    color: '#D97706',
    iconName: 'Cookie'
  },
  {
    id: 'almond-sticks',
    name: 'Almond Sticks Cookies',
    category: 'Confectionery',
    sku: 'CNF-ALMS-02',
    unitPrice: 20.00,
    weightGrams: 75,
    dietary: ['Vegetarian'],
    shelfLifeDays: 30,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Crunchy golden butter biscuit batons dipped in toasted sliced almonds.',
    color: '#B45309',
    iconName: 'Cookie'
  },
  {
    id: 'blueberry-muffins',
    name: 'Blueberry Muffins',
    category: 'Pastries',
    sku: 'PAS-BLU-03',
    unitPrice: 80.00,
    weightGrams: 120,
    dietary: ['Vegetarian'],
    shelfLifeDays: 4,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Tender muffin studded with juicy mountain blueberries and sugar glaze.',
    color: '#4F46E5',
    iconName: 'Sparkles'
  },
  {
    id: 'bun-maska',
    name: 'Bun Maska',
    category: 'Savory',
    sku: 'SAV-BUN-04',
    unitPrice: 50.00,
    weightGrams: 140,
    dietary: ['Vegetarian'],
    shelfLifeDays: 2,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Irani cafe style soft sweet bun generously slathered with salted butter.',
    color: '#F59E0B',
    iconName: 'Flame'
  },
  {
    id: 'chicken-pie',
    name: 'Chicken Pie',
    category: 'Savory',
    sku: 'SAV-PIE-05',
    unitPrice: 65.00,
    weightGrams: 160,
    dietary: ['Halal'],
    shelfLifeDays: 2,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Flaky shortcrust savory pie loaded with braised chicken and creamy herb gravy.',
    color: '#DC2626',
    iconName: 'Flame'
  },
  {
    id: 'dilkush',
    name: 'Dilkush',
    category: 'Pastries',
    sku: 'PAS-DIL-06',
    unitPrice: 35.00,
    weightGrams: 110,
    dietary: ['Vegetarian'],
    shelfLifeDays: 4,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Traditional sweet bakery bread stuffed with tutty-fruity, grated coconut, and spices.',
    color: '#EC4899',
    iconName: 'Cake'
  },
  {
    id: 'fruit-muffin',
    name: 'Fruit Muffin',
    category: 'Pastries',
    sku: 'PAS-MUF-07',
    unitPrice: 30.00,
    weightGrams: 100,
    dietary: ['Vegetarian'],
    shelfLifeDays: 4,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Fluffy vanilla muffin packed with candied fruit bits and orange zest.',
    color: '#10B981',
    iconName: 'Apple'
  },
  {
    id: 'hot-dog',
    name: 'Hot Dog',
    category: 'Savory',
    sku: 'SAV-DOG-08',
    unitPrice: 45.00,
    weightGrams: 150,
    dietary: ['Halal'],
    shelfLifeDays: 2,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Freshly baked soft brioche roll enclosing spiced chicken sausage with mustard relish.',
    color: '#EA580C',
    iconName: 'Flame'
  },
  {
    id: 'marble-cake',
    name: 'Marble Cake',
    category: 'Pastries',
    sku: 'PAS-MRB-09',
    unitPrice: 55.00,
    weightGrams: 120,
    dietary: ['Vegetarian'],
    shelfLifeDays: 5,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Swirled cocoa and rich vanilla ribbon tea cake slice.',
    color: '#78350F',
    iconName: 'Cake'
  },
  {
    id: 'tetra-pack',
    name: 'Tetra Pack (Mango Nectar 200ml)',
    category: 'Beverages',
    sku: 'BEV-TP-01',
    unitPrice: 25.00,
    weightGrams: 210,
    dietary: ['Vegetarian', 'Vegan', 'Halal'],
    shelfLifeDays: 90,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Aseptic single-serve mango nectar with paper straw attachment.',
    color: '#F59E0B',
    iconName: 'CupSoda'
  },
  {
    id: 'cake',
    name: 'Vanilla Sponge Cake Slice',
    category: 'Pastries',
    sku: 'PAS-CAKE-02',
    unitPrice: 45.00,
    weightGrams: 110,
    dietary: ['Vegetarian', 'Halal'],
    shelfLifeDays: 3,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Moist golden vanilla sponge cake layered with delicate cream frosting.',
    color: '#EC4899',
    iconName: 'Cake'
  },
  {
    id: 'samosa',
    name: 'Crispy Spiced Potato Samosa',
    category: 'Savory',
    sku: 'SAV-SAM-03',
    unitPrice: 20.00,
    weightGrams: 85,
    dietary: ['Vegetarian', 'Vegan', 'Halal'],
    shelfLifeDays: 2,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Golden fried triangular pastry filled with spiced potatoes, peas, and roasted cumin.',
    color: '#D97706',
    iconName: 'Flame'
  },
  {
    id: 'dairy-milk',
    name: 'Cadbury Dairy Milk Bar (40g)',
    category: 'Confectionery',
    sku: 'CNF-DM-04',
    unitPrice: 40.00,
    weightGrams: 40,
    dietary: ['Vegetarian', 'Halal'],
    shelfLifeDays: 180,
    outletStock: 290,
    availableStock: 40,
    prepDays: 3,
    description: 'Smooth and creamy milk chocolate bar in tamper-evident sealed foil wrapper.',
    color: '#8B5CF6',
    iconName: 'Cookie'
  },
  {
    id: 'butter-croissant',
    name: 'French Butter Croissant',
    category: 'Pastries',
    sku: 'PAS-CRS-05',
    unitPrice: 65.00,
    weightGrams: 90,
    dietary: ['Vegetarian'],
    shelfLifeDays: 2,
    description: 'Flaky 100% Normandy butter croissant baked to golden honeycomb perfection.',
    color: '#CA8A04',
    iconName: 'Croissant'
  },
  {
    id: 'blueberry-muffin',
    name: 'Blueberry Crumble Muffin',
    category: 'Pastries',
    sku: 'PAS-MUF-06',
    unitPrice: 60.00,
    weightGrams: 130,
    dietary: ['Vegetarian', 'Nut-Free'],
    shelfLifeDays: 4,
    description: 'Loaded with wild blueberries and crowned with brown sugar streusel crumble.',
    color: '#3B82F6',
    iconName: 'Sparkles'
  },
  {
    id: 'fudge-brownie',
    name: 'Belgian Chocolate Fudge Brownie',
    category: 'Pastries',
    sku: 'PAS-BRW-07',
    unitPrice: 75.00,
    weightGrams: 95,
    dietary: ['Vegetarian', 'Halal'],
    shelfLifeDays: 5,
    description: 'Dense 70% dark Belgian cocoa brownie with a glossy crinkle top.',
    color: '#78350F',
    iconName: 'Square'
  },
  {
    id: 'fruit-tart',
    name: 'Mini Glazed Fruit Tart',
    category: 'Pastries',
    sku: 'PAS-FRT-08',
    unitPrice: 80.00,
    weightGrams: 100,
    dietary: ['Vegetarian'],
    shelfLifeDays: 2,
    description: 'Sweet shortcrust tart filled with vanilla bean pastry cream and fresh berries.',
    color: '#EF4444',
    iconName: 'Apple'
  },
  {
    id: 'paneer-puff',
    name: 'Savory Spiced Paneer Puff',
    category: 'Savory',
    sku: 'SAV-PUF-09',
    unitPrice: 35.00,
    weightGrams: 115,
    dietary: ['Vegetarian'],
    shelfLifeDays: 2,
    description: 'Crisp laminated puff pastry stuffed with crumbled spiced cottage cheese and herbs.',
    color: '#059669',
    iconName: 'Box'
  },
  {
    id: 'cold-brew',
    name: 'Organic Cold Brew Coffee (250ml)',
    category: 'Beverages',
    sku: 'BEV-CLD-10',
    unitPrice: 95.00,
    weightGrams: 260,
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
    shelfLifeDays: 45,
    description: 'Slow-steeped Arabica cold brew coffee carton with zero added sugar.',
    color: '#1E293B',
    iconName: 'Coffee'
  }
];

export const INITIAL_CUSTOMER_INFO: CustomerOrderInfo = {
  customerName: 'Jithendra prasad',
  companyName: 'Apex Catering & Confectionery',
  orderReference: 'ORD-2026-JP-9377',
  eventDate: '2026-09-04',
  deliverySlot: '05 PM -06',
  deliveryVenue: 'Banquet Hall 2, Metro Grand Arena',
  contactEmail: 'jithendra.prasad@example.com',
  contactPhone: '+918179293774',
  specialInstructions: 'Add the combo set details and quantities to continue with the bulk order. 🎁',
  isRushOrder: false
};

export const PRESET_TEMPLATES = [
  {
    id: 'standard-combo',
    title: 'Standard Conference Combo (60 Items · 15 Boxes)',
    description: 'Matches exact benchmark: 15 Tetra Packs, 15 Cakes, 20 Samosas, 15 Dairy Milks split across 10 Pack 1 and 5 Pack 2 boxes.',
    customer: {
      customerName: 'Priya Sharma',
      companyName: 'Global Tech Summits',
      orderReference: 'GTS-BULK-2026-01',
      eventDate: '2026-10-18',
      deliverySlot: '09:00 AM – 10:00 AM',
      deliveryVenue: 'Grand Convention Hall - Hall 3 Stage Access',
      contactEmail: 'priya@techsummits.org',
      contactPhone: '+1 (555) 912-3044',
      specialInstructions: 'Individual allergen labels requested on every box.',
      isRushOrder: false
    },
    cart: [
      { itemId: 'tetra-pack', quantity: 15 },
      { itemId: 'cake', quantity: 15 },
      { itemId: 'samosa', quantity: 20 },
      { itemId: 'dairy-milk', quantity: 15 }
    ],
    boxTypes: [
      {
        id: 'box-1',
        name: 'Combo Box Pack 1',
        boxQuantity: 10,
        capacityItems: 4,
        boxColor: '#3B82F6',
        itemsPerBox: {
          'tetra-pack': 1,
          'cake': 1,
          'samosa': 1,
          'dairy-milk': 1
        }
      },
      {
        id: 'box-2',
        name: 'Combo Box Pack 2',
        boxQuantity: 5,
        capacityItems: 5,
        boxColor: '#8B5CF6',
        itemsPerBox: {
          'tetra-pack': 1,
          'cake': 1,
          'samosa': 2,
          'dairy-milk': 1
        }
      }
    ]
  },
  {
    id: 'breakfast-pastry',
    title: 'Executive Breakfast & Coffee (80 Items · 20 Boxes)',
    description: '20 Cold Brews, 20 Croissants, 20 Blueberry Muffins, 20 Fruit Tarts in 20 Morning Deluxe Boxes.',
    customer: {
      customerName: 'Marcus Vance',
      companyName: 'Vance Capital Partners',
      orderReference: 'VCP-AGM-902',
      eventDate: '2026-10-22',
      deliverySlot: '07:30 AM – 08:15 AM',
      deliveryVenue: 'Vance Tower, Penthouse Lounge',
      contactEmail: 'm.vance@vancecap.com',
      contactPhone: '+1 (555) 872-1099',
      specialInstructions: 'Ensure croissants are crisp and freshly baked this morning.',
      isRushOrder: true
    },
    cart: [
      { itemId: 'cold-brew', quantity: 20 },
      { itemId: 'butter-croissant', quantity: 20 },
      { itemId: 'blueberry-muffin', quantity: 20 },
      { itemId: 'fruit-tart', quantity: 20 }
    ],
    boxTypes: [
      {
        id: 'box-morning',
        name: 'Executive Morning Box',
        boxQuantity: 20,
        capacityItems: 4,
        boxColor: '#059669',
        itemsPerBox: {
          'cold-brew': 1,
          'butter-croissant': 1,
          'blueberry-muffin': 1,
          'fruit-tart': 1
        }
      }
    ]
  }
];

export const INITIAL_BOX_TYPES: BoxType[] = [
  {
    id: 'box-1',
    name: 'Combo Box Pack 1',
    boxQuantity: 10,
    capacityItems: 4,
    boxColor: '#3B82F6',
    packageStyle: 'kraft_window',
    packageTier: 'Premium',
    packageDimensions: '25 × 20 × 10 cm',
    packageInclusions: ['Satin Ribbon Wrap', 'Tamper-Proof Gold Seal'],
    itemsPerBox: {
      'tetra-pack': 1,
      'cake': 1,
      'samosa': 1,
      'dairy-milk': 1
    }
  },
  {
    id: 'box-2',
    name: 'Combo Box Pack 2',
    boxQuantity: 5,
    capacityItems: 5,
    boxColor: '#8B5CF6',
    packageStyle: 'rigid_hamper',
    packageTier: 'Luxury',
    packageDimensions: '30 × 24 × 12 cm',
    packageInclusions: ['Satin Ribbon Wrap', 'Personalized Gift Card', 'Wood-Wool Cushioning'],
    itemsPerBox: {
      'tetra-pack': 1,
      'cake': 1,
      'samosa': 2,
      'dairy-milk': 1
    }
  }
];
