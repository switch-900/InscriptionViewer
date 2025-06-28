import React, { useState, useEffect } from 'react';
// import { useLaserEyes } from '@omnisat/lasereyes-react'; // This will be available when LaserEyes is installed
import { InscriptionGallery } from '../InscriptionGallery';

// LaserEyes hook mock for development (replace with actual import)
const useLaserEyes = () => ({
  getInscriptions: async (offset: number, limit: number) => {
    // Mock implementation - replace with actual LaserEyes hook
    return [];
  },
  address: 'bc1p...' // Mock address
});

// LaserEyes Inscription type (from their documentation)
interface LaserEyesInscription {
  id: string;
  inscriptionId: string;
  content: string;
  number: number;
  address: string;
  contentType: string;
  output: string;
  location: string;
  genesisTransaction: string;
  height: number;
  preview: string;
  outputValue: number;
  offset?: number;
}

interface LaserEyesInscriptionGalleryProps {
  /** Number of columns in the grid (1-6, defaults to 3) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Card size in pixels (defaults to 200) */
  cardSize?: number;
  /** Show inscription numbers */
  showIndex?: boolean;
  /** Enable modal view on click */
  enableModal?: boolean;
  /** Number of inscriptions per page (defaults to 20) */
  pageSize?: number;
  /** Custom CSS class */
  className?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Callback when inscription is clicked */
  onInscriptionClick?: (inscription: LaserEyesInscription) => void;
  /** Custom filter function */
  filterInscriptions?: (inscriptions: LaserEyesInscription[]) => LaserEyesInscription[];
}

export type { LaserEyesInscriptionGalleryProps };

export const LaserEyesInscriptionGallery: React.FC<LaserEyesInscriptionGalleryProps> = ({
  columns = 3,
  cardSize = 200,
  showIndex = true,
  enableModal = true,
  pageSize = 20,
  className = '',
  loadingComponent,
  errorComponent,
  onInscriptionClick,
  filterInscriptions
}) => {
  const { getInscriptions, address } = useLaserEyes();
  const [inscriptions, setInscriptions] = useState<LaserEyesInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchInscriptions = async (currentOffset = 0, reset = false) => {
    if (!address) {
      setError('No wallet connected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const results = await getInscriptions(currentOffset, pageSize);
      
      if (reset || currentOffset === 0) {
        setInscriptions(results);
      } else {
        setInscriptions(prev => [...prev, ...results]);
      }

      setHasMore(results.length === pageSize);
      setOffset(currentOffset + results.length);
    } catch (err) {
      console.error('Failed to fetch inscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchInscriptions(0, true);
    }
  }, [address]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchInscriptions(offset);
    }
  };

  const refresh = () => {
    setOffset(0);
    fetchInscriptions(0, true);
  };

  // Apply custom filter if provided
  const displayInscriptions = filterInscriptions ? filterInscriptions(inscriptions) : inscriptions;

  // Convert LaserEyes inscriptions to inscription IDs for the gallery
  const inscriptionIds = displayInscriptions.map(inscription => inscription.inscriptionId);

  const handleInscriptionClick = (galleryInscription: any) => {
    // Find the corresponding LaserEyes inscription
    const laserEyesInscription = displayInscriptions.find(
      inscription => inscription.inscriptionId === galleryInscription.id
    );
    
    if (laserEyesInscription && onInscriptionClick) {
      onInscriptionClick(laserEyesInscription);
    }
  };

  const defaultLoadingComponent = (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-lg text-gray-600">Loading your inscriptions...</p>
    </div>
  );

  const defaultErrorComponent = (
    <div className="text-center p-8 text-red-500 space-y-4">
      <p className="text-lg">⚠️ Error loading inscriptions</p>
      <p className="text-sm">{error}</p>
      <button 
        onClick={refresh}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );

  if (!address) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Please connect your wallet to view inscriptions</p>
      </div>
    );
  }

  if (loading && inscriptions.length === 0) {
    return loadingComponent || defaultLoadingComponent;
  }

  if (error && inscriptions.length === 0) {
    return errorComponent || defaultErrorComponent;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Inscriptions
          </h2>
          <p className="text-gray-600">
            {displayInscriptions.length} inscription{displayInscriptions.length !== 1 ? 's' : ''}
            {filterInscriptions && inscriptions.length !== displayInscriptions.length && 
              ` (${inscriptions.length} total)`
            }
          </p>
        </div>
        <button 
          onClick={refresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Gallery */}
      {inscriptionIds.length > 0 ? (
        <>
          <InscriptionGallery
            inscriptionIds={inscriptionIds}
            columns={columns}
            cardSize={cardSize}
            showIndex={showIndex}
            enableModal={enableModal}
            onInscriptionClick={handleInscriptionClick}
            className="inscription-gallery"
          />

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-12 text-gray-500">
          <p className="text-lg">No inscriptions found</p>
          <p className="text-sm">This wallet doesn't have any inscriptions yet.</p>
        </div>
      )}
    </div>
  );
};

export default LaserEyesInscriptionGallery;
