import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';
import { CustomerOrderInfo } from '../types/order';
import { PRESET_TEMPLATES } from '../data/mockData';

interface BulkOrderStartProps {
  customerInfo: CustomerOrderInfo;
  onUpdateCustomerInfo: (updated: Partial<CustomerOrderInfo>) => void;
  onStartOrder: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const BulkOrderStart: React.FC<BulkOrderStartProps> = ({
  customerInfo,
  onUpdateCustomerInfo,
  onStartOrder,
  onLoadPreset
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
          <span>Commercial Bakery Operations</span>
          <span aria-hidden="true">·</span>
          <span>B2B Packaging Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
          Create Bulk Bakery Order
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl text-pretty">
          Configure multi-box catering distributions, calculate real-time item allocations,
          and ensure zero-error packaging for corporate events and institutional catering.
        </p>
      </div>

      {/* Preset Quick Start Templates */}
      <div className="mb-8 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Quick-Start Benchmark Presets</span>
        </div>
        <p className="text-xs text-amber-800/80 mb-3">
          Select a verified production template to auto-populate customer details, item quantities, and box configurations:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onLoadPreset(tpl.id)}
              className="p-3 text-left bg-white border border-amber-200 hover:border-amber-400 rounded-lg shadow-xs hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-700 transition-colors">
                  {tpl.title}
                </span>
                <span className="text-[11px] text-amber-700 font-medium">Load Template →</span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                {tpl.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Customer & Order Metadata Form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs mb-8">
        <h2 className="text-base font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center justify-between">
          <span>Client & Logistics Information</span>
          <span className="text-xs font-normal text-neutral-500">Required for production manifest</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Customer / Point of Contact *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customerInfo.customerName}
                onChange={(e) => onUpdateCustomerInfo({ customerName: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Organization / Company *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customerInfo.companyName}
                onChange={(e) => onUpdateCustomerInfo({ companyName: e.target.value })}
                placeholder="e.g. Global Tech Summits"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Purchase Order / Reference # *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customerInfo.orderReference}
                onChange={(e) => onUpdateCustomerInfo({ orderReference: e.target.value })}
                placeholder="e.g. PO-2026-APX-849"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-xs bg-neutral-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Event / Delivery Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={customerInfo.eventDate}
                onChange={(e) => onUpdateCustomerInfo({ eventDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Delivery Window / Slot *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customerInfo.deliverySlot}
                onChange={(e) => onUpdateCustomerInfo({ deliverySlot: e.target.value })}
                placeholder="e.g. 09:00 AM – 10:00 AM"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={customerInfo.contactEmail}
                onChange={(e) => onUpdateCustomerInfo({ contactEmail: e.target.value })}
                placeholder="client@company.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={customerInfo.contactPhone}
                onChange={(e) => onUpdateCustomerInfo({ contactPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Delivery Venue & Dock Instructions
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={customerInfo.deliveryVenue}
              onChange={(e) => onUpdateCustomerInfo({ deliveryVenue: e.target.value })}
              placeholder="e.g. Tower B, 14th Floor Executive Boardroom, Metro Center"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-neutral-50/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="rush-order"
            checked={customerInfo.isRushOrder}
            onChange={(e) => onUpdateCustomerInfo({ isRushOrder: e.target.checked })}
            className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
          />
          <label htmlFor="rush-order" className="text-xs font-medium text-neutral-800 flex items-center gap-1 cursor-pointer">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Mark as Priority / Rush Production Batch (&lt; 24h turn-around)
          </label>
        </div>
      </div>

      {/* Start Action */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          Step 1 of 8: Client Logistics Setup
        </div>
        <button
          onClick={onStartOrder}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
        >
          <span>Continue to Select Items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
