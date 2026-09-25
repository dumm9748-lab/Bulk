import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Boxes, 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  RefreshCw, 
  Send,
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

interface SplitWorkspaceLayoutProps {
  catalog: BakeryItem[];
  cart: CartItem[];
  boxTypes: BoxType[];
  allocations: ItemAllocationSummary[];
  customerInfo: CustomerOrderInfo;
  isValidForSubmission: boolean;
  onUpdateCartItem: (itemId: string, qty: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onUpdateBoxItems: (boxId: string, itemId: string, qty: number) => void;
  onUpdateBoxType: (boxId: string, updated: Partial<BoxType>) => void;
  onAddBoxType: () => void;
  onRemoveBoxType: (boxId: string) => void;
  onFixAllocation: () => void;
  onSyncCartToAllocated: () => void;
  onSubmitOrder: () => void;
}

export const SplitWorkspaceLayout: React.FC<SplitWorkspaceLayoutProps> = ({
  catalog,
  cart,
  boxTypes,
  allocations,
  customerInfo,
  isValidForSubmission,
  onUpdateCartItem,
  onRemoveCartItem,
  onUpdateBoxItems,
  onUpdateBoxType,
  onAddBoxType,
  onRemoveBoxType,
  onFixAllocation,
  onSyncCartToAllocated,
  onSubmitOrder
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string>(
    boxTypes.length > 0 ? boxTypes[0].id : ''
  );

  const activeBox = boxTypes.find((b) => b.id === selectedBoxId) || boxTypes[0];
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const allocationMap = new Map(allocations.map((a) => [a.itemId, a]));

  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner with Client Details & Submission */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Split Workspace Engine
          </div>
          <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span>{customerInfo.customerName}</span>
            <span className="text-neutral-400 font-normal">({customerInfo.companyName})</span>
            <span className="font-mono text-xs text-neutral-500 font-normal">
              · {customerInfo.orderReference}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="text-neutral-500">Totals:</div>
            <div className="font-mono font-bold text-neutral-900">
              {totalCartUnits} Items → {totalBoxes} Boxes
            </div>
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
            <span>Confirm Order</span>
          </button>
        </div>
      </div>

      {/* Two Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Inventory & Item Availability (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                <span>Cart Inventory ({cart.length} SKUs)</span>
              </h2>
              <span className="text-xs font-mono font-bold text-neutral-900">
                {totalCartUnits} Units Total
              </span>
            </div>

            <div className="space-y-3">
              {cart.map((c) => {
                const item = catalogMap.get(c.itemId);
                if (!item) return null;
                const alloc = allocationMap.get(c.itemId);
                const allocated = alloc ? alloc.allocatedQuantity : 0;
                const remaining = alloc ? alloc.remainingQuantity : c.quantity;

                return (
                  <div
                    key={c.itemId}
                    className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ItemVisual item={item} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-neutral-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                          <span>Allocated: <strong>{allocated}</strong>/{c.quantity}</span>
                          <span aria-hidden="true">·</span>
                          {remaining === 0 ? (
                            <span className="text-emerald-700 font-semibold">Balanced</span>
                          ) : remaining > 0 ? (
                            <span className="text-amber-700 font-semibold">{remaining} left</span>
                          ) : (
                            <span className="text-red-700 font-semibold">+{Math.abs(remaining)} over</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (c.quantity <= 1) onRemoveCartItem(c.itemId);
                          else onUpdateCartItem(c.itemId, c.quantity - 1);
                        }}
                        className="w-6 h-6 rounded bg-white hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-xs text-neutral-900">
                        {c.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartItem(c.itemId, c.quantity + 1)}
                        className="w-6 h-6 rounded bg-white hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Allocation Status Box */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Live Allocation Health
              </h3>
              {!isValidForSubmission && (
                <button
                  onClick={onFixAllocation}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix Mismatch</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {allocations.map((a) => (
                <div
                  key={a.itemId}
                  className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-0"
                >
                  <span className="text-neutral-700 truncate max-w-[160px]">{a.item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-500 tabular-nums">
                      {a.allocatedQuantity} / {a.cartQuantity}
                    </span>
                    {a.status === 'fully_allocated' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : a.status === 'under_allocated' ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        +{a.remainingQuantity}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                        +{Math.abs(a.remainingQuantity)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Box Segregation & Live Content Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
            {/* Box Type Selector Tabs */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2 overflow-x-auto">
                {boxTypes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBoxId(box.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      box.id === activeBox.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: box.boxColor }}
                    />
                    <span>{box.name}</span>
                    <span className="font-mono text-[11px] opacity-80">({box.boxQuantity})</span>
                  </button>
                ))}
              </div>

              <button
                onClick={onAddBoxType}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg shrink-0"
              >
                + Box
              </button>
            </div>

            {/* Active Box Control */}
            {activeBox && (
              <div>
                <div className="flex items-center justify-between mb-4 bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{activeBox.name}</div>
                    <div className="text-[11px] text-neutral-500">
                      Multiplier: Every item configured below is produced ×{activeBox.boxQuantity} times.
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-neutral-600 font-medium">Box Count:</span>
                    <button
                      onClick={() =>
                        onUpdateBoxType(activeBox.id, {
                          boxQuantity: Math.max(1, activeBox.boxQuantity - 1)
                        })
                      }
                      className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-neutral-900">
                      {activeBox.boxQuantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateBoxType(activeBox.id, {
                          boxQuantity: activeBox.boxQuantity + 1
                        })
                      }
                      className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Items in active box */}
                <div className="space-y-2.5 mb-4">
                  {cart.map((cartItem) => {
                    const item = catalogMap.get(cartItem.itemId);
                    if (!item) return null;

                    const qtyInThisBox = activeBox.itemsPerBox[item.id] || 0;
                    const yieldTotal = activeBox.boxQuantity * qtyInThisBox;
                    const alloc = allocationMap.get(item.id);

                    return (
                      <div
                        key={item.id}
                        className="p-3 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <ItemVisual item={item} size="sm" />
                          <div>
                            <div className="text-xs font-semibold text-neutral-900">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              Cart: {cartItem.quantity} units · Yield: {activeBox.boxQuantity} × {qtyInThisBox} = {yieldTotal}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Box Stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onUpdateBoxItems(
                                activeBox.id,
                                item.id,
                                Math.max(0, qtyInThisBox - 1)
                              )
                            }
                            className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-sm text-neutral-900">
                            {qtyInThisBox}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateBoxItems(activeBox.id, item.id, qtyInThisBox + 1)
                            }
                            className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                          <span className="text-[11px] text-neutral-400 w-12 text-right font-mono">
                            /box
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
