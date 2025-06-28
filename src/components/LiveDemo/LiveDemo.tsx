import React, { useState, useCallback, useMemo } from 'react';
import { InscriptionGallery } from '../InscriptionGallery';
import { Button } from '../ui/button';
import { Plus, X, Copy, Trash2, RefreshCw, Search, Eye, EyeOff, Bug } from 'lucide-react';
import { SAMPLE_INSCRIPTIONS } from '../../data/sampleInscriptions';
import { DebugInscriptionTest } from '../DebugInscriptionTest';

interface LiveDemoProps {
  className?: string;
}

export const LiveDemo: React.FC<LiveDemoProps> = ({ className = '' }) => {
  const [inputValue, setInputValue] = useState('');
  const [inscriptionIds, setInscriptionIds] = useState<string[]>([]);
  const [columns, setColumns] = useState<1 | 2 | 3 | 4 | 5 | 6>(3);
  const [cardSize, setCardSize] = useState(200);
  const [showIndex, setShowIndex] = useState(true);
  const [enableModal, setEnableModal] = useState(false); // Changed default to false for custom cards
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [endpointType, setEndpointType] = useState<'default' | 'custom' | 'recursive'>('default');
  const [showDebug, setShowDebug] = useState(false);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Add inscriptions from input
  const handleAddInscriptions = useCallback(() => {
    const newIds = inputValue
      .split(/[,\n\s]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0 && id.includes('i0')); // Basic validation for inscription IDs

    if (newIds.length > 0) {
      setInscriptionIds(prev => {
        const combined = [...prev, ...newIds];
        // Remove duplicates
        return Array.from(new Set(combined));
      });
      setInputValue('');
    }
  }, [inputValue]);

  // Handle Enter key in textarea
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAddInscriptions();
    }
  }, [handleAddInscriptions]);

  // Load sample inscriptions
  const handleLoadSample = useCallback(() => {
    const sampleIds = SAMPLE_INSCRIPTIONS.slice(0, 3).map(inscription => inscription.id); // Start with just 3 for testing
    setInscriptionIds(prev => {
      const combined = [...prev, ...sampleIds];
      return Array.from(new Set(combined));
    });
  }, []);

  // Clear all inscriptions
  const handleClearAll = useCallback(() => {
    setInscriptionIds([]);
  }, []);

  // Remove specific inscription
  const handleRemoveInscription = useCallback((idToRemove: string) => {
    setInscriptionIds(prev => prev.filter(id => id !== idToRemove));
  }, []);

  // Copy inscription ID to clipboard
  const handleCopyId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Copy all IDs
  const handleCopyAllIds = useCallback(async () => {
    if (inscriptionIds.length === 0) return;
    try {
      await navigator.clipboard.writeText(inscriptionIds.join('\n'));
      setCopiedText('all');
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [inscriptionIds]);

  // Get responsive column classes for mobile
  const responsiveColumns = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.min(columns, 2) as 1 | 2;
    }
    return columns;
  }, [columns]);

  return (
    <div className={`live-demo ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎮 Live Inscription Demo
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Add inscription IDs below and see them displayed in real time. Perfect for testing the viewer 
          with your own inscriptions or exploring different layouts and configurations.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Plus className="mr-2" size={20} />
          Add Inscription IDs
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inscription IDs (one per line or comma-separated)
            </label>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Paste inscription IDs here...&#10;6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0&#10;e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 text-sm font-mono resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              Tip: Press Ctrl+Enter (or Cmd+Enter) to add inscriptions quickly
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddInscriptions} disabled={!inputValue.trim()}>
                <Plus size={16} className="mr-1" />
                Add IDs
              </Button>
              <Button variant="outline" onClick={handleLoadSample}>
                <RefreshCw size={16} className="mr-1" />
                Load Sample
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                disabled={inscriptionIds.length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                Clear All
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCopyAllIds}
                disabled={inscriptionIds.length === 0}
                className={copiedText === 'all' ? 'bg-green-100 text-green-700' : ''}
              >
                <Copy size={16} className="mr-1" />
                Copy All IDs
                {copiedText === 'all' && <span className="ml-1">✓</span>}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                <div><strong>Total Inscriptions:</strong> {inscriptionIds.length}</div>
                <div><strong>Grid Layout:</strong> {responsiveColumns} columns</div>
                <div><strong>Card Size:</strong> {cardSize}px</div>
                <div><strong>Modal:</strong> {enableModal ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Search className="mr-2" size={20} />
          Display Configuration
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Columns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Columns: {columns}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>6</span>
            </div>
          </div>

          {/* Card Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Size: {cardSize}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              step="50"
              value={cardSize}
              onChange={(e) => setCardSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100px</span>
              <span>400px</span>
            </div>
          </div>

          {/* Show Index */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showIndex"
                checked={showIndex}
                onChange={(e) => setShowIndex(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="showIndex" className="text-sm font-medium text-gray-700">
                Show Index Numbers
              </label>
            </div>
          </div>

          {/* Enable Modal */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableModal"
                checked={enableModal}
                onChange={(e) => setEnableModal(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="enableModal" className="text-sm font-medium text-gray-700">
                Enable Modal View
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🌐 API Endpoint Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint Type
            </label>
            <select
              value={endpointType}
              onChange={(e) => setEndpointType(e.target.value as 'default' | 'custom' | 'recursive')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default (ordinals.com/content)</option>
              <option value="recursive">Recursive (ordinals.com/r/inscription)</option>
              <option value="custom">Custom Endpoint</option>
            </select>
          </div>
          
          {endpointType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom API Endpoint
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://your-api.com/content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                Your endpoint should accept inscription IDs and return the inscription content
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <strong>Current URL pattern:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
              {endpointType === 'custom' && apiEndpoint 
                ? `${apiEndpoint}/[INSCRIPTION_ID]`
                : endpointType === 'recursive'
                ? 'https://ordinals.com/r/inscription/[INSCRIPTION_ID]'
                : 'https://ordinals.com/content/[INSCRIPTION_ID]'
              }
            </code>
          </div>
        </div>
      </div>

      {/* Added IDs List */}
      {inscriptionIds.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Eye className="mr-2" size={20} />
              Added Inscriptions ({inscriptionIds.length})
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? 'Hide' : 'Show'} List
            </Button>
          </div>
          
          {showPreview && (
            <div className="max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {inscriptionIds.map((id, index) => (
                  <div key={id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                    <code className="flex-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded truncate">
                      {id}
                    </code>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyId(id)}
                        className={`h-8 w-8 p-0 ${copiedText === id ? 'bg-green-100 text-green-700' : ''}`}
                      >
                        <Copy size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInscription(id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Preview */}
      {inscriptionIds.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Eye className="mr-2" size={20} />
              Live Preview
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug size={16} className="mr-1" />
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </Button>
          </div>
          
          {showDebug && (
            <div className="mb-6">
              <DebugInscriptionTest />
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {enableModal ? 'Click on any inscription to view it in a modal' : 'Modal view is disabled'}
            <br />
            <span className="text-sm text-gray-500">
              Loaded {inscriptionIds.length} inscription(s) • Grid: {responsiveColumns} columns • Size: {cardSize}px
            </span>
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            {inscriptionIds.length > 0 ? (            <InscriptionGallery
              inscriptionIds={inscriptionIds}
              columns={responsiveColumns}
              cardSize={cardSize}
              showIndex={showIndex}
              enableModal={enableModal}
              apiEndpoint={
                endpointType === 'custom' ? apiEndpoint :
                endpointType === 'recursive' ? 'https://ordinals.com/r/inscription' :
                undefined
              }
              onInscriptionClick={(inscription) => {
                console.log('Clicked inscription:', inscription);
              }}
            />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No inscriptions to display
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Inscriptions Added Yet</h3>
          <p className="text-gray-500 mb-4">
            Add some inscription IDs above to see them displayed in real time
          </p>
          <Button onClick={handleLoadSample} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Load Sample Inscriptions
          </Button>
        </div>
      )}

      {/* Custom CSS for sliders */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
          }
        `
      }} />
    </div>
  );
};

export default LiveDemo;
