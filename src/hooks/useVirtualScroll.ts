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
  prefetchDistance?: number; // How far ahead to prefetch content
  enabled?: boolean;
  onPrefetch?: (items: InscriptionData[], startIndex: number, endIndex: number) => void;
}

export interface VirtualScrollResult {
  visibleItems: InscriptionData[];
  totalHeight: number;
  scrollTop: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperStyle: React.CSSProperties;
  viewportStyle: React.CSSProperties;
  currentRange: { startIndex: number; endIndex: number };
  prefetchRange: { startIndex: number; endIndex: number };
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
    prefetchDistance = 10,
    enabled = true,
    onPrefetch
  } = config;

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const { visibleItems, totalHeight, startIndex, endIndex, prefetchStartIndex, prefetchEndIndex } = useMemo(() => {
    if (!enabled || items.length === 0) {
      return {
        visibleItems: items,
        totalHeight: items.length * itemHeight,
        startIndex: 0,
        endIndex: items.length - 1,
        prefetchStartIndex: 0,
        prefetchEndIndex: items.length - 1
      };
    }

    const totalHeight = items.length * itemHeight;
    const viewportStartIndex = Math.floor(scrollTop / itemHeight);
    const viewportEndIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
    
    // Calculate visible range with overscan for smoother scrolling
    const startIndex = Math.max(0, viewportStartIndex - overscan);
    const endIndex = Math.min(items.length - 1, viewportEndIndex + overscan);
    
    // Calculate prefetch range for even smoother experience
    const prefetchStartIndex = Math.max(0, viewportStartIndex - prefetchDistance);
    const prefetchEndIndex = Math.min(items.length - 1, viewportEndIndex + prefetchDistance);

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      totalHeight,
      startIndex,
      endIndex,
      prefetchStartIndex,
      prefetchEndIndex
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan, prefetchDistance, enabled]);

  // Trigger prefetch callback when prefetch range changes
  useEffect(() => {
    if (onPrefetch && enabled && items.length > 0) {
      const prefetchItems = items.slice(prefetchStartIndex, prefetchEndIndex + 1);
      onPrefetch(prefetchItems, prefetchStartIndex, prefetchEndIndex);
    }
  }, [items, prefetchStartIndex, prefetchEndIndex, onPrefetch, enabled]);

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

  const currentRange = { startIndex, endIndex };
  const prefetchRange = { startIndex: prefetchStartIndex, endIndex: prefetchEndIndex };

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    onScroll,
    containerRef,
    wrapperStyle,
    viewportStyle,
    currentRange,
    prefetchRange
  };
};
