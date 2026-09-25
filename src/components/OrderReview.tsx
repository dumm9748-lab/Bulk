import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  FileText, 
  Package, 
  Boxes, 
  ShieldCheck, 
  Edit3,
  DollarSign
} from 'lucide-react';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ItemAllocationSummary 
} from '../types/order';
import { ItemVisual } from './ItemVisual';
import { formatRupees } from '../utils/currency';

interface OrderReviewProps {
  customerInfo: CustomerOrderInfo;
  cart: CartItem[];
  boxTypes: BoxType[];
  catalog: BakeryItem[];
  allocations: ItemAllocationSummary[];
  isValidForSubmission: boolean;
  onBackToEdit: () => void;
  onSubmitBulkOrder: () => void;
}

export const OrderReview: React.FC<OrderReviewProps> = ({
  customerInfo,
  cart,
  boxTypes,
  catalog,
  allocations,
  isValidForSubmission,
  onBackToEdit,
  onSubmitBulkOrder
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);
  const activeCartIds = new Set(cart.filter((c) => c.quantity > 0).map((c) => c.itemId));

  const totalCost = cart.reduce((sum, c) => {
    const item = catalogMap.get(c.itemId);
    return sum + (item ? item.unitPrice * c.quantity : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Step 7 of 7</span>
            <span aria-hidden="true">·</span>
            <span>Pre-Flight Submission Gate</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Review Bulk Order Manifest
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Carefully verify client logistics, product counts, and packaging assignments prior to committing to production.
          </p>
        </div>

        {/* Status validation chip */}
        <div className="shrink-0">
          {isValidForSubmission ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-emerald-900 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Allocation 100% Balanced</span>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-red-900 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Allocation Mismatch</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. ORDER SUMMARY SECTION */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Order & Client Logistics Summary</span>
          </h2>
          <button
            onClick={onBackToEdit}
            className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Logistics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-medium">Customer / Client</div>
            <div className="font-semibold text-neutral-900 mt-0.5">{customerInfo.customerName}</div>
            <div className="text-neutral-500 text-[11px]">{customerInfo.companyName}</div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-medium">Order PO / Ref</div>
            <div className="font-mono font-bold text-neutral-900 mt-0.5">{customerInfo.orderReference}</div>
            <div className="text-[11px] text-neutral-500">
              {customerInfo.isRushOrder ? '⚡ High Priority Rush' : 'Standard Delivery'}
            </div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-medium">Event & Slot</div>
            <div className="font-semibold text-neutral-900 mt-0.5">{customerInfo.eventDate}</div>
            <div className="text-neutral-500 text-[11px]">{customerInfo.deliverySlot}</div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-medium">Totals</div>
            <div className="font-mono font-bold text-neutral-900 mt-0.5 tabular-nums">
              {totalBoxes} Boxes ({totalCartUnits} Items)
            </div>
            <div className="text-[11px] font-semibold text-neutral-800 tabular-nums">
              {formatRupees(totalCost)} Estimated Value
            </div>
          </div>
        </div>

        {customerInfo.deliveryVenue && (
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-start gap-2 text-xs text-neutral-600">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
            <span><strong>Venue:</strong> {customerInfo.deliveryVenue}</span>
          </div>
        )}
      </div>

      {/* 2. ITEM SUMMARY SECTION */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs mb-6">
        <div className="px-5 py-3 bg-neutral-50/70 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Item Summary & Allocation Audit</span>
          </h2>
          <span className="text-xs text-neutral-500">
            {allocations.length} Unique SKUs
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/40 border-b border-neutral-100 text-neutral-500 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Item</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Cart Qty</th>
              <th className="py-2.5 px-3 text-right">Allocated Qty</th>
              <th className="py-2.5 px-3 text-center">Variance</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {allocations.map((alloc) => (
              <tr key={alloc.itemId} className="hover:bg-neutral-50/40 transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <ItemVisual item={alloc.item} size="sm" />
                    <span className="font-semibold text-neutral-900">{alloc.item.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-neutral-600">{alloc.item.category}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                  {alloc.cartQuantity}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                  {alloc.allocatedQuantity}
                </td>
                <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                  {alloc.remainingQuantity === 0 ? (
                    <span className="text-neutral-400">0</span>
                  ) : alloc.remainingQuantity > 0 ? (
                    <span className="text-amber-700 font-semibold">+{alloc.remainingQuantity} unassigned</span>
                  ) : (
                    <span className="text-red-700 font-semibold">+{Math.abs(alloc.remainingQuantity)} over</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-center">
                  {alloc.status === 'fully_allocated' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Balanced</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mismatch</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. BOX SUMMARY SECTION */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs mb-8">
        <div className="px-5 py-3 bg-neutral-50/70 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-600" />
            <span>Box Packaging Summary ({totalBoxes} Boxes)</span>
          </h2>
          <span className="text-xs text-neutral-500">
            {boxTypes.length} Box Types Configured
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {boxTypes.map((box) => {
            const itemsInBox = Object.entries(box.itemsPerBox).filter(
              ([itemId, qty]) => (qty || 0) > 0 && activeCartIds.has(itemId)
            );
            return (
              <div key={box.id} className="p-4 hover:bg-neutral-50/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: box.boxColor }}
                    />
                    <h3 className="font-bold text-sm text-neutral-900">{box.name}</h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {box.boxQuantity} Boxes
                    </span>
                    {box.packageStyle && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#9c0753] font-mono">
                        📦 {box.packageStyle.replace('_', ' ').toUpperCase()} ({box.packageDimensions || 'Standard'})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Capacity: {box.capacityItems} items · Total items inside: {itemsInBox.reduce((s, [_, q]) => s + q, 0)} items/box
                  </div>
                </div>
                {box.packageInclusions && box.packageInclusions.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] text-emerald-800">
                    <span className="font-semibold text-neutral-400">Packaging Inclusions:</span>
                    {box.packageInclusions.map((inc) => (
                      <span key={inc} className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                )}

                {/* Items per box pill row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {itemsInBox.map(([itemId, qty]) => {
                    const it = catalogMap.get(itemId);
                    if (!it) return null;
                    return (
                      <span
                        key={itemId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs"
                      >
                        <span className="font-medium">{it.name}</span>
                        <strong className="font-mono font-bold text-neutral-900">×{qty}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Edit Order</span>
        </button>

        <button
          onClick={onSubmitBulkOrder}
          disabled={!isValidForSubmission}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-bold shadow-md transition-all ${
            isValidForSubmission
              ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Confirm & Create Bulk Order</span>
        </button>
      </div>
    </div>
  );
};
