import React, { useState } from 'react';
import { InscriptionRenderer } from '../InscriptionViewer/InscriptionRenderer';
import { Button } from '../ui/button';
import { Maximize2, Minimize2, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface ResponsiveTestProps {
  className?: string;
}

/**
 * Test component to demonstrate responsive behavior of InscriptionRenderer
 * in different container sizes and aspect ratios
 */
export const ResponsiveTest: React.FC<ResponsiveTestProps> = ({ className = '' }) => {
  const [containerStyle, setContainerStyle] = useState<'square' | 'wide' | 'tall' | 'small' | 'large'>('square');
  const [testInscriptionId] = useState('6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0');

  const containerStyles = {
    square: { width: '300px', height: '300px' },
    wide: { width: '500px', height: '200px' },
    tall: { width: '200px', height: '500px' },
    small: { width: '150px', height: '150px' },
    large: { width: '600px', height: '600px' }
  };

  const getStyleInfo = (style: string) => {
    const info = containerStyles[style as keyof typeof containerStyles];
    return `${info.width} × ${info.height}`;
  };

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Responsive Container Test</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test how content adapts to different container sizes while maintaining aspect ratio and centering
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={containerStyle === 'square' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContainerStyle('square')}
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          Square {getStyleInfo('square')}
        </Button>
        <Button
          variant={containerStyle === 'wide' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContainerStyle('wide')}
          className="flex items-center gap-2"
        >
          <RectangleHorizontal className="h-4 w-4" />
          Wide {getStyleInfo('wide')}
        </Button>
        <Button
          variant={containerStyle === 'tall' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContainerStyle('tall')}
          className="flex items-center gap-2"
        >
          <RectangleVertical className="h-4 w-4" />
          Tall {getStyleInfo('tall')}
        </Button>
        <Button
          variant={containerStyle === 'small' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContainerStyle('small')}
          className="flex items-center gap-2"
        >
          <Minimize2 className="h-4 w-4" />
          Small {getStyleInfo('small')}
        </Button>
        <Button
          variant={containerStyle === 'large' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setContainerStyle('large')}
          className="flex items-center gap-2"
        >
          <Maximize2 className="h-4 w-4" />
          Large {getStyleInfo('large')}
        </Button>
      </div>

      {/* Test container */}
      <div className="flex justify-center">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-lg">
          <div className="text-xs text-gray-500 mb-2 text-center">
            Container: {getStyleInfo(containerStyle)}
          </div>
          <div 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            style={containerStyles[containerStyle]}
          >
            <InscriptionRenderer
              inscriptionId={testInscriptionId}
              inscriptionNumber="Test"
              size={300} // This will be overridden by container
              showHeader={true}
              showControls={true}
              autoLoad={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
          What to Look For:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Centering:</strong> Content should be centered in the container</li>
          <li>• <strong>Aspect Ratio:</strong> Content maintains its original proportions</li>
          <li>• <strong>Fluid Fill:</strong> Content scales to fill available space optimally</li>
          <li>• <strong>No Overflow:</strong> Content stays within container bounds</li>
          <li>• <strong>Responsive UI:</strong> Controls and headers adapt to container size</li>
        </ul>
      </div>

      {/* Additional test containers */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Multiple Container Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(containerStyles).map(([style, dimensions]) => (
            <div key={style} className="flex flex-col items-center space-y-2">
              <div className="text-sm font-medium capitalize">
                {style} ({getStyleInfo(style)})
              </div>
              <div 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                style={dimensions}
              >
                <InscriptionRenderer
                  inscriptionId={testInscriptionId}
                  inscriptionNumber={style}
                  size={300}
                  showHeader={true}
                  showControls={false} // Simplified for smaller containers
                  autoLoad={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;
