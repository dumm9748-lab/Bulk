import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Wrench, 
  RefreshCw, 
  SlidersHorizontal,
  ShieldCheck,
  Check,
  Layers,
  HelpCircle
} from 'lucide-react';
import { BoxType, CartItem, ItemAllocationSummary } from '../types/order';
import { ItemVisual } from './ItemVisual';

interface AllocationValidatorProps {
  allocations: ItemAllocationSummary[];
  boxTypes: BoxType[];
  cart: CartItem[];
  onFixAllocation: (itemId?: string) => void;
  onSyncCartToAllocated: () => void;
  onGoToConfigureBox: (boxId?: string) => void;
  onContinueToReview: () => void;
  onBackToContents: () => void;
}

export const AllocationValidator: React.FC<AllocationValidatorProps> = ({
  allocations,
  boxTypes,
  cart,
  onFixAllocation,
  onSyncCartToAllocated,
  onGoToConfigureBox,
  onContinueToReview,
  onBackToContents
}) => {
  const totalCartUnits = allocations.reduce((sum, a) => sum + a.cartQuantity, 0);
  const totalAllocatedUnits = allocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);

  const fullyAllocatedItems = allocations.filter((a) => a.status === 'fully_allocated');
  const underAllocatedItems = allocations.filter((a) => a.status === 'under_allocated');
  const overAllocatedItems = allocations.filter((a) => a.status === 'over_allocated');

  const isAllValid = underAllocatedItems.length === 0 && overAllocatedItems.length === 0 && allocations.length > 0;
  const allocationPercentage = totalCartUnits > 0 
    ? Math.min(100, Math.round((totalAllocatedUnits / totalCartUnits) * 100))
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Step 6 of 7</span>
            <span aria-hidden="true">·</span>
            <span>Mathematical Reconciliation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Allocation Validation & Audit
          </h1>
          <p className="text-xs text-neutral-600 mt-1 max-w-xl">
            Verify that every item from the cart is accurately distributed with zero leftovers and zero excess.
          </p>
        </div>

        {/* Audit Status Badge */}
        <div className="shrink-0">
          {isAllValid ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-emerald-900">100% Balanced</div>
                <div className="text-[11px] text-emerald-700">Ready for packaging manifest</div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-amber-900">Allocation Discrepancy</div>
                <div className="text-[11px] text-amber-700">Action required before submission</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Quick Stats Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-neutral-700">
            Batch Allocation Progress
          </span>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">
            {totalAllocatedUnits} / {totalCartUnits} units ({allocationPercentage}%)
          </span>
        </div>
        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-300 ${
              isAllValid ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, allocationPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-3 pt-2 border-t border-neutral-100">
          <div>
            Status:{' '}
            <strong className="text-neutral-800">
              {fullyAllocatedItems.length} of {allocations.length} products balanced
            </strong>
          </div>
          {underAllocatedItems.length > 0 && (
            <div className="text-amber-700 font-medium">
              {underAllocatedItems.length} product(s) have unassigned units
            </div>
          )}
          {overAllocatedItems.length > 0 && (
            <div className="text-red-700 font-medium">
              {overAllocatedItems.length} product(s) exceed cart capacity
            </div>
          )}
        </div>
      </div>

      {/* Detailed Mismatch Explanations & Quick-Fix Actions */}
      {!isAllValid && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 mb-6 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Required Corrections Detected:</span>
              </h3>
              <ul className="text-xs text-amber-800 space-y-1 pl-5 list-disc">
                {underAllocatedItems.map((u) => (
                  <li key={u.itemId}>
                    <strong className="font-semibold">{u.remainingQuantity} {u.item.name}</strong> are still unassigned to any box.
                  </li>
                ))}
                {overAllocatedItems.map((o) => (
                  <li key={o.itemId}>
                    <strong className="font-semibold">{o.item.name}</strong> is over-allocated by {Math.abs(o.remainingQuantity)} units ({o.allocatedQuantity} allocated vs {o.cartQuantity} in cart).
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Fix Button (as requested in spec: "Provide an action: Fix Allocation") */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => onFixAllocation()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                title="Automatically auto-balance remaining items into available boxes"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Fix Allocation</span>
              </button>

              <button
                onClick={onSyncCartToAllocated}
                className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
                title="Adjust cart quantities to match the current box configuration"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Sync Cart to Boxes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Allocation Verification Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-3 text-right">Cart Qty</th>
                <th className="py-3 px-3 text-right">Allocated</th>
                <th className="py-3 px-3 text-right">Remaining</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allocations.map((alloc) => (
                <tr key={alloc.itemId} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <ItemVisual item={alloc.item} size="sm" />
                      <div>
                        <div className="font-semibold text-neutral-900">{alloc.item.name}</div>
                        <div className="text-[11px] font-mono text-neutral-400">
                          {alloc.item.sku} · {alloc.item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {alloc.cartQuantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {alloc.allocatedQuantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {alloc.remainingQuantity === 0 ? (
                      <span className="text-neutral-400 font-semibold">0</span>
                    ) : alloc.remainingQuantity > 0 ? (
                      <span className="text-amber-700 font-semibold">+{alloc.remainingQuantity} unassigned</span>
                    ) : (
                      <span className="text-red-700 font-semibold">+{Math.abs(alloc.remainingQuantity)} excess</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {alloc.status === 'fully_allocated' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Fully Allocated</span>
                      </span>
                    ) : alloc.status === 'under_allocated' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>{alloc.remainingQuantity} Remaining</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-red-800 bg-red-50 border border-red-200 rounded">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span>Over Allocated (+{Math.abs(alloc.remainingQuantity)})</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {alloc.status !== 'fully_allocated' ? (
                      <button
                        onClick={() => onGoToConfigureBox()}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                      >
                        Adjust Contents →
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400 flex items-center justify-end gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Balanced
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToContents}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Box Contents</span>
        </button>

        <button
          onClick={onContinueToReview}
          disabled={!isAllValid}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            isAllValid
              ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
          title={!isAllValid ? 'Please resolve allocation mismatches before continuing' : ''}
        >
          <span>Continue to Final Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
