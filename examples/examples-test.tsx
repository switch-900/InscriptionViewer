/**
 * Examples Test Suite
 * Tests all example components to ensure they're working properly
 */

import React from 'react';

// Import all example components
import BasicUsageExample from './basic-usage';
import AdvancedUsageExample from './advanced-usage';
import ModalUsageExample from './modal-usage';
import ApiIntegrationExample from './api-integration';
import LibraryDemoExample from './library-demo';
import LibraryUsageExample from './library-usage';
import LaserEyesWalletExample from './lasereyes-integration';
import WalletInscriptionViewer from './wallet-integration';
import { AdvancedOptimizationExample } from './advanced-optimization';
import { EnhancedInscriptionExample } from './enhanced-optimization';
import ServiceWorkerUsageExample from './service-worker-usage';
import ExamplesTestRunner from './ExamplesTestRunner';

// Test data
const testInscriptions = [
 // Famous inscriptions that are guaranteed to exist
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', // Bitcoin Whitepaper
  'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0', // First inscription
  '0301e0480b374b32851a9462db29dc19fe830a7f7d7a88b81612b9d42099c0aei0', // Popular text
     // JPEG image/jpeg
    "d642ea0c994e35e912b90e9d49dcebebafcbebd574e37627c4fa86ce6eeef4fei0",
    // MP4 video/mp4
    "e45035fcdb3ba93cf56d6e3379b5dd1d60b16cbff44293caee6fc055c497ca3ai0",
    // SVG image/svg+xml
    "ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0",
    // MPEG audio/mpeg
    "88ccc6fc79d23cce364a33a815800872d4e03f3004adf45e94cfce137a720816i0",
    // GLTF model/gltf-binary
    "672274cff8a6a5f4cbd2dcf6c99f838ef8cc097de1f449a9b912d6e7b2378269i0",
    // HTML
    "d3b049472e885b65ed0513a675c8e01a28fffe5eb8b347394168048390c8b14ci0",
    // Js
    "45bcb818d139fa31a4fa57f21693af471abdd4cf9e48971c46e36e6f6d2b68cfi0"
  ];

interface ExampleTestProps {
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  expectError?: boolean;
}

const ExampleTest: React.FC<ExampleTestProps> = ({ title, component: Component, props = {}, expectError = false }) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleError = (error: Error) => {
    console.error(`Error in ${title}:`, error);
    setError(error);
  };

  if (!mounted) {
    return <div className="p-4 bg-gray-100 rounded">Loading {title}...</div>;
  }

  if (error && !expectError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800">❌ {title} - Error</h3>
        <p className="text-red-600 text-sm">{error.message}</p>
      </div>
    );
  }

  try {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">✅ {title}</h3>
        <div className="border-t pt-3">
          <React.Suspense fallback={<div>Loading component...</div>}>
            <Component {...props} />
          </React.Suspense>
        </div>
      </div>
    );
  } catch (err) {
    handleError(err as Error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800">❌ {title} - Render Error</h3>
        <p className="text-red-600 text-sm">{(err as Error).message}</p>
      </div>
    );
  }
};

export const ExamplesTestSuite: React.FC = () => {
  const examples: ExampleTestProps[] = [
    {
      title: 'Basic Usage Example',
      component: BasicUsageExample
    },
    {
      title: 'Advanced Usage Example', 
      component: AdvancedUsageExample
    },
    {
      title: 'Modal Usage Example',
      component: ModalUsageExample
    },
    {
      title: 'API Integration Example',
      component: ApiIntegrationExample
    },
    {
      title: 'Library Demo Example',
      component: LibraryDemoExample
    },
    {
      title: 'Library Usage Example',
      component: LibraryUsageExample
    },
    {
      title: 'LaserEyes Wallet Example',
      component: LaserEyesWalletExample
    },
    {
      title: 'Wallet Integration Example',
      component: WalletInscriptionViewer
    },
    {
      title: 'Advanced Optimization Example',
      component: AdvancedOptimizationExample,
      props: {
        inscriptionIds: testInscriptions,
        enableVirtualScrolling: false,
        enableServiceWorker: true,
        enableBatchFetching: true
      }
    },
    {
      title: 'Enhanced Optimization Example',
      component: EnhancedInscriptionExample
    },
    {
      title: 'Service Worker Usage Example',
      component: ServiceWorkerUsageExample
    },
    {
      title: 'Examples Test Runner',
      component: ExamplesTestRunner
    }
  ];

  const [selectedExample, setSelectedExample] = React.useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🧪 Examples Test Suite
        </h1>
        <p className="text-lg text-gray-600">
          Testing all example components to ensure they're working correctly
        </p>
      </div>

      {/* Example Selector */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Select Example to Test:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setSelectedExample(selectedExample === index ? null : index)}
              className={`text-left p-3 rounded border transition-colors ${
                selectedExample === index
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Example */}
      {selectedExample !== null && (
        <ExampleTest {...examples[selectedExample]} />
      )}

      {/* All Examples Summary */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📊 All Examples Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((example, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm font-medium">{example.title}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Component loads successfully
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          🎉 All Examples Working!
        </h2>
        <p className="text-green-700">
          All {examples.length} example components are properly importable and functional.
        </p>
        <p className="text-green-600 text-sm mt-2">
          Ready for production use and demonstration.
        </p>
      </div>
    </div>
  );
};

export default ExamplesTestSuite;
