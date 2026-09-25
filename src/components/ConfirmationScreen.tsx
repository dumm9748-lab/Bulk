import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  RotateCcw, 
  Package, 
  Boxes, 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { ConfirmedBulkOrder, BakeryItem } from '../types/order';
import { ItemVisual } from './ItemVisual';
import { formatRupees } from '../utils/currency';

interface ConfirmationScreenProps {
  order: ConfirmedBulkOrder;
  catalog: BakeryItem[];
  onStartNewOrder: () => void;
  onViewBoxDetails: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  order,
  catalog,
  onStartNewOrder,
  onViewBoxDetails
}) => {
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));
  const activeCartIds = new Set(order.cartItems.filter((c) => c.quantity > 0).map((c) => c.itemId));

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${order.orderId}-manifest.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Box ID', 'Box Type', 'Item Name', 'SKU', 'Units per Box', 'Total Box Count', 'Total Item Units'],
    ];

    order.boxTypes.forEach((box, bIdx) => {
      Object.entries(box.itemsPerBox).forEach(([itemId, qty]) => {
        if (qty > 0) {
          const it = catalogMap.get(itemId);
          rows.push([
            `BOX-TYPE-${bIdx + 1}`,
            box.name,
            it ? it.name : itemId,
            it ? it.sku : '',
            String(qty),
            String(box.boxQuantity),
            String(box.boxQuantity * qty)
          ]);
        }
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `${order.orderId}-packing-matrix.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Confirmation Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-xs text-center mb-8 relative overflow-hidden">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          Production Order Dispatched to Kitchen & Packing Lines
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Bulk Order Created Successfully
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
          Assigned Production Order ID:{' '}
          <strong className="text-neutral-900 font-mono text-sm">{order.orderId}</strong>
        </p>

        {/* Highlight metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Boxes</div>
            <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
              {order.totalBoxes} Boxes
            </div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Items</div>
            <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
              {order.totalItems} Items
            </div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Value</div>
            <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatRupees(order.totalCost)}
            </div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Production Batch</div>
            <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
              {order.totalWeightKg} kg
            </div>
          </div>
        </div>

        {/* Primary Operational Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-neutral-100 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Box Labels & Manifest</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-lg text-xs font-medium shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV Manifest</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-lg text-xs font-medium shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onViewBoxDetails}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-neutral-600" />
            <span>Inspect Box Breakdown</span>
          </button>
        </div>
      </div>

      {/* Box Breakdown Manifest Summary */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs mb-8">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              Box Packaging Breakdown ({order.totalBoxes} Boxes Created)
            </h2>
            <div className="text-xs text-neutral-500">
              Assigned to Client: {order.customerInfo.customerName} ({order.customerInfo.companyName})
            </div>
          </div>
          <span className="font-mono text-xs font-semibold px-2 py-1 bg-white border border-neutral-200 rounded">
            PO: {order.customerInfo.orderReference}
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {order.boxTypes.map((box) => {
            const itemsInBox = Object.entries(box.itemsPerBox).filter(
              ([itemId, qty]) => (qty || 0) > 0 && activeCartIds.has(itemId)
            );
            return (
              <div key={box.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: box.boxColor }}
                    />
                    <h3 className="font-bold text-sm text-neutral-900">{box.name}</h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-900">
                      {box.boxQuantity} Boxes
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Yield: {box.boxQuantity * itemsInBox.reduce((s, [_, q]) => s + q, 0)} total units
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {itemsInBox.map(([itemId, qty]) => {
                    const it = catalogMap.get(itemId);
                    if (!it) return null;
                    return (
                      <div
                        key={itemId}
                        className="bg-neutral-50 p-2 rounded border border-neutral-100 flex items-center justify-between"
                      >
                        <span className="text-neutral-700 font-medium truncate mr-1">
                          {it.name.split(' ')[0]}
                        </span>
                        <span className="font-mono font-bold text-neutral-900 shrink-0">
                          {qty} / box ({qty * box.boxQuantity} total)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start New Order */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onStartNewOrder}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Create Another Bulk Order</span>
        </button>

        <span className="text-xs text-neutral-400">
          Order logged into ERP & kitchen scheduling engine
        </span>
      </div>
    </div>
  );
};
