import React from 'react';
import { 
  Boxes, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layout, 
  Layers, 
  Table, 
  Columns, 
  SplitSquareVertical, 
  SlidersHorizontal 
} from 'lucide-react';
import { LayoutVariation, OrderStep } from '../types/order';

interface HeaderProps {
  currentStep: OrderStep;
  onNavigateStep: (step: OrderStep) => void;
  layout: LayoutVariation;
  onChangeLayout: (layout: LayoutVariation) => void;
  onLoadBenchmark: () => void;
  onResetOrder: () => void;
  totalBoxes: number;
  totalItems: number;
  isFullyAllocated: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigateStep,
  layout,
  onChangeLayout,
  onLoadBenchmark,
  onResetOrder,
  totalBoxes,
  totalItems,
  isFullyAllocated,
}) => {
  const layoutOptions: { id: LayoutVariation; label: string; icon: React.ReactNode }[] = [
    { id: 'stepper', label: 'Guided Stepper', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'split_view', label: 'Split Workspace', icon: <SplitSquareVertical className="w-3.5 h-3.5" /> },
    { id: 'left_nav', label: 'Sidebar Layout', icon: <Columns className="w-3.5 h-3.5" /> },
    { id: 'table_first', label: 'Table First (Dense)', icon: <Table className="w-3.5 h-3.5" /> },
    { id: 'card_builder', label: 'Card Box Builder', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'master_detail', label: 'Master-Detail', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'two_column', label: 'Two Column', icon: <Columns className="w-3.5 h-3.5" /> },
    { id: 'compact_dashboard', label: 'Compact Cockpit', icon: <Boxes className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 no-print">
      {/* Universal Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Boxes className="w-4 h-4" />
          </div>
          <button 
            onClick={() => onNavigateStep('start')}
            className="text-left font-bold text-neutral-900 text-base tracking-tight hover:text-amber-600 transition-colors"
          >
            BatchBox <span className="font-normal text-xs text-neutral-500 ml-1">Bakery Ops</span>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 text navigation / state tracker links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600">
          <button
            onClick={() => onNavigateStep('select_items')}
            className={`transition-colors hover:text-neutral-900 pb-0.5 ${
              currentStep === 'select_items' ? 'text-amber-600 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            1. Items
          </button>
          <span className="text-neutral-300">/</span>
          <button
            onClick={() => onNavigateStep('cart')}
            className={`transition-colors hover:text-neutral-900 pb-0.5 ${
              currentStep === 'cart' ? 'text-amber-600 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            2. Cart ({totalItems})
          </button>
          <span className="text-neutral-300">/</span>
          <button
            onClick={() => onNavigateStep('box_setup')}
            className={`transition-colors hover:text-neutral-900 pb-0.5 ${
              currentStep === 'box_setup' || currentStep === 'box_contents' ? 'text-amber-600 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            3. Boxes ({totalBoxes})
          </button>
          <span className="text-neutral-300">/</span>
          <button
            onClick={() => onNavigateStep('validation')}
            className={`transition-colors hover:text-neutral-900 pb-0.5 flex items-center gap-1 ${
              currentStep === 'validation' ? 'text-amber-600 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            4. Allocation
            {isFullyAllocated ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : null}
          </button>
          <span className="text-neutral-300">/</span>
          <button
            onClick={() => onNavigateStep('review')}
            className={`transition-colors hover:text-neutral-900 pb-0.5 ${
              currentStep === 'review' ? 'text-amber-600 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            5. Review & Confirm
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions and layout switch */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Layout Mode Selector Dropdown */}
          <div className="relative group">
            <button
              title="Switch Layout Variation"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Layout className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Layout:</span>
              <span className="font-semibold text-neutral-900">
                {layoutOptions.find((l) => l.id === layout)?.label.split(' ')[0]}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Explore Layout Modes
              </div>
              {layoutOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeLayout(opt.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                    layout === opt.id
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className={layout === opt.id ? 'text-amber-600' : 'text-neutral-400'}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Benchmark Button */}
          <button
            onClick={onLoadBenchmark}
            title="Load benchmark example: 15 Tetra, 15 Cake, 20 Samosa, 15 Dairy Milk"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Benchmark</span>
          </button>

          {/* Reset Order */}
          <button
            onClick={onResetOrder}
            title="Clear and reset order"
            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
