import React, { useState, useCallback, useMemo } from 'react';
import { InscriptionViewer } from '../InscriptionViewer';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { Plus, Trash2, Search, Download, Copy, Info } from 'lucide-react';

interface EndpointOption {
  id: string;
  label: string;
  description: string;
  baseUrl: string;
  example: string;
  requiresId: boolean;
  multipleResults?: boolean;
}

const API_ENDPOINTS: EndpointOption[] = [
  {
    id: 'content',
    label: 'Content',
    description: 'Get inscription content directly',
    baseUrl: 'https://ordinals.com/content/',
    example: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    requiresId: true
  },
  {
    id: 'r_inscription',
    label: 'Inscription Info (Recursive)',
    description: 'Get inscription information via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/inscription/',
    example: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    requiresId: true
  },
  {
    id: 'inscription',
    label: 'Inscription Details (Node Required)',
    description: 'Get detailed inscription metadata (requires full node)',
    baseUrl: 'https://ordinals.com/inscription/',
    example: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    requiresId: true
  },
  {
    id: 'r_inscriptions',
    label: 'Latest Inscriptions (Recursive)',
    description: 'Get latest inscriptions via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/inscriptions',
    example: 'No ID required - fetches latest',
    requiresId: false,
    multipleResults: true
  },
  {
    id: 'inscriptions',
    label: 'Latest Inscriptions (Node Required)',
    description: 'Get list of latest inscriptions (requires full node)',
    baseUrl: 'https://ordinals.com/inscriptions',
    example: 'No ID required - fetches latest',
    requiresId: false,
    multipleResults: true
  },
  {
    id: 'r_children',
    label: 'Child Inscriptions (Recursive)',
    description: 'Get child inscription IDs via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/children/',
    example: 'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    requiresId: true,
    multipleResults: true
  },
  {
    id: 'r_children_inscriptions',
    label: 'Child Details (Recursive)',
    description: 'Get detailed child inscription info via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/children/',
    example: 'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0/inscriptions',
    requiresId: true,
    multipleResults: true
  },
  {
    id: 'r_parents',
    label: 'Parent Inscriptions (Recursive)',
    description: 'Get parent inscription IDs via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/parents/',
    example: 'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
    requiresId: true,
    multipleResults: true
  },
  {
    id: 'r_parents_inscriptions',
    label: 'Parent Details (Recursive)',
    description: 'Get detailed parent inscription info via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/parents/',
    example: 'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0/inscriptions',
    requiresId: true,
    multipleResults: true
  },
  {
    id: 'r_sat',
    label: 'Sat Inscriptions (Recursive)',
    description: 'Get inscription IDs on a sat via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/sat/',
    example: '153899938226999',
    requiresId: true,
    multipleResults: true
  },
  {
    id: 'r_metadata',
    label: 'Metadata (Recursive)',
    description: 'Get hex-encoded CBOR metadata via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/metadata/',
    example: 'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
    requiresId: true
  },
  {
    id: 'r_tx',
    label: 'Transaction (Recursive)',
    description: 'Get hex-encoded transaction via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/tx/',
    example: '60bcf821240064a9c55225c4f01711b0ebbcab39aa3fafeefe4299ab158536fa',
    requiresId: true
  },
  {
    id: 'r_utxo',
    label: 'UTXO Assets (Recursive)',
    description: 'Get assets in UTXO via recursive endpoint',
    baseUrl: 'https://ordinals.com/r/utxo/',
    example: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b:0',
    requiresId: true
  },
  {
    id: 'sat',
    label: 'Sat Info (Node Required)',
    description: 'Get satoshi information (requires full node)',
    baseUrl: 'https://ordinals.com/sat/',
    example: '1023795949035695',
    requiresId: true
  },
  {
    id: 'address',
    label: 'Address Assets (Node Required)',
    description: 'Get all assets of an address (requires full node)',
    baseUrl: 'https://ordinals.com/address/',
    example: 'bc1pdrm7tcyk4k6c3cdcjwkp49jmfrwmtvt0dvqyy7y4qp79tgks4lmqdpj6rw',
    requiresId: true
  },
  {
    id: 'output',
    label: 'Output Info (Node Required)',
    description: 'Get UTXO information (requires full node)',
    baseUrl: 'https://ordinals.com/output/',
    example: 'bc4c30829a9564c0d58e6287195622b53ced54a25711d1b86be7cd3a70ef61ed:0',
    requiresId: true
  }
];

interface InscriptionInput {
  id: string;
  value: string;
  endpoint: string;
}

export const InscriptionExplorer: React.FC = React.memo(() => {
  const [inputs, setInputs] = useState<InscriptionInput[]>([
    { 
      id: '1', 
      value: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', 
      endpoint: 'r_inscription' 
    }
  ]);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [cardSize, setCardSize] = useState(300);
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4 | 5 | 6>(3);
  const [autoLoad, setAutoLoad] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const addInput = useCallback(() => {
    const newId = (inputs.length + 1).toString();
    setInputs(prev => [...prev, { id: newId, value: '', endpoint: 'r_inscription' }]);
  }, [inputs.length]);

  const removeInput = useCallback((id: string) => {
    setInputs(prev => prev.filter(input => input.id !== id));
  }, []);

  const updateInput = useCallback((id: string, field: 'value' | 'endpoint', newValue: string) => {
    setInputs(prev => prev.map(input => 
      input.id === id ? { ...input, [field]: newValue } : input
    ));
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const generateInscriptions = useMemo(() => {
    const validInputs = inputs.filter(input => input.value.trim() !== '');
    
    if (validInputs.length === 0) {
      return [];
    }

    return validInputs.map(input => {
      const endpoint = API_ENDPOINTS.find(ep => ep.id === input.endpoint);
      
      if (!endpoint) {
        return {
          id: input.value,
          number: input.id,
          contentUrl: `https://ordinals.com/content/${input.value}`
        };
      }

      if (endpoint.requiresId) {
        let contentUrl = `${endpoint.baseUrl}${input.value}`;
        
        // Handle special recursive endpoints that need /inscriptions suffix
        if (endpoint.id === 'r_children_inscriptions') {
          contentUrl = `https://ordinals.com/r/children/${input.value}/inscriptions`;
        } else if (endpoint.id === 'r_parents_inscriptions') {
          contentUrl = `https://ordinals.com/r/parents/${input.value}/inscriptions`;
        }
        
        return {
          id: input.value,
          number: input.id,
          contentUrl
        };
      } else {
        // For endpoints that don't require ID, use a placeholder
        return {
          id: `${endpoint.id}-${input.id}`,
          number: input.id,
          contentUrl: endpoint.baseUrl
        };
      }
    });
  }, [inputs]);

  const exportConfiguration = useCallback(() => {
    const config = {
      inputs,
      settings: {
        displayMode,
        cardSize,
        gridCols,
        autoLoad,
        showHeaders,
        showControls
      },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscription-explorer-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [inputs, displayMode, cardSize, gridCols, autoLoad, showHeaders, showControls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 Bitcoin Inscription Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Explore Bitcoin inscriptions using various API endpoints
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Search className="mr-2" size={24} />
            Inscription Inputs
          </h2>

          {/* Input List */}
          <div className="space-y-4 mb-6">
            {inputs.map((input, index) => {
              const selectedEndpoint = API_ENDPOINTS.find(ep => ep.id === input.endpoint);
              
              return (
                <div key={input.id} className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inscription ID / Value #{index + 1}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input.value}
                        onChange={(e) => updateInput(input.id, 'value', e.target.value)}
                        placeholder={selectedEndpoint?.example || 'Enter inscription ID'}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <Button
                        onClick={() => copyToClipboard(input.value)}
                        variant="outline"
                        size="sm"
                        disabled={!input.value}
                        className={copiedText === input.value ? 'bg-green-100 text-green-700' : ''}
                      >
                        <Copy size={16} />
                        {copiedText === input.value && <span className="ml-1 text-xs">✓</span>}
                      </Button>
                    </div>
                  </div>

                  <div className="lg:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Endpoint
                    </label>
                    <select
                      value={input.endpoint}
                      onChange={(e) => updateInput(input.id, 'endpoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {API_ENDPOINTS.map((endpoint) => (
                        <option key={endpoint.id} value={endpoint.id}>
                          {endpoint.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => removeInput(input.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={inputs.length === 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={addInput} className="flex items-center">
              <Plus size={16} className="mr-2" />
              Add Inscription
            </Button>
            <Button onClick={exportConfiguration} variant="outline" className="flex items-center">
              <Download size={16} className="mr-2" />
              Export Config
            </Button>
          </div>

          {/* API Endpoint Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <Info size={16} className="mr-2" />
              Available API Endpoints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint.id} className="text-sm">
                  <div className="font-medium text-blue-800">{endpoint.label}</div>
                  <div className="text-blue-600">{endpoint.description}</div>
                  <div className="text-blue-500 text-xs mt-1">
                    {endpoint.baseUrl}
                    {endpoint.requiresId && '{id}'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Display Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setDisplayMode('grid')}
                  variant={displayMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                >
                  Grid
                </Button>
                <Button
                  onClick={() => setDisplayMode('list')}
                  variant={displayMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                >
                  List
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Size: {cardSize}px
              </label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={cardSize}
                onChange={(e) => setCardSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grid Columns: {gridCols}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={gridCols}
                onChange={(e) => setGridCols(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoLoad"
                checked={autoLoad}
                onChange={(e) => setAutoLoad(e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <label htmlFor="autoLoad" className="text-sm font-medium text-gray-700">
                Auto Load Content
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showHeaders"
                checked={showHeaders}
                onChange={(e) => setShowHeaders(e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <label htmlFor="showHeaders" className="text-sm font-medium text-gray-700">
                Show Headers
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showControls"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <label htmlFor="showControls" className="text-sm font-medium text-gray-700">
                Show Controls
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        {generateInscriptions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Inscription Results ({generateInscriptions.length})
            </h2>
            
            <InscriptionViewer
              inscriptions={generateInscriptions}
              cardSize={cardSize}
              gridCols={displayMode === 'list' ? 1 : gridCols}
              showHeaders={showHeaders}
              showControls={showControls}
              autoLoad={autoLoad}
              className="inscription-explorer-results"
            />
          </div>
        )}

        {generateInscriptions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Inscriptions to Display</h3>
            <p className="text-gray-500">Add some inscription IDs above to get started.</p>
          </div>
        )}
      </div>
      
      {/* Custom CSS for sliders */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `
      }} />
    </div>
  );
});

export default InscriptionExplorer;
