import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Sparkles,
  Gift,
  X,
  ArrowRight,
  Package,
  Layers,
  ChefHat
} from 'lucide-react';
import { BakeryItem, CartItem, CustomerOrderInfo, ItemCategory } from '../types/order';
import { formatRupees } from '../utils/currency';

interface ItemSelectorProps {
  catalog: BakeryItem[];
  cart: CartItem[];
  customerInfo?: CustomerOrderInfo;
  onUpdateCartItem: (itemId: string, quantity: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onContinueToCart: () => void;
  onQuickLoadBenchmarkItems: () => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
  catalog,
  cart,
  customerInfo,
  onUpdateCartItem,
  onRemoveCartItem,
  onContinueToCart,
  onQuickLoadBenchmarkItems
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('All');

  const categories: ItemCategory[] = ['All', 'Savory', 'Pastries', 'Confectionery', 'Beverages'];

  // Cart lookups
  const cartMap = new Map(cart.map((c) => [c.itemId, c.quantity]));
  const catalogMap = new Map(catalog.map((i) => [i.id, i]));

  const filteredItems = catalog.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsList = cart
    .filter((c) => c.quantity > 0)
    .map((c) => {
      const item = catalogMap.get(c.itemId);
      return {
        ...c,
        item,
        lineTotal: item ? item.unitPrice * c.quantity : 0
      };
    });

  const totalQuantity = cart.reduce((sum, c) => sum + c.quantity, 0);
  const uniqueItemsCount = cart.filter((c) => c.quantity > 0).length;
  const totalCost = cart.reduce((sum, c) => {
    const item = catalogMap.get(c.itemId);
    return sum + (item ? item.unitPrice * c.quantity : 0);
  }, 0);

  // Customer info display values
  const customerName = customerInfo?.customerName || 'Jithendra prasad';
  const customerPhone = customerInfo?.contactPhone || '+918179293774';
  const deliverySlot = customerInfo?.deliverySlot || '05 PM -06';
  const eventDate = customerInfo?.eventDate || '04-09-2026';

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Container Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
        
        {/* TOP BANNER: Deep Berry / Magenta Header matching reference image */}
        <div className="bg-gradient-to-r from-[#850847] via-[#9c0753] to-[#b80c61] text-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Gift Icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                Add Combo Items Details
              </h1>
              <p className="text-xs text-pink-100 font-medium mt-0.5">
                Add the combo set details and quantities to continue with the bulk order. 🎁
              </p>
            </div>
          </div>

          {/* Right Customer Info Pills matching reference image */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Customer Name Pill */}
            <div className="bg-white px-3.5 py-1.5 rounded-lg shadow-sm">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                Customer Name
              </div>
              <div className="text-xs font-bold text-[#9c0753] capitalize">
                {customerName}
              </div>
            </div>

            {/* Customer Phone Pill */}
            <div className="bg-white px-3.5 py-1.5 rounded-lg shadow-sm">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                Customer Phone
              </div>
              <div className="text-xs font-bold text-[#9c0753] font-mono">
                {customerPhone}
              </div>
            </div>

            {/* Delivery Date Time Pill */}
            <div className="bg-white px-3.5 py-1.5 rounded-lg shadow-sm">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                Delivery Date Time
              </div>
              <div className="text-xs font-bold text-[#9c0753] font-mono">
                {eventDate} | {deliverySlot}
              </div>
            </div>

            {/* Benchmark Quick-Fill button */}
            <button
              onClick={onQuickLoadBenchmarkItems}
              title="Populate Benchmark 15/15/20/15"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Benchmark</span>
            </button>
          </div>
        </div>

        {/* MAIN BODY: SPLIT VIEW (Items Selection on Left, Cart Review on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT PANEL: ITEMS SELECTION (TABULAR FORMAT) */}
          <div className="lg:col-span-8 p-5 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col justify-between">
            <div>
              {/* Category Pills & Benchmark */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#9c0753] text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-neutral-400 font-mono">
                  {filteredItems.length} items available
                </span>
              </div>

              {/* Search Bar matching image */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by food item name..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#9c0753]/30 focus:border-[#9c0753] transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Tabular List of Items */}
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white max-h-[440px] overflow-y-auto">
                {filteredItems.map((item) => {
                  const qty = cartMap.get(item.id) || 0;
                  const outletStock = item.outletStock || 290;
                  const availableStock = item.availableStock || 40;
                  const prepDays = item.prepDays || 3;

                  return (
                    <div
                      key={item.id}
                      className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Left: Product Name, Outlet Stock Badge & Meta */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900 truncate">
                            {item.name}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d91448] text-white shrink-0 shadow-2xs">
                            • Outlet Stock : {outletStock}
                          </span>
                        </div>

                        {/* Subtitle row matching image: ₹price • 3 Days Preparation • Available Stock : 40 */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 font-mono">
                          <span className="font-bold text-neutral-900">
                            {formatRupees(item.unitPrice)}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span>{prepDays} Days Preparation</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-emerald-700 font-semibold">
                            Available Stock : {availableStock}
                          </span>
                        </div>
                      </div>

                      {/* Right: Stepper Control matching reference image */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Decrement Button */}
                        <button
                          type="button"
                          onClick={() => onUpdateCartItem(item.id, Math.max(0, qty - 1))}
                          className="w-8 h-8 rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center font-bold text-neutral-700 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* Quantity Display Box */}
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 0) {
                              onUpdateCartItem(item.id, val);
                            }
                          }}
                          className="w-12 h-8 text-center font-mono font-bold text-sm border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#9c0753]"
                        />

                        {/* Solid Berry Increment Button */}
                        <button
                          type="button"
                          onClick={() => onUpdateCartItem(item.id, qty + 1)}
                          className="w-8 h-8 rounded-md bg-[#9c0753] hover:bg-[#850546] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredItems.length === 0 && (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    No items match "{searchQuery}" in this category.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar of Left Panel matching reference image */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 uppercase text-[10px] block font-bold">
                    Selection Subtotal
                  </span>
                  <span className="text-base font-bold text-[#9c0753]">
                    {formatRupees(totalCost)}
                  </span>
                </div>
                <div className="w-px h-8 bg-neutral-200" />
                <div>
                  <span className="text-neutral-400 uppercase text-[10px] block font-bold">
                    Current Selection
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {uniqueItemsCount} Product Entries ({totalQuantity} Units)
                  </span>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={onContinueToCart}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#9c0753] hover:bg-[#850546] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ ADD TO CART</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: CART REVIEW (Item : X) matching reference image */}
          <div className="lg:col-span-4 bg-neutral-50/50 flex flex-col justify-between">
            {/* Cart Header Banner */}
            <div>
              <div className="bg-[#9c0753] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span className="font-black text-xs uppercase tracking-wider">
                    Cart Review
                  </span>
                </div>
                <span className="bg-white text-[#9c0753] text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                  ITEM : {uniqueItemsCount}
                </span>
              </div>

              {/* Cart Content: Empty State vs Populated Items */}
              <div className="p-4 max-h-[460px] overflow-y-auto">
                {cartItemsList.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    {/* PastryChef Emblem Badge matching reference image */}
                    <div className="w-28 h-20 rounded-full border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center justify-center shadow-xs mb-3 px-2">
                      <ChefHat className="w-5 h-5 text-neutral-400 mb-0.5" />
                      <span className="text-[10px] font-bold text-neutral-600 tracking-tight">
                        PastryChef
                      </span>
                      <span className="text-[7px] text-neutral-400 tracking-widest uppercase">
                        Bakery & Sweets
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-800">
                      Your cart is empty
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                      Select items on the left to begin
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cartItemsList.map(({ itemId, quantity, item, lineTotal }) => {
                      if (!item) return null;

                      return (
                        <div
                          key={itemId}
                          className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-neutral-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                              {formatRupees(item.unitPrice)} × {quantity}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Line Total */}
                            <span className="font-mono font-bold text-xs text-neutral-900">
                              {formatRupees(lineTotal)}
                            </span>

                            {/* Stepper buttons */}
                            <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateCartItem(itemId, Math.max(0, quantity - 1))}
                                className="w-5 h-5 rounded bg-white text-neutral-700 flex items-center justify-center text-xs font-bold hover:bg-neutral-200"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-xs font-bold font-mono">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateCartItem(itemId, quantity + 1)}
                                className="w-5 h-5 rounded bg-[#9c0753] text-white flex items-center justify-center text-xs font-bold hover:bg-[#850546]"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => onRemoveCartItem(itemId)}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar of Cart Review matching reference image */}
            <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Cart Total
                </span>
                <span className="text-base font-bold text-[#9c0753] font-mono">
                  {formatRupees(totalCost)}
                </span>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                disabled={totalQuantity === 0}
                onClick={onContinueToCart}
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  totalQuantity === 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-[#9c0753] hover:bg-[#850546] text-white'
                }`}
              >
                <span>Proceed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
