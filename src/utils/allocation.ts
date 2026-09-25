import { BakeryItem, BoxType, CartItem, ItemAllocationSummary } from '../types/order';

export function calculateAllocation(
  cartItems: CartItem[],
  boxTypes: BoxType[],
  catalog: BakeryItem[]
): ItemAllocationSummary[] {
  // STRICT RULE: Only items currently in the active cart with quantity > 0 are audited.
  // Items deleted or not in the cart must NEVER be allocated.
  const activeCartItems = cartItems.filter((c) => c.quantity > 0);
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));

  return activeCartItems.map((cartEntry) => {
    const itemId = cartEntry.itemId;
    const item = catalogMap.get(itemId) || {
      id: itemId,
      name: itemId,
      category: 'Pastries' as const,
      sku: 'SKU-' + itemId,
      unitPrice: 25.0,
      weightGrams: 100,
      dietary: ['Vegetarian' as const],
      shelfLifeDays: 3,
      description: '',
      color: '#64748B',
      iconName: 'Box'
    };

    const cartQuantity = cartEntry.quantity;

    // Calculate allocated quantity: sum(box.quantity * itemsPerBox)
    const allocatedQuantity = boxTypes.reduce((sum, box) => {
      const perBox = box.itemsPerBox[itemId] || 0;
      return sum + box.boxQuantity * perBox;
    }, 0);

    const remainingQuantity = cartQuantity - allocatedQuantity;

    let status: ItemAllocationSummary['status'] = 'fully_allocated';
    if (remainingQuantity > 0) {
      status = 'under_allocated';
    } else if (remainingQuantity < 0) {
      status = 'over_allocated';
    }

    return {
      itemId,
      item,
      cartQuantity,
      allocatedQuantity,
      remainingQuantity,
      status
    };
  });
}

/**
 * Removes any item keys from boxTypes that are no longer in the active cart.
 * Prevents phantom items (like vanilla cake) from staying inside box allocations.
 */
export function sanitizeBoxTypes(boxTypes: BoxType[], cartItems: CartItem[]): BoxType[] {
  const activeIds = new Set(cartItems.filter((c) => c.quantity > 0).map((c) => c.itemId));
  return boxTypes.map((box) => {
    const cleaned: Record<string, number> = {};
    Object.entries(box.itemsPerBox).forEach(([id, qty]) => {
      if (activeIds.has(id) && qty > 0) {
        cleaned[id] = qty;
      }
    });
    return {
      ...box,
      itemsPerBox: cleaned
    };
  });
}

export function isOrderValidForSubmission(summaries: ItemAllocationSummary[]): {
  isValid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (summaries.length === 0) {
    reasons.push('Cart is empty. Please select items for the bulk order.');
    return { isValid: false, reasons };
  }

  summaries.forEach((s) => {
    if (s.status === 'over_allocated') {
      reasons.push(
        `${s.item.name} is over-allocated by ${Math.abs(s.remainingQuantity)} units (${s.allocatedQuantity} allocated vs ${s.cartQuantity} in cart).`
      );
    } else if (s.status === 'under_allocated') {
      reasons.push(
        `${s.remainingQuantity} ${s.item.name} remain unassigned to any box.`
      );
    }
  });

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function getTotalBoxCount(boxTypes: BoxType[]): number {
  return boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
}

export function getItemsPerBoxCount(box: BoxType): number {
  return Object.values(box.itemsPerBox).reduce((sum, q) => sum + (q || 0), 0);
}

export function calculateOrderTotals(
  cartItems: CartItem[],
  boxTypes: BoxType[],
  catalog: BakeryItem[]
) {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  
  const totalCartUnits = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const uniqueItemsCount = cartItems.filter((c) => c.quantity > 0).length;
  const totalBoxes = getTotalBoxCount(boxTypes);
  
  let totalCost = 0;
  let totalWeightGrams = 0;

  cartItems.forEach((cart) => {
    const item = catalogMap.get(cart.itemId);
    if (item) {
      totalCost += item.unitPrice * cart.quantity;
      totalWeightGrams += item.weightGrams * cart.quantity;
    }
  });

  return {
    totalCartUnits,
    uniqueItemsCount,
    totalBoxes,
    totalCost: Number(totalCost.toFixed(2)),
    totalWeightKg: Number((totalWeightGrams / 1000).toFixed(2))
  };
}

/**
 * Synchronizes cart quantities with whatever is currently allocated in box types
 */
export function syncCartToAllocated(
  boxTypes: BoxType[],
  currentCart: CartItem[]
): CartItem[] {
  const allocatedMap: Record<string, number> = {};
  boxTypes.forEach((box) => {
    Object.entries(box.itemsPerBox).forEach(([itemId, qtyPerBox]) => {
      allocatedMap[itemId] = (allocatedMap[itemId] || 0) + box.boxQuantity * qtyPerBox;
    });
  });

  // Preserve items or add any items that have positive allocation
  const newCart: CartItem[] = [];
  const handled = new Set<string>();

  currentCart.forEach((c) => {
    const allocated = allocatedMap[c.itemId] || 0;
    if (allocated > 0) {
      newCart.push({ itemId: c.itemId, quantity: allocated });
      handled.add(c.itemId);
    }
  });

  Object.entries(allocatedMap).forEach(([itemId, allocated]) => {
    if (!handled.has(itemId) && allocated > 0) {
      newCart.push({ itemId, quantity: allocated });
    }
  });

  return newCart;
}
