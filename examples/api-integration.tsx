/**
 * Comprehensive API Integration Example
 * Demonstrates using both user's node and ordinals.com endpoints
 */

import React, { useState, useEffect } from 'react';
import { ApiExplorer, InscriptionViewer } from '../src/components/InscriptionViewer';
import { useInscriptions, useBlock } from '../src/hooks';
import { ordinalsApi } from '../src/services';

const ApiIntegrationExample: React.FC = () => {
  const [userNodeUrl, setUserNodeUrl] = useState('http://localhost:80');
  const [ordinalsUrl, setOrdinalsUrl] = useState('https://ordinals.com');
  const [connectionStatus, setConnectionStatus] = useState<{
    userNode: 'checking' | 'connected' | 'failed';
    ordinals: 'checking' | 'connected' | 'failed';
  }>({
    userNode: 'checking',
    ordinals: 'checking'
  });

  // Test connections
  useEffect(() => {
    const testConnections = async () => {
      // Test user node
      try {
        ordinalsApi.updateEndpoints(userNodeUrl, ordinalsUrl);
        const statusResponse = await ordinalsApi.getStatus();
        setConnectionStatus(prev => ({
          ...prev,
          userNode: statusResponse.success ? 'connected' : 'failed'
        }));
      } catch {
        setConnectionStatus(prev => ({ ...prev, userNode: 'failed' }));
      }

      // Test ordinals.com (recursive endpoint)
      try {
        const heightResponse = await ordinalsApi.getLatestBlockHeight();
        setConnectionStatus(prev => ({
          ...prev,
          ordinals: heightResponse.success ? 'connected' : 'failed'
        }));
      } catch {
        setConnectionStatus(prev => ({ ...prev, ordinals: 'failed' }));
      }
    };

    testConnections();
  }, [userNodeUrl, ordinalsUrl]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '✓ Connected';
      case 'failed': return '✗ Failed';
      case 'checking': return '⏳ Checking...';
      default: return '? Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Ordinals API Integration Example
        </h1>

        {/* Connection Configuration */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                User Bitcoin Node URL
              </label>
              <input
                type="text"
                value={userNodeUrl}
                onChange={(e) => setUserNodeUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="http://localhost:80"
              />
              <p className={`text-sm mt-1 ${getStatusColor(connectionStatus.userNode)}`}>
                {getStatusText(connectionStatus.userNode)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Used for: /address, /block, /inscription, /inscriptions, /status, etc.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Ordinals.com URL (Fallback)
              </label>
              <input
                type="text"
                value={ordinalsUrl}
                onChange={(e) => setOrdinalsUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://ordinals.com"
              />
              <p className={`text-sm mt-1 ${getStatusColor(connectionStatus.ordinals)}`}>
                {getStatusText(connectionStatus.ordinals)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Used for: /r/children, /r/parents, /r/metadata, /content, etc.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">How It Works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Primary:</strong> API calls first try your Bitcoin node</li>
              <li>• <strong>Fallback:</strong> Recursive endpoints automatically fall back to ordinals.com if your node fails</li>
              <li>• <strong>Caching:</strong> Responses are cached for 5 minutes to improve performance</li>
              <li>• <strong>Flexible:</strong> Supports all API response formats (IDs array, children objects, etc.)</li>
            </ul>
          </div>
        </div>

        {/* API Explorer */}
        <ApiExplorer 
          userNodeUrl={userNodeUrl}
          ordinalsUrl={ordinalsUrl}
          className="mb-8"
        />

        {/* Quick Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickExample
            title="Latest Inscriptions"
            description="Shows the latest inscriptions from your node or ordinals.com"
            userNodeUrl={userNodeUrl}
            ordinalsUrl={ordinalsUrl}
          />
          
          <BlockExample
            title="Block Explorer"
            description="Explore inscriptions in specific blocks"
            userNodeUrl={userNodeUrl}
            ordinalsUrl={ordinalsUrl}
          />
        </div>
      </div>
    </div>
  );
};

// Quick example component for latest inscriptions
function QuickExample({ 
  title, 
  description, 
  userNodeUrl, 
  ordinalsUrl 
}: { 
  title: string; 
  description: string; 
  userNodeUrl: string; 
  ordinalsUrl: string; 
}) {
  const { inscriptions, loading, error, source, fetchInscriptions } = useInscriptions({
    userNodeUrl,
    ordinalsUrl
  });

  const handleFetch = () => {
    fetchInscriptions(0);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Latest'}
        </button>
        {source && (
          <span className="px-3 py-2 bg-gray-100 text-sm rounded">
            Source: {source}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {inscriptions.length > 0 && (
        <InscriptionViewer
          inscriptions={inscriptions.slice(0, 6)} // Show first 6
          gridCols={3}
          cardSize={150}
          showHeaders={true}
          showControls={false}
        />
      )}
    </div>
  );
}

// Block example component
function BlockExample({ 
  title, 
  description, 
  userNodeUrl, 
  ordinalsUrl 
}: { 
  title: string; 
  description: string; 
  userNodeUrl: string; 
  ordinalsUrl: string; 
}) {
  const [blockHeight, setBlockHeight] = useState('');
  const { block, inscriptions, loading, error, source, fetchBlock } = useBlock();

  const handleFetch = () => {
    if (blockHeight.trim()) {
      fetchBlock(parseInt(blockHeight.trim()));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={blockHeight}
          onChange={(e) => setBlockHeight(e.target.value)}
          placeholder="Enter block height (e.g., 767430)"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !blockHeight.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Block'}
        </button>
      </div>

      {source && (
        <span className="inline-block px-3 py-1 bg-gray-100 text-sm rounded mb-4">
          Source: {source}
        </span>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {block && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
          <p><strong>Block {block.height}:</strong> {inscriptions.length} inscriptions</p>
          <p className="text-gray-600 text-xs mt-1">Hash: {block.hash}</p>
        </div>
      )}

      {inscriptions.length > 0 && (
        <InscriptionViewer
          inscriptions={inscriptions.slice(0, 6)} // Show first 6
          gridCols={3}
          cardSize={120}
          showHeaders={true}
          showControls={false}
        />
      )}
    </div>
  );
}

export default ApiIntegrationExample;
