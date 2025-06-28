# Flexible Input Formats

The Bitcoin Inscription Viewer supports multiple input formats to make it easy to integrate with different Ordinals API endpoints and data sources.

## Supported Input Formats

### 1. Simple Array of IDs

Perfect for when you just have inscription IDs as strings:

```tsx
import { InscriptionViewer } from './src';

const inscriptionIds = [
  "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
  "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0",
  "0301e0480b374b32dcb6dd121b77be4b72a96721588a9ba40f148ba2b9aa72b1i0"
];

<InscriptionViewer inscriptions={inscriptionIds} />
```

### 2. API Response with IDs Array

Handles responses from endpoints like `/inscriptions`:

```tsx
// API Response format: { ids: [...] }
const apiResponse = {
  ids: [
    "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
    "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
  ],
  more: true,
  page_index: 0
};

// Pass the entire response - the viewer will extract the IDs
<InscriptionViewer inscriptions={apiResponse} />
```

### 3. API Response with Children Objects

Handles responses from endpoints like `/children` or `/r/children/{id}/inscriptions`:

```tsx
// API Response format: { children: [...] }
const apiResponse = {
  children: [
    {
      id: "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
      number: 21000000,
      fee: 417,
      height: 861224,
      contentType: "text/plain"
    },
    {
      id: "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0",
      number: 21000001,
      contentType: "image/svg+xml"
    }
  ],
  more: true,
  page: 0
};

// Pass the entire response - the viewer will extract the inscription data
<InscriptionViewer inscriptions={apiResponse} />
```

### 4. Array of Full Objects

Traditional format with full inscription objects:

```tsx
const inscriptions = [
  {
    id: "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
    number: 21000000,
    contentType: "text/plain",
    contentUrl: "https://ordinals.com/content/1463d..."
  }
];

<InscriptionViewer inscriptions={inscriptions} />
```

## Real-World Examples

### Fetching from Ordinals API

```tsx
// Example: Fetching latest inscriptions
const fetchLatestInscriptions = async () => {
  const response = await fetch('https://ordinals.api/inscriptions');
  const data = await response.json();
  
  // data = { ids: [...], more: true, page_index: 0 }
  return data; // Pass directly to InscriptionViewer
};

// Example: Fetching child inscriptions
const fetchChildInscriptions = async (parentId) => {
  const response = await fetch(`https://ordinals.api/r/children/${parentId}/inscriptions`);
  const data = await response.json();
  
  // data = { children: [...], more: true, page: 0 }
  return data; // Pass directly to InscriptionViewer
};

// Usage
function MyComponent() {
  const [inscriptions, setInscriptions] = useState(null);
  
  useEffect(() => {
    fetchLatestInscriptions().then(setInscriptions);
  }, []);
  
  if (!inscriptions) return <div>Loading...</div>;
  
  return <InscriptionViewer inscriptions={inscriptions} />;
}
```

## Benefits

- **Zero configuration**: Pass API responses directly without transformation
- **Type safety**: Full TypeScript support for all input formats
- **Consistent output**: All formats are normalized internally to the same structure
- **Backwards compatible**: Existing code using object arrays continues to work
- **Flexible**: Works with any Ordinals API endpoint or custom data source

## Normalization

All input formats are automatically normalized to a consistent internal structure:

```tsx
interface InscriptionData {
  id: string;
  number?: string | number;
  contentUrl?: string;
  contentType?: string;
}
```

The normalization handles:
- Auto-generating sequential numbers when not provided
- Extracting IDs from API response objects
- Preserving existing metadata when available
- Graceful fallbacks for malformed input
