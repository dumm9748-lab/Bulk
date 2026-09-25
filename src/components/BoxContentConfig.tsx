import React, { useState } from 'react';
import { 
  Boxes, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Minus, 
  Info, 
  Package, 
  Copy, 
  Sparkles, 
  Trash2, 
  Search,
  ShoppingCart,
  Layers,
  ArrowDownCircle,
  Columns,
  Rows,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { BakeryItem, BoxType, CartItem, ItemAllocationSummary } from '../types/order';
import { ItemVisual } from './ItemVisual';
import { formatRupees } from '../utils/currency';

interface BoxContentConfigProps {
  boxTypes: BoxType[];
  cart: CartItem[];
  catalog: BakeryItem[];
  allocations: ItemAllocationSummary[];
  selectedBoxId?: string;
  onUpdateBoxItems: (boxId: string, itemId: string, quantityPerBox: number) => void;
  onAutoFillBox: (boxId: string, quantityPerItem: number) => void;
  onCloneBoxContents: (sourceBoxId: string, targetBoxId: string) => void;
  onClearBoxContents: (boxId: string) => void;
  onBackToBoxTypes: () => void;
  onContinueToValidation: () => void;
}

export const BoxContentConfig: React.FC<BoxContentConfigProps> = ({
  boxTypes,
  cart,
  catalog,
  allocations,
  selectedBoxId,
  onUpdateBoxItems,
  onAutoFillBox,
  onCloneBoxContents,
  onClearBoxContents,
  onBackToBoxTypes,
  onContinueToValidation
}) => {
  // Layout orientation: 'horizontal' (Top-to-Bottom layers) or 'vertical' (Side-by-side columns)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeBoxId, setActiveBoxId] = useState<string>(
    selectedBoxId || (boxTypes.length > 0 ? boxTypes[0].id : '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [hideFullyAllocatedInOthers, setHideFullyAllocatedInOthers] = useState<boolean>(true);

  const activeBox = boxTypes.find((b) => b.id === activeBoxId) || boxTypes[0];
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const allocationMap = new Map(allocations.map((a) => [a.itemId, a]));

  // STRICT: Only items present in the active cart with quantity > 0
  const activeCart = cart.filter((c) => c.quantity > 0);

  if (!activeBox) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-sm text-neutral-500">No box types defined. Please add a box type first.</p>
        <button
          onClick={onBackToBoxTypes}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          ← Return to Box Setup
        </button>
      </div>
    );
  }

  // Items added into this active combo box
  const itemsInActiveBoxList = Object.entries(activeBox.itemsPerBox)
    .filter(([itemId, qty]) => (qty || 0) > 0 && activeCart.some((c) => c.itemId === itemId))
    .map(([itemId, qty]) => {
      const item = catalogMap.get(itemId);
      const cartEntry = activeCart.find((c) => c.itemId === itemId);
      const alloc = allocationMap.get(itemId);
      return {
        itemId,
        qty,
        item,
        cartQuantity: cartEntry ? cartEntry.quantity : 0,
        thisBoxYield: activeBox.boxQuantity * qty,
        alloc
      };
    });

  const totalItemsPerBox = itemsInActiveBoxList.reduce((sum, entry) => sum + entry.qty, 0);
  const totalBatchOutput = activeBox.boxQuantity * totalItemsPerBox;

  // Filter products for Layer 1
  const filteredCartItems = activeCart.filter((cartItem) => {
    const item = catalogMap.get(cartItem.itemId);
    if (!item) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Check if fully allocated in other boxes
    if (hideFullyAllocatedInOthers) {
      const qtyInThisBox = activeBox.itemsPerBox[cartItem.itemId] || 0;
      const allocatedInOtherBoxes = boxTypes
        .filter((b) => b.id !== activeBox.id)
        .reduce((sum, b) => sum + b.boxQuantity * (b.itemsPerBox[cartItem.itemId] || 0), 0);

      // If all cart items are already taken by other boxes and 0 in this box, hide it
      if (allocatedInOtherBoxes >= cartItem.quantity && qtyInThisBox === 0) {
        return false;
      }
    }

    return true;
  });

  const hiddenCount = activeCart.filter((cartItem) => {
    const qtyInThisBox = activeBox.itemsPerBox[cartItem.itemId] || 0;
    const allocatedInOtherBoxes = boxTypes
      .filter((b) => b.id !== activeBox.id)
      .reduce((sum, b) => sum + b.boxQuantity * (b.itemsPerBox[cartItem.itemId] || 0), 0);
    return allocatedInOtherBoxes >= cartItem.quantity && qtyInThisBox === 0;
  }).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Step 4 of 8</span>
            <span aria-hidden="true">·</span>
            <span>Horizontal Two-Layer Combo Packaging</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Configure Items per Combo Box
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Click products from <strong>Layer 1 (Product Selection)</strong> to add them directly into <strong>Layer 2 (Combo Set)</strong> below.
          </p>
        </div>

        {/* Orientation Switcher & Info Notice */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setOrientation('horizontal')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                orientation === 'horizontal'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Rows className="w-3.5 h-3.5 text-amber-600" />
              <span>Horizontal Layers</span>
            </button>
            <button
              onClick={() => setOrientation('vertical')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                orientation === 'vertical'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-neutral-600" />
              <span>Vertical Columns</span>
            </button>
          </div>
        </div>
      </div>

      {/* Box Selector Tabs at top */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-neutral-200">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">
          Target Combo:
        </span>
        {boxTypes.map((box) => {
          const isActive = box.id === activeBox.id;
          const boxItemCount = Object.entries(box.itemsPerBox).reduce(
            (s, [id, q]) => (activeCart.some((c) => c.itemId === id) ? s + (q || 0) : s),
            0
          );

          return (
            <button
              key={box.id}
              onClick={() => setActiveBoxId(box.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                isActive
                  ? 'border-neutral-900 bg-white text-neutral-900 shadow-xs'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: box.boxColor }}
              />
              <span>{box.name}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                {box.boxQuantity} Boxes
              </span>
              <span className="text-[11px] text-neutral-400">
                ({boxItemCount} items/box)
              </span>
            </button>
          );
        })}
      </div>

      {/* RENDER MODE: HORIZONTAL (DEFAULT) OR VERTICAL */}
      {orientation === 'horizontal' ? (
        /* ================= HORIZONTAL STACKED LAYOUT ================= */
        <div className="space-y-6 mb-8">
          
          {/* LAYER 1 (TOP HORIZONTAL LAYER): PRODUCT SELECTION CAROUSEL / GRID */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Layer 1 Header */}
            <div className="p-4 bg-neutral-50/80 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-neutral-900">
                      Layer 1: Select Products from Order
                    </h2>
                    <span className="font-mono text-[11px] px-2 py-0.5 bg-neutral-200 rounded text-neutral-700">
                      {activeCart.length} products in cart
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Click any product card below to add it into <strong>{activeBox.name}</strong>.
                  </p>
                </div>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-56">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onAutoFillBox(activeBox.id, 1)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ Add All to Combo</span>
                </button>
              </div>
            </div>

            {/* Layer 1 Products Horizontal Grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filteredCartItems.map((cartItem) => {
                const item = catalogMap.get(cartItem.itemId);
                if (!item) return null;

                const qtyInThisBox = activeBox.itemsPerBox[item.id] || 0;
                const isAddedToThisBox = qtyInThisBox > 0;

                const alloc = allocationMap.get(item.id);
                const globalAllocated = alloc ? alloc.allocatedQuantity : 0;
                const remaining = alloc ? alloc.remainingQuantity : cartItem.quantity;

                // Check if over-allocated / exceeded:
                const isExceeded = remaining < 0 || (alloc && alloc.status === 'over_allocated');
                const isExhausted = remaining <= 0 && !isAddedToThisBox && !isExceeded;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isExhausted) {
                        onUpdateBoxItems(activeBox.id, item.id, qtyInThisBox + 1);
                      }
                    }}
                    className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isExceeded
                        ? 'border-red-500 bg-red-50/95 text-red-950 shadow-md ring-2 ring-red-400'
                        : isAddedToThisBox
                        ? 'border-amber-400 bg-amber-50/30 shadow-xs ring-1 ring-amber-400/40'
                        : isExhausted
                        ? 'border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed'
                        : 'border-neutral-200 hover:border-amber-300 hover:bg-neutral-50/80 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Row: Item Header & Price (Icon Removed) */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`text-xs font-bold transition-colors line-clamp-2 ${
                          isExceeded ? 'text-red-950 font-extrabold' : 'text-neutral-900 group-hover:text-amber-800'
                        }`}>
                          {item.name}
                        </h3>
                        <span className={`text-xs font-bold font-mono shrink-0 ${
                          isExceeded ? 'text-red-900 font-extrabold' : 'text-neutral-900'
                        }`}>
                          {formatRupees(item.unitPrice)}
                        </span>
                      </div>

                      {/* Category and batch number removed per user instruction */}

                      {/* Cart Total & Remaining Balance */}
                      <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                        isExceeded ? 'border-red-200 text-red-900' : 'border-neutral-100 text-neutral-500'
                      }`}>
                        <span>Cart Total: <strong className={isExceeded ? 'text-red-950 font-bold' : 'text-neutral-800'}>{cartItem.quantity}</strong></span>
                        <span className={
                          isExceeded
                            ? 'text-red-800 font-bold bg-red-100 px-1.5 py-0.5 rounded border border-red-300'
                            : remaining === 0
                            ? 'text-emerald-700 font-semibold'
                            : remaining > 0
                            ? 'text-amber-700 font-semibold'
                            : 'text-red-700 font-semibold'
                        }>
                          {isExceeded ? `+${Math.abs(remaining)} OVER` : remaining === 0 ? '0 left' : `${remaining} left`}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className={`mt-3 pt-2 border-t flex items-center justify-between ${
                      isExceeded ? 'border-red-200' : 'border-neutral-100'
                    }`}>
                      <div>
                        {isExceeded ? (
                          <span className="text-[11px] font-bold text-red-950 bg-red-200/90 px-2 py-0.5 rounded border border-red-300">
                            Exceeded (+{Math.abs(remaining)})
                          </span>
                        ) : isAddedToThisBox ? (
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
                            In Combo: ×{qtyInThisBox}
                          </span>
                        ) : isExhausted ? (
                          <span className="text-[10px] text-neutral-400 italic">
                            Fully allocated
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700">
                            Click to select ↓
                          </span>
                        )}
                      </div>

                      {/* Action Button: turns to 'Selected' when selected, otherwise 'Select' */}
                      <button
                        type="button"
                        disabled={isExhausted && !isExceeded}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateBoxItems(activeBox.id, item.id, qtyInThisBox + 1);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isExceeded
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-2xs font-bold'
                            : isExhausted
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : isAddedToThisBox
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-2xs font-bold'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs'
                        }`}
                      >
                        {isAddedToThisBox ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Select</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hidden count note */}
            {hiddenCount > 0 && (
              <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                <span className="text-[11px]">
                  {hiddenCount} product(s) 100% assigned to other combo boxes are hidden.
                </span>
                <button
                  type="button"
                  onClick={() => setHideFullyAllocatedInOthers(!hideFullyAllocatedInOthers)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                >
                  {hideFullyAllocatedInOthers ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show All Products</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Fully Allocated</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Visual Transfer Connector */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider py-1">
            <ArrowDownCircle className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Items Selected Above are Assembled into {activeBox.name} Below</span>
          </div>

          {/* LAYER 2 (BOTTOM HORIZONTAL LAYER): ACTIVE COMBO SET TABLE */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Layer 2 Header */}
            <div className="p-4 bg-neutral-50/80 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: activeBox.boxColor }}
                    />
                    <h2 className="text-sm font-bold text-neutral-900">
                      Layer 2: {activeBox.name} Formulation
                    </h2>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                      {activeBox.boxQuantity} Boxes in Batch
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Batch Output: <strong className="text-neutral-800 font-mono">{totalBatchOutput} total items</strong> ({totalItemsPerBox} items/box) · Multiplier: ×{activeBox.boxQuantity} boxes
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAutoFillBox(activeBox.id, 1)}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set 1 Each</span>
                </button>

                {boxTypes.length > 1 && (
                  <div className="relative group">
                    <button
                      type="button"
                      className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Clone from...</span>
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-20">
                      {boxTypes
                        .filter((b) => b.id !== activeBox.id)
                        .map((other) => (
                          <button
                            key={other.id}
                            type="button"
                            onClick={() => onCloneBoxContents(other.id, activeBox.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                          >
                            <span className="truncate">{other.name}</span>
                            <span className="text-[10px] text-neutral-400">Copy</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onClearBoxContents(activeBox.id)}
                  className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white hover:bg-red-50 border border-neutral-200 rounded-lg shadow-2xs transition-colors"
                >
                  Clear Box
                </button>
              </div>
            </div>

            {/* Layer 2 Items Table */}
            {itemsInActiveBoxList.length === 0 ? (
              <div className="py-14 px-4 text-center bg-neutral-50/40">
                <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-neutral-900 mb-1">
                  This Combo Box is Currently Empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mb-3">
                  Click any product in <strong>Layer 1 above</strong> to add it to this combo box.
                </p>
                <button
                  type="button"
                  onClick={() => onAutoFillBox(activeBox.id, 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Populate 1 of Each Available Product</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-3 text-right">Cart Total</th>
                      <th className="py-3 px-4 text-center bg-amber-50/60 text-amber-900 border-x border-amber-100">
                        Qty in THIS Box
                      </th>
                      <th className="py-3 px-3 text-right">Yield ({activeBox.boxQuantity} Boxes)</th>
                      <th className="py-3 px-4 text-right">Global Allocation</th>
                      <th className="py-3 px-4 text-center">Remaining Balance</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {itemsInActiveBoxList.map((entry) => {
                      const { itemId, qty, item, cartQuantity, thisBoxYield, alloc } = entry;
                      if (!item) return null;

                      const globalAllocated = alloc ? alloc.allocatedQuantity : 0;
                      const remaining = alloc ? alloc.remainingQuantity : 0;
                      const status = alloc ? alloc.status : 'under_allocated';

                      return (
                        <tr key={itemId} className="hover:bg-neutral-50/50 transition-colors">
                          {/* Item Details */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <ItemVisual item={item} size="sm" />
                              <div>
                                <div className="font-semibold text-neutral-900">{item.name}</div>
                                <div className="text-[11px] font-mono text-neutral-400">
                                  {item.sku} · {formatRupees(item.unitPrice)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Cart Total */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                            {cartQuantity}
                          </td>

                          {/* Interactive Quantity Stepper */}
                          <td className="py-3 px-4 bg-amber-50/30 border-x border-amber-100">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateBoxItems(activeBox.id, itemId, Math.max(0, qty - 1))
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 shadow-xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val >= 0) {
                                    onUpdateBoxItems(activeBox.id, itemId, val);
                                  }
                                }}
                                className="w-14 text-center font-mono font-bold text-sm py-1 border border-neutral-300 rounded bg-white text-neutral-900"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateBoxItems(activeBox.id, itemId, qty + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Yield */}
                          <td className="py-3 px-3 text-right font-mono text-neutral-700 tabular-nums">
                            <span className="text-[11px] text-neutral-400 mr-1">
                              {activeBox.boxQuantity} × {qty} =
                            </span>
                            <strong className="text-neutral-900 font-semibold">{thisBoxYield}</strong>
                          </td>

                          {/* Global Allocation */}
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            <span className="font-bold text-neutral-900">{globalAllocated}</span>
                            <span className="text-neutral-400 text-[11px]"> / {cartQuantity}</span>
                          </td>

                          {/* Remaining */}
                          <td className="py-3 px-4 text-center font-mono tabular-nums">
                            {remaining === 0 ? (
                              <span className="text-emerald-700 font-semibold">0 left</span>
                            ) : remaining > 0 ? (
                              <span className="text-amber-700 font-semibold">+{remaining} unassigned</span>
                            ) : (
                              <span className="text-red-700 font-semibold">+{Math.abs(remaining)} OVER</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center">
                            {status === 'fully_allocated' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Balanced</span>
                              </span>
                            ) : status === 'under_allocated' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>{remaining} Left</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-red-800 bg-red-50 border border-red-200 rounded">
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span>Over ({Math.abs(remaining)})</span>
                              </span>
                            )}
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => onUpdateBoxItems(activeBox.id, itemId, 0)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove item from box"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Layer 2 Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-4">
                <span>
                  Fill: <strong className="text-neutral-900">{totalItemsPerBox} items per box</strong>
                </span>
                <span className="text-neutral-300">·</span>
                <span>
                  Total Batch Yield: <strong className="text-neutral-900 font-mono">{totalBatchOutput} total units</strong>
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {activeBox.boxQuantity} boxes × {totalItemsPerBox} items = {totalBatchOutput} total units
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ================= VERTICAL SPLIT LAYOUT ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          {/* Frame 1 (Left): Products */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 bg-neutral-50/80 border-b border-neutral-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-neutral-900">
                    Available Products
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-500">
                  {activeCart.length} in cart
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[580px] overflow-y-auto divide-y divide-neutral-100">
              {filteredCartItems.map((cartItem) => {
                const item = catalogMap.get(cartItem.itemId);
                if (!item) return null;

                const qtyInThisBox = activeBox.itemsPerBox[item.id] || 0;
                const isAddedToThisBox = qtyInThisBox > 0;
                const alloc = allocationMap.get(item.id);
                const globalAllocated = alloc ? alloc.allocatedQuantity : 0;
                const remaining = alloc ? alloc.remainingQuantity : cartItem.quantity;
                const isExceeded = remaining < 0 || (alloc && alloc.status === 'over_allocated');
                const isExhausted = remaining <= 0 && !isAddedToThisBox && !isExceeded;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isExhausted) {
                        onUpdateBoxItems(activeBox.id, item.id, qtyInThisBox + 1);
                      }
                    }}
                    className={`pt-3 first:pt-0 group p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isExceeded
                        ? 'border-red-500 bg-red-50/95 text-red-950 shadow-md ring-2 ring-red-400'
                        : isAddedToThisBox
                        ? 'border-amber-400 bg-amber-50/30 shadow-xs ring-1 ring-amber-400/40'
                        : isExhausted
                        ? 'border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed'
                        : 'border-neutral-200 hover:border-amber-300 hover:bg-neutral-50/80 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-bold truncate ${isExceeded ? 'text-red-950 font-extrabold' : 'text-neutral-900 group-hover:text-amber-800'}`}>
                          {item.name}
                        </span>
                        <span className={`text-xs font-bold font-mono shrink-0 ${isExceeded ? 'text-red-900 font-extrabold' : 'text-neutral-800'}`}>
                          {formatRupees(item.unitPrice)}
                        </span>
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 flex items-center justify-between ${isExceeded ? 'text-red-900' : 'text-neutral-500'}`}>
                        <span>Cart Total: <strong className={isExceeded ? 'text-red-950 font-bold' : 'text-neutral-700'}>{cartItem.quantity}</strong></span>
                        <span className={isExceeded ? 'text-red-800 font-bold' : remaining === 0 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {isExceeded ? `+${Math.abs(remaining)} OVER` : `${remaining} left`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                      {isExceeded ? (
                        <span className="text-[11px] font-bold text-red-950 bg-red-200/90 px-2 py-0.5 rounded border border-red-300">
                          Exceeded (+{Math.abs(remaining)})
                        </span>
                      ) : isAddedToThisBox ? (
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
                          In Combo: ×{qtyInThisBox}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700">
                          Click to select ↓
                        </span>
                      )}

                      <button
                        type="button"
                        disabled={isExhausted && !isExceeded}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateBoxItems(activeBox.id, item.id, qtyInThisBox + 1);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isExceeded
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-2xs font-bold'
                            : isExhausted
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : isAddedToThisBox
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-2xs font-bold'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs'
                        }`}
                      >
                        {isAddedToThisBox ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Select</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frame 2 (Right): Combo Manifest */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-sm font-bold text-neutral-900">{activeBox.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => onAutoFillBox(activeBox.id, 1)}
                className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md"
              >
                Set 1 Each
              </button>
            </div>

            <div className="p-4 divide-y divide-neutral-100">
              {itemsInActiveBoxList.map((entry) => {
                const { itemId, qty, item, thisBoxYield } = entry;
                if (!item) return null;

                return (
                  <div key={itemId} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ItemVisual item={item} size="sm" />
                      <div>
                        <div className="font-bold text-xs text-neutral-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{item.sku}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateBoxItems(activeBox.id, itemId, Math.max(0, qty - 1))}
                        className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs px-2">{qty}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateBoxItems(activeBox.id, itemId, qty + 1)}
                        className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                      <span className="font-mono text-xs text-neutral-500 min-w-[70px] text-right">
                        = {thisBoxYield} units
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBackToBoxTypes}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Box Types</span>
        </button>

        <button
          onClick={onContinueToValidation}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Continue to Allocation Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
