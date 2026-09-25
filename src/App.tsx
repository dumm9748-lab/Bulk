import React, { useState, useEffect } from 'react';
import { 
  BAKERY_CATALOG, 
  INITIAL_CUSTOMER_INFO, 
  PRESET_TEMPLATES, 
  INITIAL_BOX_TYPES 
} from './data/mockData';
import { 
  BakeryItem, 
  BoxType, 
  CartItem, 
  CustomerOrderInfo, 
  ConfirmedBulkOrder, 
  LayoutVariation, 
  OrderStep 
} from './types/order';
import { 
  calculateAllocation, 
  isOrderValidForSubmission, 
  calculateOrderTotals, 
  syncCartToAllocated,
  sanitizeBoxTypes 
} from './utils/allocation';

import { Header } from './components/Header';
import { BulkOrderStart } from './components/BulkOrderStart';
import { ItemSelector } from './components/ItemSelector';
import { CartReview } from './components/CartReview';
import { BoxSetup } from './components/BoxSetup';
import { BoxContentConfig } from './components/BoxContentConfig';
import { AllocationValidator } from './components/AllocationValidator';
import { OrderReview } from './components/OrderReview';
import { ConfirmationScreen } from './components/ConfirmationScreen';

import { LeftNavLayout } from './components/layouts/LeftNavLayout';
import { SplitWorkspaceLayout } from './components/layouts/SplitWorkspaceLayout';
import { TableFirstLayout } from './components/layouts/TableFirstLayout';
import { MasterDetailLayout } from './components/layouts/MasterDetailLayout';
import { CardBuilderLayout } from './components/layouts/CardBuilderLayout';
import { CompactDashboardLayout } from './components/layouts/CompactDashboardLayout';

export default function App() {
  // State
  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(INITIAL_CUSTOMER_INFO);
  const [catalog] = useState<BakeryItem[]>(BAKERY_CATALOG);
  
  // Default Cart matches benchmark specification: 15 Tetra, 15 Cake, 20 Samosa, 15 Dairy Milk
  const [cart, setCart] = useState<CartItem[]>([
    { itemId: 'tetra-pack', quantity: 15 },
    { itemId: 'cake', quantity: 15 },
    { itemId: 'samosa', quantity: 20 },
    { itemId: 'dairy-milk', quantity: 15 }
  ]);

  // Box Types matches benchmark specification:
  // Combo Box Pack 1 (10 Boxes) & Combo Box Pack 2 (5 Boxes)
  const [boxTypes, setBoxTypes] = useState<BoxType[]>(INITIAL_BOX_TYPES);

  const [currentStep, setCurrentStep] = useState<OrderStep>('select_items');
  const [layout, setLayout] = useState<LayoutVariation>('stepper');
  const [selectedBoxIdForConfig, setSelectedBoxIdForConfig] = useState<string | undefined>(undefined);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedBulkOrder | null>(null);

  // Derived calculations
  const allocations = calculateAllocation(cart, boxTypes, catalog);
  const { isValid: isFullyAllocated } = isOrderValidForSubmission(allocations);
  const orderTotals = calculateOrderTotals(cart, boxTypes, catalog);

  // CRITICAL FIX FOR PROBLEM 1:
  // Automatically sanitize boxTypes whenever cart changes.
  // Any item not in active cart (e.g. Vanilla Cake) is immediately stripped from all box configurations!
  useEffect(() => {
    setBoxTypes((prevBoxes) => sanitizeBoxTypes(prevBoxes, cart));
  }, [cart]);

  // Handlers for Customer Info
  const handleUpdateCustomerInfo = (updated: Partial<CustomerOrderInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...updated }));
  };

  // Handlers for Cart
  const handleUpdateCartItem = (itemId: string, quantity: number) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.itemId === itemId);
      if (exists) {
        if (quantity <= 0) return prev.filter((c) => c.itemId !== itemId);
        return prev.map((c) => (c.itemId === itemId ? { ...c, quantity } : c));
      } else {
        if (quantity <= 0) return prev;
        return [...prev, { itemId, quantity }];
      }
    });

    if (quantity <= 0) {
      setBoxTypes((prevBoxes) =>
        prevBoxes.map((b) => {
          const updated = { ...b.itemsPerBox };
          delete updated[itemId];
          return { ...b, itemsPerBox: updated };
        })
      );
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.itemId !== itemId));
    // Immediately purge from box configurations as well
    setBoxTypes((prevBoxes) =>
      prevBoxes.map((b) => {
        const updated = { ...b.itemsPerBox };
        delete updated[itemId];
        return { ...b, itemsPerBox: updated };
      })
    );
  };

  const handleScaleAll = (multiplier: number) => {
    setCart((prev) =>
      prev.map((c) => ({
        ...c,
        quantity: Math.max(1, Math.round(c.quantity * multiplier))
      }))
    );
  };

  // Handlers for Box Types
  const handleAddBoxType = () => {
    const newIndex = boxTypes.length + 1;
    const colors = ['#3B82F6', '#8B5CF6', '#059669', '#D97706', '#EC4899', '#6366F1'];
    const newBox: BoxType = {
      id: `box-${Date.now()}`,
      name: `Combo Box Pack ${newIndex}`,
      boxQuantity: 5,
      capacityItems: 4,
      boxColor: colors[(newIndex - 1) % colors.length],
      itemsPerBox: {}
    };
    setBoxTypes((prev) => [...prev, newBox]);
  };

  const handleUpdateBoxType = (boxId: string, updated: Partial<BoxType>) => {
    setBoxTypes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, ...updated } : b))
    );
  };

  const handleDuplicateBoxType = (boxId: string) => {
    const source = boxTypes.find((b) => b.id === boxId);
    if (!source) return;
    const newBox: BoxType = {
      ...source,
      id: `box-${Date.now()}`,
      name: `${source.name} (Copy)`,
      boxQuantity: source.boxQuantity,
      itemsPerBox: { ...source.itemsPerBox }
    };
    setBoxTypes((prev) => [...prev, newBox]);
  };

  const handleRemoveBoxType = (boxId: string) => {
    if (boxTypes.length <= 1) return;
    setBoxTypes((prev) => prev.filter((b) => b.id !== boxId));
  };

  // Handlers for Box Contents
  const handleUpdateBoxItems = (boxId: string, itemId: string, quantityPerBox: number) => {
    setBoxTypes((prev) =>
      prev.map((b) => {
        if (b.id !== boxId) return b;
        return {
          ...b,
          itemsPerBox: {
            ...b.itemsPerBox,
            [itemId]: quantityPerBox
          }
        };
      })
    );
  };

  const handleAutoFillBox = (boxId: string, quantityPerItem: number) => {
    setBoxTypes((prev) =>
      prev.map((b) => {
        if (b.id !== boxId) return b;
        const newItems: Record<string, number> = {};
        cart.forEach((c) => {
          newItems[c.itemId] = quantityPerItem;
        });
        return {
          ...b,
          itemsPerBox: newItems
        };
      })
    );
  };

  const handleCloneBoxContents = (sourceBoxId: string, targetBoxId: string) => {
    const source = boxTypes.find((b) => b.id === sourceBoxId);
    if (!source) return;
    setBoxTypes((prev) =>
      prev.map((b) => {
        if (b.id !== targetBoxId) return b;
        return {
          ...b,
          itemsPerBox: { ...source.itemsPerBox }
        };
      })
    );
  };

  const handleClearBoxContents = (boxId: string) => {
    setBoxTypes((prev) =>
      prev.map((b) => {
        if (b.id !== boxId) return b;
        return {
          ...b,
          itemsPerBox: {}
        };
      })
    );
  };

  // Allocation Fix Algorithms
  const handleFixAllocation = () => {
    // Attempt automatic reconciliation
    let updatedBoxes = [...boxTypes];

    allocations.forEach((alloc) => {
      if (alloc.remainingQuantity > 0) {
        // Find a box where remaining is evenly divisible by boxQuantity
        const fittingBox = updatedBoxes.find((b) => alloc.remainingQuantity % b.boxQuantity === 0);
        if (fittingBox) {
          const addPerBox = alloc.remainingQuantity / fittingBox.boxQuantity;
          updatedBoxes = updatedBoxes.map((b) => {
            if (b.id !== fittingBox.id) return b;
            return {
              ...b,
              itemsPerBox: {
                ...b.itemsPerBox,
                [alloc.itemId]: (b.itemsPerBox[alloc.itemId] || 0) + addPerBox
              }
            };
          });
        } else if (updatedBoxes.length > 0) {
          // If not cleanly divisible, sync cart to currently allocated quantity
          setCart((prev) =>
            prev.map((c) => (c.itemId === alloc.itemId ? { ...c, quantity: alloc.allocatedQuantity } : c))
          );
        }
      } else if (alloc.remainingQuantity < 0) {
        // Over-allocated: reduce from last box or sync cart
        setCart((prev) =>
          prev.map((c) => (c.itemId === alloc.itemId ? { ...c, quantity: alloc.allocatedQuantity } : c))
        );
      }
    });

    setBoxTypes(updatedBoxes);
  };

  const handleSyncCartToAllocated = () => {
    const syncedCart = syncCartToAllocated(boxTypes, cart);
    setCart(syncedCart);
  };

  // Load Benchmark Preset
  const handleLoadBenchmark = () => {
    const benchmark = PRESET_TEMPLATES[0];
    setCustomerInfo({ ...benchmark.customer });
    setCart([...benchmark.cart]);
    setBoxTypes(JSON.parse(JSON.stringify(benchmark.boxTypes)));
    setCurrentStep('validation');
  };

  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!found) return;
    setCustomerInfo({ ...found.customer });
    setCart([...found.cart]);
    setBoxTypes(JSON.parse(JSON.stringify(found.boxTypes)));
    setCurrentStep('box_setup');
  };

  const handleResetOrder = () => {
    setCustomerInfo(INITIAL_CUSTOMER_INFO);
    setCart([]);
    setBoxTypes([
      {
        id: 'box-1',
        name: 'Combo Box Pack 1',
        boxQuantity: 10,
        capacityItems: 4,
        boxColor: '#3B82F6',
        itemsPerBox: {}
      }
    ]);
    setConfirmedOrder(null);
    setCurrentStep('start');
  };

  // Submit Bulk Order
  const handleSubmitBulkOrder = () => {
    const orderId = `BO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newConfirmedOrder: ConfirmedBulkOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customerInfo,
      cartItems: cart,
      boxTypes,
      totalBoxes: orderTotals.totalBoxes,
      totalItems: orderTotals.totalCartUnits,
      totalCost: orderTotals.totalCost,
      totalWeightKg: orderTotals.totalWeightKg
    };
    setConfirmedOrder(newConfirmedOrder);
    setCurrentStep('confirmed');
  };

  // Render Layout Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'start':
        return (
          <BulkOrderStart
            customerInfo={customerInfo}
            onUpdateCustomerInfo={handleUpdateCustomerInfo}
            onStartOrder={() => setCurrentStep('select_items')}
            onLoadPreset={handleLoadPreset}
          />
        );

      case 'select_items':
        return (
          <ItemSelector
            catalog={catalog}
            cart={cart}
            customerInfo={customerInfo}
            onUpdateCartItem={handleUpdateCartItem}
            onRemoveCartItem={handleRemoveCartItem}
            onContinueToCart={() => setCurrentStep('cart')}
            onQuickLoadBenchmarkItems={() => {
              setCart([
                { itemId: 'tetra-pack', quantity: 15 },
                { itemId: 'cake', quantity: 15 },
                { itemId: 'samosa', quantity: 20 },
                { itemId: 'dairy-milk', quantity: 15 }
              ]);
            }}
          />
        );

      case 'cart':
        return (
          <CartReview
            cart={cart}
            catalog={catalog}
            onUpdateCartItem={handleUpdateCartItem}
            onRemoveCartItem={handleRemoveCartItem}
            onBackToSelectItems={() => setCurrentStep('select_items')}
            onContinueToBoxSetup={() => setCurrentStep('box_setup')}
            onScaleAll={handleScaleAll}
          />
        );

      case 'box_setup':
        return (
          <BoxSetup
            boxTypes={boxTypes}
            cart={cart}
            onAddBoxType={handleAddBoxType}
            onUpdateBoxType={handleUpdateBoxType}
            onDuplicateBoxType={handleDuplicateBoxType}
            onRemoveBoxType={handleRemoveBoxType}
            onConfigureContents={(boxId) => {
              setSelectedBoxIdForConfig(boxId);
              setCurrentStep('box_contents');
            }}
            onBackToCart={() => setCurrentStep('cart')}
            onContinueToContents={() => setCurrentStep('box_contents')}
          />
        );

      case 'box_contents':
        return (
          <BoxContentConfig
            boxTypes={boxTypes}
            cart={cart}
            catalog={catalog}
            allocations={allocations}
            selectedBoxId={selectedBoxIdForConfig}
            onUpdateBoxItems={handleUpdateBoxItems}
            onAutoFillBox={handleAutoFillBox}
            onCloneBoxContents={handleCloneBoxContents}
            onClearBoxContents={handleClearBoxContents}
            onBackToBoxTypes={() => setCurrentStep('box_setup')}
            onContinueToValidation={() => setCurrentStep('validation')}
          />
        );

      case 'validation':
        return (
          <AllocationValidator
            allocations={allocations}
            boxTypes={boxTypes}
            cart={cart}
            onFixAllocation={handleFixAllocation}
            onSyncCartToAllocated={handleSyncCartToAllocated}
            onGoToConfigureBox={(boxId) => {
              setSelectedBoxIdForConfig(boxId);
              setCurrentStep('box_contents');
            }}
            onBackToContents={() => setCurrentStep('box_contents')}
            onContinueToReview={() => setCurrentStep('review')}
          />
        );

      case 'review':
        return (
          <OrderReview
            customerInfo={customerInfo}
            cart={cart}
            boxTypes={boxTypes}
            catalog={catalog}
            allocations={allocations}
            isValidForSubmission={isFullyAllocated}
            onBackToEdit={() => setCurrentStep('validation')}
            onSubmitBulkOrder={handleSubmitBulkOrder}
          />
        );

      case 'confirmed':
        return confirmedOrder ? (
          <ConfirmationScreen
            order={confirmedOrder}
            catalog={catalog}
            onStartNewOrder={handleResetOrder}
            onViewBoxDetails={() => setCurrentStep('box_contents')}
          />
        ) : null;

      default:
        return null;
    }
  };

  // If in confirmation view, always render confirmation
  if (currentStep === 'confirmed' && confirmedOrder) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
        <Header
          currentStep={currentStep}
          onNavigateStep={setCurrentStep}
          layout={layout}
          onChangeLayout={setLayout}
          onLoadBenchmark={handleLoadBenchmark}
          onResetOrder={handleResetOrder}
          totalBoxes={orderTotals.totalBoxes}
          totalItems={orderTotals.totalCartUnits}
          isFullyAllocated={isFullyAllocated}
        />
        <ConfirmationScreen
          order={confirmedOrder}
          catalog={catalog}
          onStartNewOrder={handleResetOrder}
          onViewBoxDetails={() => setCurrentStep('box_contents')}
        />
      </div>
    );
  }

  // Layout Variations Switcher
  const renderLayoutBody = () => {
    switch (layout) {
      case 'left_nav':
        return (
          <LeftNavLayout
            currentStep={currentStep}
            onNavigateStep={setCurrentStep}
            isFullyAllocated={isFullyAllocated}
            totalItems={orderTotals.totalCartUnits}
            totalBoxes={orderTotals.totalBoxes}
          >
            {renderStepContent()}
          </LeftNavLayout>
        );

      case 'split_view':
      case 'two_column':
        return (
          <SplitWorkspaceLayout
            catalog={catalog}
            cart={cart}
            boxTypes={boxTypes}
            allocations={allocations}
            customerInfo={customerInfo}
            isValidForSubmission={isFullyAllocated}
            onUpdateCartItem={handleUpdateCartItem}
            onRemoveCartItem={handleRemoveCartItem}
            onUpdateBoxItems={handleUpdateBoxItems}
            onUpdateBoxType={handleUpdateBoxType}
            onAddBoxType={handleAddBoxType}
            onRemoveBoxType={handleRemoveBoxType}
            onFixAllocation={handleFixAllocation}
            onSyncCartToAllocated={handleSyncCartToAllocated}
            onSubmitOrder={handleSubmitBulkOrder}
          />
        );

      case 'table_first':
        return (
          <TableFirstLayout
            catalog={catalog}
            cart={cart}
            boxTypes={boxTypes}
            allocations={allocations}
            customerInfo={customerInfo}
            isValidForSubmission={isFullyAllocated}
            onUpdateCartItem={handleUpdateCartItem}
            onUpdateBoxItems={handleUpdateBoxItems}
            onUpdateBoxType={handleUpdateBoxType}
            onAddBoxType={handleAddBoxType}
            onRemoveBoxType={handleRemoveBoxType}
            onFixAllocation={handleFixAllocation}
            onSyncCartToAllocated={handleSyncCartToAllocated}
            onSubmitOrder={handleSubmitBulkOrder}
          />
        );

      case 'master_detail':
        return (
          <MasterDetailLayout
            catalog={catalog}
            cart={cart}
            boxTypes={boxTypes}
            allocations={allocations}
            customerInfo={customerInfo}
            isValidForSubmission={isFullyAllocated}
            onUpdateBoxItems={handleUpdateBoxItems}
            onUpdateBoxType={handleUpdateBoxType}
            onAddBoxType={handleAddBoxType}
            onDuplicateBoxType={handleDuplicateBoxType}
            onRemoveBoxType={handleRemoveBoxType}
            onAutoFillBox={handleAutoFillBox}
            onClearBoxContents={handleClearBoxContents}
            onSubmitOrder={handleSubmitBulkOrder}
          />
        );

      case 'card_builder':
        return (
          <CardBuilderLayout
            catalog={catalog}
            cart={cart}
            boxTypes={boxTypes}
            allocations={allocations}
            customerInfo={customerInfo}
            isValidForSubmission={isFullyAllocated}
            onUpdateBoxItems={handleUpdateBoxItems}
            onUpdateBoxType={handleUpdateBoxType}
            onAddBoxType={handleAddBoxType}
            onDuplicateBoxType={handleDuplicateBoxType}
            onRemoveBoxType={handleRemoveBoxType}
            onSubmitOrder={handleSubmitBulkOrder}
          />
        );

      case 'compact_dashboard':
        return (
          <CompactDashboardLayout
            catalog={catalog}
            cart={cart}
            boxTypes={boxTypes}
            allocations={allocations}
            customerInfo={customerInfo}
            isValidForSubmission={isFullyAllocated}
            onUpdateCartItem={handleUpdateCartItem}
            onUpdateBoxItems={handleUpdateBoxItems}
            onUpdateBoxType={handleUpdateBoxType}
            onAddBoxType={handleAddBoxType}
            onFixAllocation={handleFixAllocation}
            onSyncCartToAllocated={handleSyncCartToAllocated}
            onSubmitOrder={handleSubmitBulkOrder}
          />
        );

      case 'stepper':
      default:
        return renderStepContent();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        currentStep={currentStep}
        onNavigateStep={setCurrentStep}
        layout={layout}
        onChangeLayout={setLayout}
        onLoadBenchmark={handleLoadBenchmark}
        onResetOrder={handleResetOrder}
        totalBoxes={orderTotals.totalBoxes}
        totalItems={orderTotals.totalCartUnits}
        isFullyAllocated={isFullyAllocated}
      />
      {renderLayoutBody()}
    </div>
  );
}
