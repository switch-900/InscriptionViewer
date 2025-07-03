/**
 * Virtual Scrolling Hook for Large Inscription Lists
 * Provides performance optimization for rendering large numbers of inscriptions
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { InscriptionData } from '../types';

export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside viewport
  enabled?: boolean;
}

export interface VirtualScrollResult {
  visibleItems: InscriptionData[];
  totalHeight: number;
  scrollTop: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperStyle: React.CSSProperties;
  viewportStyle: React.CSSProperties;
}

export const useVirtualScroll = (
  items: InscriptionData[],
  config: VirtualScrollConfig
): VirtualScrollResult => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    enabled = true
  } = config;

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const { visibleItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    if (!enabled || items.length === 0) {
      return {
        visibleItems: items,
        totalHeight: items.length * itemHeight,
        startIndex: 0,
        endIndex: items.length - 1
      };
    }

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      totalHeight,
      startIndex,
      endIndex
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan, enabled]);

  const wrapperStyle: React.CSSProperties = {
    height: totalHeight,
    position: 'relative'
  };

  const viewportStyle: React.CSSProperties = {
    transform: `translateY(${startIndex * itemHeight}px)`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  };

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    onScroll,
    containerRef,
    wrapperStyle,
    viewportStyle
  };
};
