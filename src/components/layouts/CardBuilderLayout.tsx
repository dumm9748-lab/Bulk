import React from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  Copy, 
  Send, 
  Boxes, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ItemAllocationSummary 
} from '../../types/order';
import { ItemVisual } from '../ItemVisual';

interface CardBuilderLayoutProps {
  catalog: BakeryItem[];
  cart: CartItem[];
  boxTypes: BoxType[];
  allocations: ItemAllocationSummary[];
  customerInfo: CustomerOrderInfo;
  isValidForSubmission: boolean;
  onUpdateBoxItems: (boxId: string, itemId: string, qty: number) => void;
  onUpdateBoxType: (boxId: string, updated: Partial<BoxType>) => void;
  onAddBoxType: () => void;
  onDuplicateBoxType: (boxId: string) => void;
  onRemoveBoxType: (boxId: string) => void;
  onSubmitOrder: () => void;
}

export const CardBuilderLayout: React.FC<CardBuilderLayoutProps> = ({
  catalog,
  cart,
  boxTypes,
  allocations,
  customerInfo,
  isValidForSubmission,
  onUpdateBoxItems,
  onUpdateBoxType,
  onAddBoxType,
  onDuplicateBoxType,
  onRemoveBoxType,
  onSubmitOrder
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Card-Based Box Builder
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Modular Box Packaging Stations
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Each card represents an active packaging container with independent quantity multipliers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddBoxType}
            className="px-3 py-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Box Card</span>
          </button>

          <button
            onClick={onSubmitOrder}
            disabled={!isValidForSubmission}
            className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isValidForSubmission
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm Order</span>
          </button>
        </div>
      </div>

      {/* Grid of Box Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {boxTypes.map((box) => {
          const itemsInBox = Object.entries(box.itemsPerBox).filter(([_, q]) => (q || 0) > 0);
          const totalUnitsInBox = itemsInBox.reduce((s, [_, q]) => s + q, 0);

          return (
            <div
              key={box.id}
              className="bg-white border-2 border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all"
            >
              <div>
                {/* Box Card Top Banner */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: box.boxColor }}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={box.name}
                        onChange={(e) => onUpdateBoxType(box.id, { name: e.target.value })}
                        className="font-bold text-sm text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:outline-none"
                      />
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {totalUnitsInBox} items/box · Total: {box.boxQuantity * totalUnitsInBox}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateBoxType(box.id)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {boxTypes.length > 1 && (
                      <button
                        onClick={() => onRemoveBoxType(box.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Box Multiplier Stepper */}
                <div className="bg-neutral-50 rounded-xl p-2.5 mb-4 flex items-center justify-between border border-neutral-200/80">
                  <span className="text-xs font-semibold text-neutral-700">Total Boxes to Pack:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateBoxType(box.id, {
                          boxQuantity: Math.max(1, box.boxQuantity - 1)
                        })
                      }
                      className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm text-neutral-900 w-8 text-center">
                      {box.boxQuantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateBoxType(box.id, { boxQuantity: box.boxQuantity + 1 })
                      }
                      className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item List inside this Box Card */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Box Contents:
                  </div>
                  {cart.map((cartItem) => {
                    const item = catalogMap.get(cartItem.itemId);
                    if (!item) return null;
                    const qtyInBox = box.itemsPerBox[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemVisual item={item} size="sm" />
                          <span className="font-medium text-neutral-900 truncate">
                            {item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              onUpdateBoxItems(
                                box.id,
                                item.id,
                                Math.max(0, qtyInBox - 1)
                              )
                            }
                            className="w-5 h-5 rounded bg-white hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs">
                            {qtyInBox}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateBoxItems(box.id, item.id, qtyInBox + 1)
                            }
                            className="w-5 h-5 rounded bg-white hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Production Batch Line</span>
                <span className="font-mono font-semibold text-neutral-700">
                  Yield: {box.boxQuantity * totalUnitsInBox} units
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
