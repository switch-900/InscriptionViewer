/**
 * API Explorer Component
 * Demonstrates all available API endpoints with live data
 */

import React, { useState } from 'react';
import { InscriptionViewer } from './InscriptionViewer';
import { useInscriptions, useInscription, useBlock } from '../../hooks';

export interface ApiExplorerProps {
  userNodeUrl?: string;
  ordinalsUrl?: string;
  className?: string;
}

export function ApiExplorer({ 
  userNodeUrl = 'http://localhost:80', 
  ordinalsUrl = 'https://ordinals.com',
  className = '' 
}: ApiExplorerProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'search' | 'address' | 'block' | 'children' | 'parents'>('latest');
  const [searchIds, setSearchIds] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [blockInput, setBlockInput] = useState('');
  const [inscriptionIdInput, setInscriptionIdInput] = useState('');

  const {
    inscriptions,
    loading,
    error,
    hasMore,
    currentPage,
    source,
    fetchInscriptions,
    fetchInscriptionsByIds,
    fetchInscriptionsByAddress,
    fetchInscriptionChildren,
    fetchInscriptionParents,
    clearInscriptions
  } = useInscriptions({ userNodeUrl, ordinalsUrl });

  const {
    inscription,
    loading: inscriptionLoading,
    error: inscriptionError,
    source: inscriptionSource,
    fetchInscription,
    content,
    metadata
  } = useInscription();

  const {
    block,
    inscriptions: blockInscriptions,
    loading: blockLoading,
    error: blockError,
    source: blockSource,
    fetchBlock,
    fetchBlockInscriptions
  } = useBlock();

  const handleFetchLatest = () => {
    setActiveTab('latest');
    fetchInscriptions(0);
  };

  const handleSearchByIds = () => {
    if (!searchIds.trim()) return;
    setActiveTab('search');
    const ids = searchIds.split(',').map(id => id.trim()).filter(id => id);
    fetchInscriptionsByIds(ids);
  };

  const handleSearchByAddress = () => {
    if (!addressInput.trim()) return;
    setActiveTab('address');
    fetchInscriptionsByAddress(addressInput.trim());
  };

  const handleFetchBlock = () => {
    if (!blockInput.trim()) return;
    setActiveTab('block');
    const input = blockInput.trim();
    const blockId = isNaN(Number(input)) ? input : Number(input);
    fetchBlock(blockId);
  };

  const handleFetchChildren = () => {
    if (!inscriptionIdInput.trim()) return;
    setActiveTab('children');
    fetchInscriptionChildren(inscriptionIdInput.trim());
  };

  const handleFetchParents = () => {
    if (!inscriptionIdInput.trim()) return;
    setActiveTab('parents');
    fetchInscriptionParents(inscriptionIdInput.trim());
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      if (activeTab === 'latest') {
        fetchInscriptions(currentPage + 1);
      } else if (activeTab === 'children') {
        fetchInscriptionChildren(inscriptionIdInput.trim(), currentPage + 1);
      } else if (activeTab === 'parents') {
        fetchInscriptionParents(inscriptionIdInput.trim(), currentPage + 1);
      }
    }
  };

  const tabs = [
    { id: 'latest', label: 'Latest Inscriptions', endpoint: 'GET /inscriptions' },
    { id: 'search', label: 'Search by IDs', endpoint: 'POST /inscriptions' },
    { id: 'address', label: 'Address Assets', endpoint: 'GET /address/<ADDRESS>' },
    { id: 'block', label: 'Block Data', endpoint: 'GET /block/<BLOCK>' },
    { id: 'children', label: 'Children', endpoint: 'GET /r/children/<ID>/inscriptions' },
    { id: 'parents', label: 'Parents', endpoint: 'GET /r/parents/<ID>/inscriptions' }
  ];

  return (
    <div className={`api-explorer ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Ordinals API Explorer</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            <strong>User Node:</strong> {userNodeUrl} | <strong>Ordinals.com:</strong> {ordinalsUrl}
          </p>
          {source && (
            <p className="text-sm text-green-600 mt-2">
              <strong>Data Source:</strong> {source}
            </p>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm font-medium">{tab.label}</div>
            <div className="text-xs opacity-75">{tab.endpoint}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        {activeTab === 'latest' && (
          <div className="flex gap-2 items-center">
            <button
              onClick={handleFetchLatest}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Latest Inscriptions'}
            </button>
            <button
              onClick={clearInscriptions}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchIds}
              onChange={(e) => setSearchIds(e.target.value)}
              placeholder="Enter inscription IDs (comma separated)"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleSearchByIds}
              disabled={loading || !searchIds.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter Bitcoin address"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleSearchByAddress}
              disabled={loading || !addressInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Address Assets'}
            </button>
          </div>
        )}

        {activeTab === 'block' && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={blockInput}
              onChange={(e) => setBlockInput(e.target.value)}
              placeholder="Enter block height or hash"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleFetchBlock}
              disabled={blockLoading || !blockInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {blockLoading ? 'Loading...' : 'Get Block Data'}
            </button>
          </div>
        )}

        {(activeTab === 'children' || activeTab === 'parents') && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inscriptionIdInput}
              onChange={(e) => setInscriptionIdInput(e.target.value)}
              placeholder="Enter inscription ID"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={activeTab === 'children' ? handleFetchChildren : handleFetchParents}
              disabled={loading || !inscriptionIdInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : `Get ${activeTab === 'children' ? 'Children' : 'Parents'}`}
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {blockError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Block Error:</strong> {blockError}
        </div>
      )}

      {/* Block Data Display */}
      {activeTab === 'block' && block && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Block Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Hash:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{block.hash}</code></div>
            <div><strong>Height:</strong> {block.height}</div>
            <div><strong>Inscriptions:</strong> {block.inscriptions?.length || 0}</div>
            <div><strong>Transactions:</strong> {block.transactions?.length || 0}</div>
          </div>
          
          {blockInscriptions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Inscriptions in Block:</h4>
              <InscriptionViewer
                inscriptions={blockInscriptions}
                gridCols={4}
                cardSize={150}
                showHeaders={true}
                showControls={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Results */}
      {inscriptions.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Results ({inscriptions.length} inscriptions)
            </h3>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
          
          <InscriptionViewer
            inscriptions={inscriptions}
            gridCols={3}
            cardSize={250}
            showHeaders={true}
            showControls={true}
            autoLoad={true}
            enableModal={true}
          />
        </div>
      )}

      {/* Single Inscription Detail */}
      {inscription && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Inscription Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{inscription.id}</code></div>
            <div><strong>Number:</strong> {inscription.number || 'N/A'}</div>
            <div><strong>Content Type:</strong> {inscription.contentType || 'N/A'}</div>
            <div><strong>Content URL:</strong> {inscription.contentUrl || 'N/A'}</div>
          </div>
          
          {metadata && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Metadata:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {metadata}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && inscriptions.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading inscriptions...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && inscriptions.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p>No inscriptions found. Try fetching some data using the controls above.</p>
        </div>
      )}
    </div>
  );
}

export default ApiExplorer;
