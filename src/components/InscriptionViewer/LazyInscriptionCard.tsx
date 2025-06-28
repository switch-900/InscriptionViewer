import React, { useState, useRef, useEffect } from 'react';
import { InscriptionRenderer } from './InscriptionRenderer';

interface LazyInscriptionCardProps {
  inscriptionId: string;
  contentUrl?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  threshold?: number; // Intersection observer threshold
}

export function LazyInscriptionCard({
  inscriptionId,
  contentUrl,
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
      className={`lazy-inscription-card ${className}`}
      style={{ minHeight: '200px' }}
    >
      {isVisible ? (
        <InscriptionRenderer
          inscriptionId={inscriptionId}
          contentUrl={contentUrl}
        />
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default LazyInscriptionCard;