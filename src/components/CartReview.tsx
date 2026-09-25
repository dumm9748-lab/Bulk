import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  Edit3, 
  Sparkles, 
  ShoppingCart,
  Boxes,
  Scale
} from 'lucide-react';
import { BakeryItem, CartItem } from '../types/order';
import { ItemVisual } from './ItemVisual';
import { formatRupees } from '../utils/currency';

interface CartReviewProps {
  cart: CartItem[];
  catalog: BakeryItem[];
  onUpdateCartItem: (itemId: string, quantity: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onBackToSelectItems: () => void;
  onContinueToBoxSetup: () => void;
  onScaleAll: (multiplier: number) => void;
}

export const CartReview: React.FC<CartReviewProps> = ({
  cart,
  catalog,
  onUpdateCartItem,
  onRemoveCartItem,
  onBackToSelectItems,
  onContinueToBoxSetup,
  onScaleAll
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const uniqueItemsCount = cart.filter((c) => c.quantity > 0).length;
  const totalCost = cart.reduce((sum, c) => {
    const item = catalogMap.get(c.itemId);
    return sum + (item ? item.unitPrice * c.quantity : 0);
  }, 0);
  const totalWeightGrams = cart.reduce((sum, c) => {
    const item = catalogMap.get(c.itemId);
    return sum + (item ? item.weightGrams * c.quantity : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Step 2 of 8</span>
            <span aria-hidden="true">·</span>
            <span>Batch Inventory Audit</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Review Bulk Order Cart
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Audit item quantities before allocating them across custom box configurations.
          </p>
        </div>

        {/* Quick Batch Scaling */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onScaleAll(1.5)}
            title="Scale all item quantities by 1.5x"
            className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg shadow-xs transition-colors"
          >
            ×1.5 Scale
          </button>
          <button
            onClick={() => onScaleAll(2)}
            title="Double all item quantities"
            className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg shadow-xs transition-colors"
          >
            ×2 Double
          </button>
        </div>
      </div>

      {/* Cart Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Total Items
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
            {totalQuantity}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Sum of all units</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Unique Items
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
            {uniqueItemsCount}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Catalog products</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Total Batch Cost
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
            {formatRupees(totalCost)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Excluding delivery</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Batch Weight
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
            {(totalWeightGrams / 1000).toFixed(2)} kg
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Shipping estimate</div>
        </div>
      </div>

      {/* Cart Items Table */}
      {cart.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-xs mb-8">
          <ShoppingCart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            Your bulk order cart is empty
          </h3>
          <p className="text-xs text-neutral-500 mb-4 max-w-sm mx-auto">
            Select items from the catalog or load our benchmark combo order to get started.
          </p>
          <button
            onClick={onBackToSelectItems}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            ← Return to Item Catalog
          </button>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs mb-8">
          <div className="px-4 py-3 bg-neutral-50/70 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800">
              Selected Item Manifest ({uniqueItemsCount} Products)
            </span>
            <button
              onClick={onBackToSelectItems}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium"
            >
              + Add More Products
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50/30 text-neutral-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Item & SKU</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-6 text-center">Quantity</th>
                  <th className="py-2.5 px-4 text-right">Subtotal</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cart.map((cartItem) => {
                  const item = catalogMap.get(cartItem.itemId);
                  if (!item) return null;

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <ItemVisual item={item} size="sm" />
                          <div>
                            <div className="font-semibold text-neutral-900">{item.name}</div>
                            <div className="text-[11px] font-mono text-neutral-400">
                              {item.sku} · {item.weightGrams}g
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-600">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-neutral-900 tabular-nums">
                        {formatRupees(item.unitPrice)}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (cartItem.quantity <= 1) {
                                onRemoveCartItem(item.id);
                              } else {
                                onUpdateCartItem(item.id, cartItem.quantity - 1);
                              }
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={cartItem.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) {
                                if (val <= 0) onRemoveCartItem(item.id);
                                else onUpdateCartItem(item.id, val);
                              }
                            }}
                            className="w-16 text-center font-mono font-bold text-xs py-1 px-1 border border-neutral-300 rounded bg-white"
                          />
                          <button
                            onClick={() => onUpdateCartItem(item.id, cartItem.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold font-mono text-neutral-900 tabular-nums">
                        {formatRupees(item.unitPrice * cartItem.quantity)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onRemoveCartItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Remove item from order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer summary inside table */}
          <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-600">
              Total Items: <strong className="text-neutral-900 tabular-nums">{totalQuantity}</strong> · 
              Unique Items: <strong className="text-neutral-900 tabular-nums">{uniqueItemsCount}</strong>
            </span>
            <span className="font-semibold text-neutral-900">
              Order Value: <span className="font-mono text-sm tabular-nums">{formatRupees(totalCost)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSelectItems}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Select Items</span>
        </button>

        <button
          onClick={onContinueToBoxSetup}
          disabled={cart.length === 0 || totalQuantity === 0}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            cart.length > 0 && totalQuantity > 0
              ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Box Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
