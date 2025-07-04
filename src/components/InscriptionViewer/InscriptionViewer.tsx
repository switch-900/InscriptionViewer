import React, { useCallback, useMemo } from 'react';
import { InscriptionRenderer } from './InscriptionRenderer';
import { InscriptionModal } from './InscriptionModal';
import { LazyInscriptionCard } from './LazyInscriptionCard';
import type { InscriptionData, InscriptionViewerProps } from '../../types';
import { normalizeInscriptions } from '../../types/inscription';

export const InscriptionViewer = React.memo(function InscriptionViewer({
  inscriptions,
  cardSize = 300,
  showHeaders = false,
  showControls = false,
  autoLoad = true,
  gridCols = 3,
  gap = 16,
  lazy = false,
  enableModal = false,
  apiEndpoint,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  className = ''
}: InscriptionViewerProps) {
  // Normalize the input to consistent format
  const normalizedInscriptions = useMemo(() => normalizeInscriptions(inscriptions), [inscriptions]);

  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
    height: 'auto'
  }), [gridCols, gap]);

  const renderInscription = useCallback((inscription: InscriptionData, index: number) => {
    const key = inscription.id || `inscription-${index}`;
    
    const baseProps = {
      inscriptionId: inscription.id,
      inscriptionNumber: inscription.number,
      contentUrl: inscription.contentUrl,
      contentType: inscription.contentType,
      size: cardSize,
      showHeader: showHeaders,
      showControls: showControls,
      autoLoad: autoLoad,
      apiEndpoint: apiEndpoint,
      htmlRenderMode: htmlRenderMode,
      forceIframe: forceIframe
    };

    if (enableModal) {
      return (
        <InscriptionModal
          key={key}
          {...baseProps}
          modalSize="lg"
          showTriggerButton={true}
        />
      );
    }

    if (lazy) {
      return (
        <LazyInscriptionCard
          key={key}
          {...baseProps}
          className="inscription-card"
        />
      );
    }

    return (
      <div key={key} className="inscription-card w-full h-full min-w-0 min-h-0 aspect-square">
        <InscriptionRenderer {...baseProps} className="w-full h-full" />
      </div>
    );
  }, [cardSize, showHeaders, showControls, autoLoad, enableModal, lazy]);

  if (normalizedInscriptions.length === 0) {
    return (
      <div className={`inscription-viewer-empty ${className}`}>
        <div className="text-center py-12 text-gray-500">
          <p>No inscriptions to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`inscription-viewer ${className}`}>
      <div style={gridStyles}>
        {normalizedInscriptions.map(renderInscription)}
      </div>
    </div>
  );
});

export default InscriptionViewer;
