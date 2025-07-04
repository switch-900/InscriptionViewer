import React, { useState, useRef, useEffect } from 'react';
import { InscriptionRenderer } from './InscriptionRenderer';

interface LazyInscriptionCardProps {
  inscriptionId: string;
  inscriptionNumber?: number | string;
  contentUrl?: string;
  contentType?: string;
  size?: number;
  showHeader?: boolean;
  showControls?: boolean;
  autoLoad?: boolean;
  apiEndpoint?: string;
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  threshold?: number; // Intersection observer threshold
}

export function LazyInscriptionCard({
  inscriptionId,
  inscriptionNumber,
  contentUrl,
  contentType,
  size = 300,
  showHeader = true,
  showControls = true,
  autoLoad = true,
  apiEndpoint,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  className = '',
  onLoad,
  onError,
  threshold = 0.1
}: LazyInscriptionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [threshold, hasLoaded]);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  return (
    <div 
      ref={cardRef} 
      className={`lazy-inscription-card w-full h-full aspect-square ${className}`}
      style={{ minHeight: '200px' }}
    >
      {isVisible ? (
        <InscriptionRenderer
          inscriptionId={inscriptionId}
          inscriptionNumber={inscriptionNumber}
          contentUrl={contentUrl}
          contentType={contentType}
          size={size}
          showHeader={showHeader}
          showControls={showControls}
          autoLoad={autoLoad}
          apiEndpoint={apiEndpoint}
          htmlRenderMode={htmlRenderMode}
          forceIframe={forceIframe}
          className="w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full aspect-square">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default LazyInscriptionCard;