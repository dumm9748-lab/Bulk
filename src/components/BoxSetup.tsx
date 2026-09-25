import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowRight, 
  ArrowLeft, 
  SlidersHorizontal, 
  Package, 
  AlertCircle,
  Sparkles,
  Gift,
  Check,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BoxType, CartItem, BoxPackageStyle } from '../types/order';

interface BoxSetupProps {
  boxTypes: BoxType[];
  cart: CartItem[];
  onAddBoxType: () => void;
  onUpdateBoxType: (id: string, updated: Partial<BoxType>) => void;
  onDuplicateBoxType: (id: string) => void;
  onRemoveBoxType: (id: string) => void;
  onConfigureContents: (boxId?: string) => void;
  onBackToCart: () => void;
  onContinueToContents: () => void;
}

interface PackageStyleDefinition {
  id: BoxPackageStyle;
  title: string;
  badge: string;
  material: string;
  description: string;
  recommendedFor: string;
}

const PACKAGE_STYLES: PackageStyleDefinition[] = [
  {
    id: 'kraft_window',
    title: 'Eco Kraft Window Box',
    badge: 'Eco Recyclable',
    material: 'Natural 350gsm unbleached kraft board + plant-based window',
    description: 'Clean showcase packaging with a clear viewing window. Perfect for visual pastry and cookie assortments.',
    recommendedFor: 'Conference teas, standard catering & bakery gift sets'
  },
  {
    id: 'rigid_hamper',
    title: 'Rigid Luxury Hamper Box',
    badge: 'Luxury Gift',
    material: 'Heavyweight rigid board with embossed foil stamping & magnetic clasp',
    description: 'Ultra-premium presentation box with concealed magnetic closure and velvety smooth finish.',
    recommendedFor: 'VIP executives, celebratory gifts & corporate gala hampers'
  },
  {
    id: 'corrugated_handle',
    title: 'Corrugated Treat & Carry Box',
    badge: 'Transit Sturdy',
    material: 'E-flute corrugated cardboard with reinforced die-cut folding handle',
    description: 'High-strength structural box designed for safe, self-carrying transit of heavier catering items.',
    recommendedFor: 'Outdoor events, picnics, site delivery & high-volume hand-offs'
  },
  {
    id: 'tin_canister',
    title: 'Decorative Metallic Tin Canister',
    badge: 'Airtight Keepsake',
    material: 'Food-grade embossed tinplate with airtight sealed friction lid',
    description: 'Reusable metallic keepsake tin preserving maximum crunch and freshness for cookies and treats.',
    recommendedFor: 'Festival hampers, souvenir keepsakes & long-distance shipping'
  },
  {
    id: 'bento_partitioned',
    title: 'Bento Partitioned Box',
    badge: 'Multi-Compartment',
    material: 'Modular 4-6 section food-grade dividers with greaseproof parchment liners',
    description: 'Individual internal compartments preventing delicate pastries, savories, and chocolates from touching.',
    recommendedFor: 'Mixed savory + sweet menus, individual meal packs'
  },
  {
    id: 'branded_corporate',
    title: 'Custom Branded Corporate Box',
    badge: 'Custom Print',
    material: 'Full-bleed CMYK offset printed coated artboard with matte lamination',
    description: 'Tailored box exterior featuring custom corporate logo, event colors, and personalized branding.',
    recommendedFor: 'Brand activations, annual general meetings & sponsored summits'
  }
];

const PACKAGING_INCLUSIONS_LIST = [
  'Satin Ribbon & Bow Wrap',
  'Personalized Greeting / Gift Tag',
  'Wood-Wool Cushioning Shred',
  'Foil Thermal Cooling Liner',
  'Tamper-Evident Safety Gold Seal'
];

export const BoxSetup: React.FC<BoxSetupProps> = ({
  boxTypes,
  cart,
  onAddBoxType,
  onUpdateBoxType,
  onDuplicateBoxType,
  onRemoveBoxType,
  onConfigureContents,
  onBackToCart,
  onContinueToContents
}) => {
  // Track which box has its packaging customization drawer open
  const [openPackageCustomizerId, setOpenPackageCustomizerId] = useState<string | null>(
    boxTypes.length > 0 ? boxTypes[0].id : null
  );

  const totalBoxes = boxTypes.reduce((sum, b) => sum + (b.boxQuantity || 0), 0);
  const totalCartUnits = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Step 3 of 7</span>
            <span aria-hidden="true">·</span>
            <span>Combo Box Packaging Specification</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Define Combo Boxes & Package Styles
          </h1>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Segregate your <strong className="text-neutral-900 tabular-nums">{totalCartUnits} order items</strong> into custom combo packs. Choose the exact <strong>physical packaging format</strong> (Kraft Window, Luxury Rigid Hamper, Corrugated Carry, Bento, etc.) for each batch.
          </p>
        </div>

        {/* Total Boxes Counter Pill/Stat */}
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 shadow-xs text-right shrink-0">
          <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Total Boxes in Batch
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {totalBoxes}
          </div>
          <div className="text-[11px] text-neutral-400">across {boxTypes.length} combo type{boxTypes.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Box Types List */}
      <div className="space-y-6 mb-6">
        {boxTypes.map((box, index) => {
          const configuredItemsCount = Object.values(box.itemsPerBox).reduce(
            (sum, q) => sum + (q || 0),
            0
          );
          const totalUnitsProduced = box.boxQuantity * configuredItemsCount;
          const isCustomizerOpen = openPackageCustomizerId === box.id;

          // Find current package style
          const currentStyleId = box.packageStyle || 'kraft_window';
          const currentStyle = PACKAGE_STYLES.find((s) => s.id === currentStyleId) || PACKAGE_STYLES[0];
          const currentTier = box.packageTier || 'Premium';
          const currentDimensions = box.packageDimensions || '25 × 20 × 10 cm';
          const currentInclusions = box.packageInclusions || ['Satin Ribbon & Bow Wrap', 'Tamper-Evident Safety Gold Seal'];

          return (
            <div
              key={box.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-300 transition-all overflow-hidden"
            >
              {/* Box Top Header: Identity, Name, Quantity & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                {/* Box Identity & Name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
                    style={{ backgroundColor: box.boxColor }}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Combo Pack {index + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
                        {currentStyle.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={box.name}
                        onChange={(e) => onUpdateBoxType(box.id, { name: e.target.value })}
                        className="text-base font-bold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-[#9c0753] focus:outline-none bg-transparent px-0.5 py-0.5"
                        placeholder="Combo Box Name"
                      />
                    </div>

                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-2 mt-0.5">
                      <span>Target: {box.capacityItems} items</span>
                      <span aria-hidden="true">·</span>
                      <span>Configured: <strong className="text-neutral-800">{configuredItemsCount} items/box</strong></span>
                      {configuredItemsCount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-neutral-700 font-mono">Yield: {totalUnitsProduced} total units</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Box Quantity Control & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                      Box Quantity
                    </label>
                    <div className="flex items-center gap-1 bg-neutral-50 p-1 border border-neutral-200 rounded-lg">
                      <button
                        onClick={() =>
                          onUpdateBoxType(box.id, {
                            boxQuantity: Math.max(1, box.boxQuantity - 1)
                          })
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white hover:bg-neutral-100 rounded text-neutral-700 shadow-2xs font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={box.boxQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            onUpdateBoxType(box.id, { boxQuantity: val });
                          }
                        }}
                        className="w-12 text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          onUpdateBoxType(box.id, { boxQuantity: box.boxQuantity + 1 })
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white hover:bg-neutral-100 rounded text-neutral-700 shadow-2xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onConfigureContents(box.id)}
                      className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Configure item breakdown for this combo box"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Items Breakdown</span>
                    </button>

                    <button
                      onClick={() => onDuplicateBoxType(box.id)}
                      className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Duplicate this box type"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {boxTypes.length > 1 && (
                      <button
                        onClick={() => onRemoveBoxType(box.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove this box type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* WHAT KIND OF BOX PACKAGE DO YOU WANT? FEATURE SECTION */}
              <div className="mt-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#9c0753]" />
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Selected Package: <span className="text-[#9c0753]">{currentStyle.title}</span> ({currentDimensions} · {currentTier})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenPackageCustomizerId(isCustomizerOpen ? null : box.id)}
                    className="text-xs text-[#9c0753] hover:text-[#800543] font-bold flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    <span>{isCustomizerOpen ? 'Collapse Package Options' : 'Change Package Format'}</span>
                    {isCustomizerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Package Quick Summary Pills */}
                {!isCustomizerOpen && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 font-mono text-[11px]">
                      📦 {currentStyle.material}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 font-mono text-[11px]">
                      📐 {currentDimensions}
                    </span>
                    {currentInclusions.map((inc) => (
                      <span key={inc} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                )}

                {/* EXPANDED PACKAGE CUSTOMIZATION DRAWER */}
                {isCustomizerOpen && (
                  <div className="mt-4 p-4 bg-neutral-50/80 rounded-xl border border-neutral-200 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        1. What Kind of Box Package Format Do You Want?
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {PACKAGE_STYLES.map((style) => {
                          const isSelected = currentStyleId === style.id;
                          return (
                            <div
                              key={style.id}
                              onClick={() => onUpdateBoxType(box.id, { packageStyle: style.id })}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#9c0753] bg-white ring-2 ring-[#9c0753]/20 shadow-xs'
                                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isSelected ? 'bg-[#9c0753] text-white' : 'bg-neutral-100 text-neutral-600'
                                  }`}>
                                    {style.badge}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[10px] font-bold text-[#9c0753] flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Selected
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold text-neutral-900">
                                  {style.title}
                                </h4>
                                <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                                  {style.description}
                                </p>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
                                Best for: {style.recommendedFor}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tier & Dimensions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                      {/* Packaging Tier */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                          2. Presentation Finish Tier
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Standard', 'Premium', 'Luxury'] as const).map((tier) => (
                            <button
                              key={tier}
                              type="button"
                              onClick={() => onUpdateBoxType(box.id, { packageTier: tier })}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                                currentTier === tier
                                  ? 'bg-[#9c0753] text-white border-[#9c0753] shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              {tier}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Package Dimensions */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                          3. Physical Box Dimensions
                        </label>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          {['20 × 15 × 8 cm', '25 × 20 × 10 cm', '32 × 26 × 12 cm'].map((dim) => (
                            <button
                              key={dim}
                              type="button"
                              onClick={() => onUpdateBoxType(box.id, { packageDimensions: dim })}
                              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold border transition-all text-center ${
                                currentDimensions === dim
                                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              {dim}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Package Inclusions & Embellishments */}
                    <div className="pt-2 border-t border-neutral-200">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        4. Package Inclusions & Finishing Touches
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {PACKAGING_INCLUSIONS_LIST.map((inclusion) => {
                          const isIncluded = currentInclusions.includes(inclusion);
                          return (
                            <button
                              key={inclusion}
                              type="button"
                              onClick={() => {
                                const nextInclusions = isIncluded
                                  ? currentInclusions.filter((i) => i !== inclusion)
                                  : [...currentInclusions, inclusion];
                                onUpdateBoxType(box.id, { packageInclusions: nextInclusions });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isIncluded
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              <Check className={`w-3.5 h-3.5 ${isIncluded ? 'opacity-100' : 'opacity-30'}`} />
                              <span>{inclusion}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Another Box Type Button */}
      <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-neutral-600">
          Need an additional combo specification (e.g. VIP breakfast box or vegan-only treat box)?
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddBoxType}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Another Box Type</span>
          </button>
        </div>
      </div>

      {/* Navigation Footbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCart}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>

        <button
          onClick={onContinueToContents}
          disabled={boxTypes.length === 0 || totalBoxes === 0}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            boxTypes.length > 0 && totalBoxes > 0
              ? 'bg-[#9c0753] hover:bg-[#850546] text-white shadow-sm'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <span>Configure Items per Box</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
