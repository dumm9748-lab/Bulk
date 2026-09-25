import React, { useState } from 'react';
import { 
  Boxes, 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  Copy, 
  SlidersHorizontal, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ItemAllocationSummary 
} from '../../types/order';
import { ItemVisual } from '../ItemVisual';

interface MasterDetailLayoutProps {
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
  onAutoFillBox: (boxId: string, qty: number) => void;
  onClearBoxContents: (boxId: string) => void;
  onSubmitOrder: () => void;
}

export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({
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
  onAutoFillBox,
  onClearBoxContents,
  onSubmitOrder
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string>(
    boxTypes.length > 0 ? boxTypes[0].id : ''
  );

  const selectedBox = boxTypes.find((b) => b.id === selectedBoxId) || boxTypes[0];
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const allocationMap = new Map(allocations.map((a) => [a.itemId, a]));

  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Master-Detail Packaging Console
          </div>
          <h1 className="text-xl font-bold text-neutral-900">
            {customerInfo.customerName} · {customerInfo.orderReference}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Select a packaging specification on the left to configure items on the right.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-neutral-600 text-right">
            <div><strong className="text-neutral-900 font-mono">{totalBoxes}</strong> Total Boxes</div>
            <div className="text-neutral-400">{totalCartUnits} Total Items</div>
          </div>
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
            <span>Submit Bulk Order</span>
          </button>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Master List (4 Cols) */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 px-1">
            <span>Box Types ({boxTypes.length})</span>
            <button
              onClick={onAddBoxType}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              + Add Type
            </button>
          </div>

          <div className="space-y-2">
            {boxTypes.map((box) => {
              const isSelected = box.id === selectedBox?.id;
              const itemsCount = Object.values(box.itemsPerBox).reduce((s, q) => s + (q || 0), 0);
              const outputTotal = box.boxQuantity * itemsCount;

              return (
                <div
                  key={box.id}
                  onClick={() => setSelectedBoxId(box.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/10'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: box.boxColor }}
                      />
                      <span className="font-bold text-xs text-neutral-900">{box.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                      {box.boxQuantity} Boxes
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{itemsCount} items/box</span>
                    <span>Output: {outputTotal} items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Pane (8 Cols) */}
        <div className="md:col-span-8">
          {selectedBox ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs"
                    style={{ backgroundColor: selectedBox.boxColor }}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">{selectedBox.name}</h2>
                    <div className="text-xs text-neutral-500">
                      Configuring single box specification (multiplies by {selectedBox.boxQuantity} units)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAutoFillBox(selectedBox.id, 1)}
                    className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Fill 1 of Each</span>
                  </button>
                  <button
                    onClick={() => onClearBoxContents(selectedBox.id)}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Items in this box */}
              <div className="space-y-3">
                {cart.map((cartItem) => {
                  const item = catalogMap.get(cartItem.itemId);
                  if (!item) return null;
                  const qtyPerBox = selectedBox.itemsPerBox[item.id] || 0;
                  const alloc = allocationMap.get(item.id);
                  const remaining = alloc ? alloc.remainingQuantity : 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <ItemVisual item={item} size="sm" />
                        <div>
                          <div className="font-semibold text-xs text-neutral-900">{item.name}</div>
                          <div className="text-[11px] text-neutral-500">
                            Cart has {cartItem.quantity} · {remaining === 0 ? 'Fully allocated' : `${remaining} left`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateBoxItems(
                              selectedBox.id,
                              item.id,
                              Math.max(0, qtyPerBox - 1)
                            )
                          }
                          className="w-7 h-7 rounded bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-sm text-neutral-900">
                          {qtyPerBox}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateBoxItems(selectedBox.id, item.id, qtyPerBox + 1)
                          }
                          className="w-7 h-7 rounded bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                        <span className="text-xs text-neutral-400 font-mono w-16 text-right">
                          = {selectedBox.boxQuantity * qtyPerBox}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center text-xs text-neutral-400">
              Select a box type on the left to configure contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
