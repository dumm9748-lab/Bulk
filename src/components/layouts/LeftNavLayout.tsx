import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Package, 
  SlidersHorizontal, 
  ShieldCheck, 
  Boxes, 
  CheckCircle2, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { OrderStep } from '../../types/order';

interface LeftNavLayoutProps {
  currentStep: OrderStep;
  onNavigateStep: (step: OrderStep) => void;
  isFullyAllocated: boolean;
  totalItems: number;
  totalBoxes: number;
  children: React.ReactNode;
}

export const LeftNavLayout: React.FC<LeftNavLayoutProps> = ({
  currentStep,
  onNavigateStep,
  isFullyAllocated,
  totalItems,
  totalBoxes,
  children
}) => {
  const steps: { id: OrderStep; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'start', label: 'Client Logistics', icon: <Building2 className="w-4 h-4" /> },
    { id: 'select_items', label: 'Item Catalog', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'cart', label: 'Cart Manifest', icon: <FileText className="w-4 h-4" />, badge: `${totalItems}` },
    { id: 'box_setup', label: 'Box Types & Quantities', icon: <Package className="w-4 h-4" />, badge: `${totalBoxes}` },
    { id: 'box_contents', label: 'Configure Contents', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { 
      id: 'validation', 
      label: 'Allocation Validation', 
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: isFullyAllocated ? '✓ 100%' : 'Mismatch'
    },
    { id: 'review', label: 'Review & Commit', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-200 bg-white p-4 shrink-0 hidden md:block no-print">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-3">
          Workflow Pipeline
        </div>
        <nav className="space-y-1">
          {steps.map((st) => {
            const isActive = currentStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => onNavigateStep(st.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-amber-400' : 'text-neutral-400'}>
                    {st.icon}
                  </span>
                  <span>{st.label}</span>
                </div>
                {st.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-300'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {st.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
