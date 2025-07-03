import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Maximize2, X } from 'lucide-react';
import { InscriptionRenderer } from './InscriptionRenderer';
import { ContentAnalysis } from './contentAnalyzer';

/**
 * Modal for displaying inscription content with smart rendering
 */

interface InscriptionModalProps {
  inscriptionId: string;
  inscriptionNumber?: number | string;
  contentUrl?: string;
  contentType?: string;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showTriggerButton?: boolean;
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
}

const modalSizes = {
  sm: { size: 600, className: 'max-w-lg' },
  md: { size: 800, className: 'max-w-3xl' },
  lg: { size: 1000, className: 'max-w-5xl' },
  xl: { size: 1200, className: 'max-w-7xl' },
  full: { size: 1400, className: 'max-w-[95vw] max-h-[95vh]' }
};

export function InscriptionModal({
  inscriptionId,
  inscriptionNumber,
  contentUrl,
  contentType,
  trigger,
  triggerClassName = '',
  modalSize = 'lg',
  showTriggerButton = true,
  htmlRenderMode = 'sandbox',
  forceIframe = false
}: InscriptionModalProps) {
  const [open, setOpen] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<ContentAnalysis | null>(null);
  const { size, className } = modalSizes[modalSize];

  const handleAnalysisComplete = (contentAnalysis: ContentAnalysis) => {
    setAnalysis(contentAnalysis);
  };

  const defaultTrigger = showTriggerButton ? (
    <Button
      variant="outline"
      size="sm"
      className={triggerClassName}
    >
      <Eye className="h-4 w-4 mr-2" />
      View Content
    </Button>
  ) : null;

  const triggerElement = trigger || defaultTrigger;

  if (!triggerElement) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent 
        className={`${className} p-0 gap-0`}
        hideCloseButton={false}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">
                Inscription #{inscriptionNumber || 'N/A'}
              </span>
              {analysis && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {analysis.contentInfo.detectedType}
                  </span>
                  <span className="text-xs font-mono">
                    {analysis.contentInfo.mimeType}
                  </span>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-6">
          <div className="w-full h-full flex justify-center">
            <InscriptionRenderer
              inscriptionId={inscriptionId}
              inscriptionNumber={inscriptionNumber}
              contentUrl={contentUrl}
              contentType={contentType}
              size={size}
              showHeader={false} // Header already shown in modal
              showControls={true}
              autoLoad={true}
              htmlRenderMode={htmlRenderMode}
              forceIframe={forceIframe}
              onAnalysisComplete={handleAnalysisComplete}
              className="w-full max-w-full"
            />
          </div>
          
          {/* Analysis details */}
          {analysis && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Content Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="ml-2 font-mono">{analysis.contentInfo.detectedType}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">MIME:</span>
                  <span className="ml-2 font-mono">{analysis.contentInfo.mimeType}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Strategy:</span>
                  <span className="ml-2 font-mono">{analysis.contentInfo.renderStrategy}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Extension:</span>
                  <span className="ml-2 font-mono">{analysis.contentInfo.fileExtension || 'unknown'}</span>
                </div>
                {analysis.contentInfo.encoding && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Encoding:</span>
                    <span className="ml-2 font-mono">{analysis.contentInfo.encoding}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Inline:</span>
                  <span className="ml-2">{analysis.contentInfo.isInlineable ? '✅' : '❌'}</span>
                </div>
              </div>
              {analysis.preview && (
                <div className="mt-3">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Preview:</span>
                  <pre className="mt-1 p-2 bg-white dark:bg-gray-900 rounded text-xs font-mono overflow-hidden">
                    {analysis.preview}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InscriptionModal;