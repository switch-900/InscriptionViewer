import { analyzeContent, shouldLazyLoad } from '../../src/components/InscriptionViewer/contentAnalyzer';

// Mock content analyzer tests
export function testAnalyzeContent() {
  console.log('Testing analyzeContent function...');
  
  // Test would analyze different content types
  const testUrls = [
    'https://ordinals.com/content/dca3da701a2607de6c89dd0bfe6106532dcefe279d13b105301a2d85eb4ffaafi0',
    'https://ordinals.com/content/0e50a465fc0ca415f3cb8a4aac1555b12a4bf3f33bc039f2a4d39f809e83af7ai0', 
    'https://ordinals.com/content/934905624f847731e7f173ba70bfa3a1389b0a7fe2a4ffce8793eef2730b9ab9i0'
  ];
  
  testUrls.forEach(async (url) => {
    try {
      const analysis = await analyzeContent(url);
      console.log(`Analysis for ${url}:`, analysis);
    } catch (error) {
      console.error(`Error analyzing ${url}:`, error);
    }
  });
}

export function testShouldLazyLoad() {
  console.log('Testing shouldLazyLoad function...');
  
  const testCases = [
    {
      contentInfo: {
        mimeType: 'image/jpeg',
        detectedType: 'image' as const,
        renderStrategy: 'native' as const,
        isInlineable: true
      },
      contentLength: 1024 * 1024 // 1MB
    },
    {
      contentInfo: {
        mimeType: 'text/plain',
        detectedType: 'text' as const,
        renderStrategy: 'native' as const,
        isInlineable: true
      },
      contentLength: 1024 // 1KB
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = shouldLazyLoad(testCase.contentInfo, testCase.contentLength);
    console.log(`Test case ${index + 1} - Should lazy load:`, result);
  });
}

// Run tests
testAnalyzeContent();
testShouldLazyLoad();

// Note: These are basic test examples. A proper testing framework
// would be needed for comprehensive testing with assertions.

export {};
