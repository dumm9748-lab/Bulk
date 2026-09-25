import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Minus, 
  Trash2, 
  RefreshCw, 
  Send, 
  Boxes,
  HelpCircle,
  Wrench
} from 'lucide-react';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ItemAllocationSummary 
} from '../../types/order';
import { ItemVisual } from '../ItemVisual';
import { formatRupees } from '../../utils/currency';

interface TableFirstLayoutProps {
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
  onRemoveBoxType: (boxId: string) => void;
  onFixAllocation: () => void;
  onSyncCartToAllocated: () => void;
  onSubmitOrder: () => void;
}

export const TableFirstLayout: React.FC<TableFirstLayoutProps> = ({
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
  onRemoveBoxType,
  onFixAllocation,
  onSyncCartToAllocated,
  onSubmitOrder
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const allocationMap = new Map(allocations.map((a) => [a.itemId, a]));
  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Dense Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
            <span>High-Density Matrix Mode</span>
            <span aria-hidden="true">·</span>
            <span>Batch Reconciliation</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <span>Bulk Allocation Matrix</span>
            <span className="font-mono text-xs font-normal text-neutral-500">
              ({customerInfo.customerName} · PO: {customerInfo.orderReference})
            </span>
          </h1>
        </div>

        {/* Quick batch stats & fix actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs text-neutral-600">
            Cart: <strong className="text-neutral-900 font-mono">{totalCartUnits}</strong> units · Boxes: <strong className="text-neutral-900 font-mono">{totalBoxes}</strong> boxes
          </div>

          {!isValidForSubmission && (
            <button
              onClick={onFixAllocation}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Wrench className="w-3 h-3" />
              <span>Auto-Fix</span>
            </button>
          )}

          <button
            onClick={onSyncCartToAllocated}
            className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium transition-colors"
          >
            Sync Cart
          </button>

          <button
            onClick={onSubmitOrder}
            disabled={!isValidForSubmission}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isValidForSubmission
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm Order</span>
          </button>
        </div>
      </div>

      {/* Box Types Control Toolbar */}
      <div className="bg-neutral-100 border border-neutral-200 rounded-t-xl p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px] shrink-0">
            Configured Boxes ({boxTypes.length}):
          </span>
          {boxTypes.map((box, idx) => (
            <div
              key={box.id}
              className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 flex items-center gap-2 shadow-xs shrink-0"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: box.boxColor }}
              />
              <span className="font-bold text-neutral-900">{box.name}:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={box.boxQuantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) onUpdateBoxType(box.id, { boxQuantity: v });
                  }}
                  className="w-12 text-center font-mono font-bold text-xs border border-neutral-200 rounded py-0.5 bg-neutral-50"
                />
                <span className="text-neutral-500 text-[11px]">boxes</span>
              </div>
              {boxTypes.length > 1 && (
                <button
                  onClick={() => onRemoveBoxType(box.id)}
                  className="text-neutral-400 hover:text-red-600 transition-colors ml-1"
                  title="Remove box type"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onAddBoxType}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded font-semibold text-xs whitespace-nowrap shadow-xs"
        >
          + Add Box Type
        </button>
      </div>

      {/* Unified Allocation Matrix Spreadsheet Table */}
      <div className="bg-white border-x border-b border-neutral-200 rounded-b-xl overflow-hidden shadow-xs mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-600 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Item & SKU</th>
                <th className="py-3 px-3 text-right bg-neutral-100/50">Cart Total</th>
                {/* Dynamic columns per Box Type */}
                {boxTypes.map((box) => (
                  <th
                    key={box.id}
                    className="py-3 px-3 text-center border-l border-neutral-200"
                    style={{ backgroundColor: `${box.boxColor}08` }}
                  >
                    <div>{box.name}</div>
                    <div className="text-[10px] font-mono text-neutral-400 font-normal">
                      ({box.boxQuantity} boxes)
                    </div>
                  </th>
                ))}
                <th className="py-3 px-3 text-right border-l border-neutral-200 bg-neutral-50">
                  Total Allocated
                </th>
                <th className="py-3 px-3 text-center bg-neutral-50">Remaining</th>
                <th className="py-3 px-4 text-center bg-neutral-50">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {cart.map((cartItem) => {
                const item = catalogMap.get(cartItem.itemId);
                if (!item) return null;

                const alloc = allocationMap.get(item.id);
                const globalAllocated = alloc ? alloc.allocatedQuantity : 0;
                const remaining = alloc ? alloc.remainingQuantity : cartItem.quantity;
                const status = alloc ? alloc.status : 'under_allocated';

                return (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Item identification */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <ItemVisual item={item} size="sm" />
                        <div>
                          <div className="font-semibold text-neutral-900">{item.name}</div>
                          <div className="text-[11px] font-mono text-neutral-400">
                            {item.sku} · {formatRupees(item.unitPrice)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cart Total with interactive edit */}
                    <td className="py-2.5 px-3 text-right bg-neutral-50/50 font-mono tabular-nums">
                      <input
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v >= 0) onUpdateCartItem(item.id, v);
                        }}
                        className="w-14 text-right font-bold text-xs py-0.5 px-1 border border-neutral-200 rounded bg-white"
                      />
                    </td>

                    {/* Inputs for each box type */}
                    {boxTypes.map((box) => {
                      const qtyPerBox = box.itemsPerBox[item.id] || 0;
                      const yieldForThisBox = box.boxQuantity * qtyPerBox;

                      return (
                        <td
                          key={box.id}
                          className="py-2.5 px-3 text-center border-l border-neutral-100"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() =>
                                onUpdateBoxItems(
                                  box.id,
                                  item.id,
                                  Math.max(0, qtyPerBox - 1)
                                )
                              }
                              className="w-5 h-5 flex items-center justify-center rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={qtyPerBox}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (!isNaN(v) && v >= 0)
                                  onUpdateBoxItems(box.id, item.id, v);
                              }}
                              className="w-10 text-center font-mono font-bold text-xs py-0.5 border border-neutral-200 rounded bg-white"
                            />
                            <button
                              onClick={() =>
                                onUpdateBoxItems(box.id, item.id, qtyPerBox + 1)
                              }
                              className="w-5 h-5 flex items-center justify-center rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            = {yieldForThisBox} units
                          </div>
                        </td>
                      );
                    })}

                    {/* Total Allocated */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 border-l border-neutral-100 tabular-nums">
                      {globalAllocated}
                    </td>

                    {/* Remaining */}
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                      {remaining === 0 ? (
                        <span className="text-neutral-400">0</span>
                      ) : remaining > 0 ? (
                        <span className="text-amber-700 font-bold">+{remaining}</span>
                      ) : (
                        <span className="text-red-700 font-bold">+{Math.abs(remaining)} OVER</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-4 text-center">
                      {status === 'fully_allocated' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Balanced</span>
                        </span>
                      ) : status === 'under_allocated' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>{remaining} Left</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Over</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
