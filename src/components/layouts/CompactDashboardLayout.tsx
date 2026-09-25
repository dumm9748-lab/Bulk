import React, { useState } from 'react';
import { 
  Boxes, 
  ShoppingCart, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  Send, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ItemAllocationSummary 
} from '../../types/order';
import { ItemVisual } from '../ItemVisual';

interface CompactDashboardLayoutProps {
  catalog: BakeryItem[];
  cart: CartItem[];
  boxTypes: BoxType[];
  allocations: ItemAllocationSummary[];
  customerInfo: CustomerOrderInfo;
  isValidForSubmission: boolean;
  onUpdateCartItem: (itemId: string, qty: number) => void;
  onUpdateBoxItems: (boxId: string, itemId: string, qty: number) => void;
  onUpdateBoxType: (boxId: string, updated: Partial<BoxType>) => void;
  onAddBoxType: () => void;
  onFixAllocation: () => void;
  onSyncCartToAllocated: () => void;
  onSubmitOrder: () => void;
}

export const CompactDashboardLayout: React.FC<CompactDashboardLayoutProps> = ({
  catalog,
  cart,
  boxTypes,
  allocations,
  customerInfo,
  isValidForSubmission,
  onUpdateCartItem,
  onUpdateBoxItems,
  onUpdateBoxType,
  onAddBoxType,
  onFixAllocation,
  onSyncCartToAllocated,
  onSubmitOrder
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-4">
      {/* Dense Cockpit Header */}
      <div className="bg-neutral-900 text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-neutral-900 font-bold flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              Compact Operations Cockpit
            </div>
            <h1 className="text-lg font-bold">
              {customerInfo.customerName} · {customerInfo.orderReference}
            </h1>
            <div className="text-xs text-neutral-400">
              {customerInfo.companyName} · Delivery: {customerInfo.eventDate} ({customerInfo.deliverySlot})
            </div>
          </div>
        </div>

        {/* Real-Time KPIs & Confirm */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-right text-xs">
            <div className="text-neutral-400">Production Balance:</div>
            <div className="font-mono font-bold text-white">
              {totalCartUnits} Items / {totalBoxes} Boxes
            </div>
          </div>

          {!isValidForSubmission ? (
            <button
              onClick={onFixAllocation}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Auto-Reconcile</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Balanced</span>
            </div>
          )}

          <button
            onClick={onSubmitOrder}
            disabled={!isValidForSubmission}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isValidForSubmission
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm Order</span>
          </button>
        </div>
      </div>

      {/* Tri-Pane Dense Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pane 1: Cart Items (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 text-xs font-bold text-neutral-900">
            <span className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-neutral-500" />
              <span>Cart Items ({cart.length})</span>
            </span>
            <span className="font-mono">{totalCartUnits} Total</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {cart.map((c) => {
              const item = catalogMap.get(c.itemId);
              if (!item) return null;
              return (
                <div
                  key={c.itemId}
                  className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ItemVisual item={item} size="sm" />
                    <span className="font-semibold text-neutral-900 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onUpdateCartItem(c.itemId, Math.max(1, c.quantity - 1))}
                      className="w-5 h-5 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold">{c.quantity}</span>
                    <button
                      onClick={() => onUpdateCartItem(c.itemId, c.quantity + 1)}
                      className="w-5 h-5 rounded bg-white border border-neutral-200 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Box Formats & Items per Box (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 text-xs font-bold text-neutral-900">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-neutral-500" />
              <span>Box Configurations ({boxTypes.length})</span>
            </span>
            <button
              onClick={onAddBoxType}
              className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
            >
              + Add Box
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {boxTypes.map((box) => (
              <div
                key={box.id}
                className="p-3 border border-neutral-200 rounded-lg bg-white shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: box.boxColor }}
                    />
                    <input
                      type="text"
                      value={box.name}
                      onChange={(e) => onUpdateBoxType(box.id, { name: e.target.value })}
                      className="font-bold text-xs text-neutral-900 border-b border-transparent focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onUpdateBoxType(box.id, {
                          boxQuantity: Math.max(1, box.boxQuantity - 1)
                        })
                      }
                      className="w-5 h-5 rounded bg-neutral-100 font-bold text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs px-1">
                      {box.boxQuantity} bxs
                    </span>
                    <button
                      onClick={() =>
                        onUpdateBoxType(box.id, { boxQuantity: box.boxQuantity + 1 })
                      }
                      className="w-5 h-5 rounded bg-neutral-100 font-bold text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Items in this box */}
                <div className="space-y-1">
                  {cart.map((cartItem) => {
                    const item = catalogMap.get(cartItem.itemId);
                    if (!item) return null;
                    const qtyInBox = box.itemsPerBox[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-0.5"
                      >
                        <span className="text-neutral-600 truncate max-w-[140px]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onUpdateBoxItems(
                                box.id,
                                item.id,
                                Math.max(0, qtyInBox - 1)
                              )
                            }
                            className="w-4 h-4 rounded bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-[10px]"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-mono font-bold">
                            {qtyInBox}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateBoxItems(box.id, item.id, qtyInBox + 1)
                            }
                            className="w-4 h-4 rounded bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-[10px]"
                          >
                            +
                          </button>
                          <span className="text-[10px] text-neutral-400 font-mono w-10 text-right">
                            ({qtyInBox * box.boxQuantity})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pane 3: Allocation Ledger & Health Audit (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 text-xs font-bold text-neutral-900">
            <span>Allocation Ledger</span>
            <button
              onClick={onSyncCartToAllocated}
              className="text-[11px] text-neutral-500 hover:text-neutral-800"
            >
              Sync Cart
            </button>
          </div>

          <div className="space-y-2">
            {allocations.map((a) => (
              <div
                key={a.itemId}
                className="p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs"
              >
                <div className="font-semibold text-neutral-900 truncate">{a.item.name}</div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="font-mono text-neutral-600">
                    {a.allocatedQuantity} / {a.cartQuantity}
                  </span>
                  {a.status === 'fully_allocated' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Balanced
                    </span>
                  ) : a.status === 'under_allocated' ? (
                    <span className="text-amber-700 font-semibold">
                      +{a.remainingQuantity} unassigned
                    </span>
                  ) : (
                    <span className="text-red-700 font-semibold">
                      +{Math.abs(a.remainingQuantity)} excess
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
