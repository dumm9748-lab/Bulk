import React from 'react';
import { 
  Cake, 
  Flame, 
  Cookie, 
  Croissant, 
  Sparkles, 
  Square, 
  Apple, 
  Box, 
  Coffee, 
  CupSoda 
} from 'lucide-react';
import { BakeryItem } from '../types/order';

interface ItemVisualProps {
  item: BakeryItem;
  size?: 'sm' | 'md' | 'lg';
}

export const ItemVisual: React.FC<ItemVisualProps> = ({ item, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  }[size];

  const getIcon = () => {
    switch (item.id) {
      case 'tetra-pack':
        return <CupSoda className={iconSizes} />;
      case 'cake':
        return <Cake className={iconSizes} />;
      case 'samosa':
        return <Flame className={iconSizes} />;
      case 'dairy-milk':
        return <Cookie className={iconSizes} />;
      case 'butter-croissant':
        return <Croissant className={iconSizes} />;
      case 'blueberry-muffin':
        return <Sparkles className={iconSizes} />;
      case 'fudge-brownie':
        return <Square className={iconSizes} />;
      case 'fruit-tart':
        return <Apple className={iconSizes} />;
      case 'paneer-puff':
        return <Box className={iconSizes} />;
      case 'cold-brew':
        return <Coffee className={iconSizes} />;
      default:
        return <Box className={iconSizes} />;
    }
  };

  return (
    <div 
      className={`${sizeClasses} rounded-lg flex items-center justify-center font-semibold shrink-0 transition-transform`}
      style={{
        backgroundColor: `${item.color}15`,
        color: item.color,
        border: `1px solid ${item.color}35`
      }}
    >
      {getIcon()}
    </div>
  );
};
