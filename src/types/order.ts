export type ItemCategory = 'All' | 'Beverages' | 'Savory' | 'Pastries' | 'Confectionery';

export interface BakeryItem {
  id: string;
  name: string;
  category: 'Beverages' | 'Savory' | 'Pastries' | 'Confectionery';
  sku: string;
  unitPrice: number;
  weightGrams: number;
  dietary: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Nut-Free' | 'Halal')[];
  shelfLifeDays: number;
  outletStock?: number;
  availableStock?: number;
  prepDays?: number;
  description: string;
  color: string;
  iconName: string;
}

export interface CartItem {
  itemId: string;
  quantity: number;
}

export type BoxPackageStyle = 
  | 'kraft_window'
  | 'rigid_hamper'
  | 'corrugated_handle'
  | 'tin_canister'
  | 'bento_partitioned'
  | 'branded_corporate';

export interface BoxType {
  id: string;
  name: string;
  boxQuantity: number;
  capacityItems: number;
  boxColor: string;
  packageStyle?: BoxPackageStyle;
  packageTier?: 'Standard' | 'Premium' | 'Luxury';
  packageDimensions?: string;
  packageInclusions?: string[];
  itemsPerBox: Record<string, number>; // itemId -> qty per single box
}

export type AllocationStatusType = 'fully_allocated' | 'under_allocated' | 'over_allocated';

export interface ItemAllocationSummary {
  itemId: string;
  item: BakeryItem;
  cartQuantity: number;
  allocatedQuantity: number;
  remainingQuantity: number; // positive = unassigned, negative = over-allocated
  status: AllocationStatusType;
}

export interface CustomerOrderInfo {
  customerName: string;
  companyName: string;
  orderReference: string;
  eventDate: string;
  deliverySlot: string;
  deliveryVenue: string;
  contactEmail: string;
  contactPhone: string;
  specialInstructions: string;
  isRushOrder: boolean;
}

export type OrderStep = 
  | 'start'
  | 'select_items'
  | 'cart'
  | 'box_setup'
  | 'box_contents'
  | 'validation'
  | 'review'
  | 'confirmed';

export type LayoutVariation =
  | 'stepper'
  | 'left_nav'
  | 'split_view'
  | 'table_first'
  | 'card_builder'
  | 'master_detail'
  | 'two_column'
  | 'compact_dashboard';

export interface ConfirmedBulkOrder {
  orderId: string;
  createdAt: string;
  customerInfo: CustomerOrderInfo;
  cartItems: CartItem[];
  boxTypes: BoxType[];
  totalBoxes: number;
  totalItems: number;
  totalCost: number;
  totalWeightKg: number;
}
