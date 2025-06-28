import React, { useState } from 'react';
import { InscriptionViewer } from '../InscriptionViewer/InscriptionViewer';
import { InscriptionModal } from '../InscriptionViewer/InscriptionModal';
import { InscriptionRenderer } from '../InscriptionViewer/InscriptionRenderer';
import { Button } from '../ui/button';
import { InscriptionData } from '../../types';

export interface InscriptionGalleryProps {
  /** Array of inscription IDs to display */
  inscriptionIds: string[];
  /** Optional custom API endpoint (defaults to recursive endpoints) */
  apiEndpoint?: string;
  /** Grid columns (1-6, defaults to 3) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Card size in pixels (defaults to 200) */
  cardSize?: number;
  /** Show inscription number/index */
  showIndex?: boolean;
  /** Enable modal view on click */
  enableModal?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: (error: string) => React.ReactNode;
  /** Callback when inscription is clicked */
  onInscriptionClick?: (inscription: InscriptionData) => void;
  /** Custom CSS class */
  className?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
};

export const InscriptionGallery: React.FC<InscriptionGalleryProps> = ({
  inscriptionIds,
  apiEndpoint,
  columns = 3,
  cardSize = 200,
  showIndex = false,
  enableModal = false,
  loadingComponent,
  errorComponent,
  onInscriptionClick,
  className = ''
}) => {
  console.log('🎨 InscriptionGallery render:', {
    inscriptionCount: inscriptionIds?.length || 0,
    enableModal,
    columns,
    cardSize,
    showIndex
  });

  if (!inscriptionIds || inscriptionIds.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No inscriptions to display</p>
      </div>
    );
  }

  // Use the existing InscriptionViewer with modal functionality
  if (enableModal) {
    return (
      <div className={className}>
        <InscriptionViewer
          inscriptions={inscriptionIds}
          cardSize={cardSize}
          gridCols={columns}
          enableModal={true}
          showHeaders={showIndex}
          apiEndpoint={apiEndpoint}
          className="inscription-gallery"
        />
      </div>
    );
  }

  // Otherwise, render custom card layout
  return (
    <div className={`grid gap-4 ${columnClasses[columns]} ${className}`} style={{ width: '100%' }}>
      {inscriptionIds.map((inscriptionId, index) => (
        <div key={inscriptionId} className="flex justify-center">
          <InscriptionCard
            inscriptionId={inscriptionId}
            index={showIndex ? index + 1 : undefined}
            size={cardSize}
            apiEndpoint={apiEndpoint}
            onInscriptionClick={onInscriptionClick}
          />
        </div>
      ))}
    </div>
  );
};

interface InscriptionCardProps {
  inscriptionId: string;
  index?: number;
  size: number;
  apiEndpoint?: string;
  onInscriptionClick?: (inscription: InscriptionData) => void;
}

const InscriptionCard: React.FC<InscriptionCardProps> = ({
  inscriptionId,
  index,
  size,
  apiEndpoint,
  onInscriptionClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  return (
    <div 
      className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
      style={{ width: size, height: size }}
    >
      {/* Header with index */}
      {index && (
        <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          #{index}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <div className="text-xs text-red-600">Failed to load</div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="h-full flex flex-col relative">
        <div className="flex-1 relative p-2">
          <InscriptionRenderer
            inscriptionId={inscriptionId}
            size={size - 8} // Account for padding
            showControls={false}
            showHeader={false}
            autoLoad={true}
            apiEndpoint={apiEndpoint}
            className="w-full h-full"
            onAnalysisComplete={(analysis) => {
              console.log('Analysis complete for card:', inscriptionId, analysis);
              setIsLoading(false);
              if (analysis.error) {
                setHasError(true);
              }
            }}
          />
        </div>

        {/* Details Button - appears on hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <InscriptionModal
            inscriptionId={inscriptionId}
            trigger={
              <Button
                size="sm"
                variant="secondary"
                className="bg-black bg-opacity-75 text-white border-none hover:bg-opacity-90 text-xs px-2 py-1"
              >
                ℹ️ Details
              </Button>
            }
          />
        </div>

        {/* Inscription ID - small text at bottom */}
        <div className="absolute bottom-1 left-1 right-12 text-xs text-gray-400 truncate bg-white bg-opacity-75 px-1 rounded z-10">
          {inscriptionId.slice(0, 8)}...{inscriptionId.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default InscriptionGallery;
