# Bitcoin Inscription Viewer - API Endpoints Guide

## 🔄 Recursive Endpoints (Recommended)

**Recursive endpoints** (prefixed with `/r/`) are specifically designed for client applications and **do not require access to a full Bitcoin node**. They are more reliable and should be your first choice for most applications.

### Key Benefits:
- ✅ **No node required** - Works without Bitcoin Core
- ✅ **High availability** - More reliable uptime
- ✅ **Optimized for clients** - Designed for web/mobile apps
- ✅ **JSON responses** - Always return structured data
- ✅ **Better performance** - Cached and optimized

### Available Recursive Endpoints:

#### 1. Inscription Information
```
GET https://ordinals.com/r/inscription/{inscription_id}
```
Returns detailed information about an inscription including charms, content type, fee, height, etc.

#### 2. Latest Inscriptions
```
GET https://ordinals.com/r/inscriptions
GET https://ordinals.com/r/inscriptions/{page}
```
Get paginated list of latest inscriptions with IDs and metadata.

#### 3. Child Inscriptions
```
GET https://ordinals.com/r/children/{inscription_id}
GET https://ordinals.com/r/children/{inscription_id}/inscriptions
```
- First endpoint returns child inscription IDs
- Second endpoint returns detailed child inscription information

#### 4. Parent Inscriptions
```
GET https://ordinals.com/r/parents/{inscription_id}
GET https://ordinals.com/r/parents/{inscription_id}/inscriptions
```
- First endpoint returns parent inscription IDs
- Second endpoint returns detailed parent inscription information

#### 5. Satoshi Inscriptions
```
GET https://ordinals.com/r/sat/{sat_number}
GET https://ordinals.com/r/sat/{sat_number}/{page}
GET https://ordinals.com/r/sat/{sat_number}/at/{index}
```
Get inscriptions on a specific satoshi (requires --index-sats flag on server).

#### 6. Metadata
```
GET https://ordinals.com/r/metadata/{inscription_id}
```
Returns hex-encoded CBOR metadata for an inscription.

#### 7. Transaction Data
```
GET https://ordinals.com/r/tx/{transaction_id}
```
Get hex-encoded transaction data.

#### 8. UTXO Assets
```
GET https://ordinals.com/r/utxo/{outpoint}
```
Get assets (inscriptions, runes) held by an unspent transaction output.

---

## 📱 Node-Required Endpoints

These endpoints require the ordinals.com server to have access to a full Bitcoin node. They may not always be available and should be used as fallbacks.

### Key Limitations:
- ❌ **Requires Bitcoin node** - Server needs Bitcoin Core access
- ❌ **Lower availability** - May be unavailable if node is down
- ❌ **Requires Accept header** - Need `Accept: application/json` for JSON responses
- ❌ **Higher latency** - Direct blockchain queries

### Node-Required Endpoints:

#### 1. Inscription Details
```
GET https://ordinals.com/inscription/{inscription_id}
Headers: Accept: application/json
```

#### 2. Latest Inscriptions
```
GET https://ordinals.com/inscriptions
GET https://ordinals.com/inscriptions/{page}
Headers: Accept: application/json
```

#### 3. Block Information
```
GET https://ordinals.com/block/{hash_or_height}
Headers: Accept: application/json
```

#### 4. Satoshi Information
```
GET https://ordinals.com/sat/{sat_number}
Headers: Accept: application/json
```

#### 5. Address Assets
```
GET https://ordinals.com/address/{address}
Headers: Accept: application/json
```

#### 6. UTXO Information
```
GET https://ordinals.com/output/{txid:vout}
Headers: Accept: application/json
```

---

## 🎯 Content Endpoint (Always Available)

The content endpoint is always available and doesn't require special headers:

```
GET https://ordinals.com/content/{inscription_id}
```

This returns the raw inscription content (images, text, JSON, etc.) and is essential for displaying the actual inscription data.

---

## 💡 Best Practices

### 1. **Use Recursive Endpoints First**
Always try recursive endpoints before falling back to node-required endpoints.

### 2. **Handle Errors Gracefully**
Implement fallback logic:
```javascript
// Try recursive endpoint first
try {
  const response = await fetch(`https://ordinals.com/r/inscription/${id}`);
  if (!response.ok) throw new Error('Recursive endpoint failed');
  return await response.json();
} catch (error) {
  // Fallback to node-required endpoint
  const response = await fetch(`https://ordinals.com/inscription/${id}`, {
    headers: { 'Accept': 'application/json' }
  });
  return await response.json();
}
```

### 3. **Cache Responses**
Implement caching to reduce API calls and improve performance.

### 4. **Use Appropriate Endpoints**
- Use `/content/` for displaying inscription content
- Use `/r/inscription/` for metadata and information
- Use `/r/children/` and `/r/parents/` for exploring relationships

---

## 🔧 Implementation in the Viewer

The Bitcoin Inscription Viewer automatically:

1. **Prioritizes recursive endpoints** for better reliability
2. **Falls back to node-required endpoints** when necessary
3. **Handles different content types** automatically
4. **Caches responses** to improve performance
5. **Provides clear labeling** so you know which endpoint type you're using
6. **Responsive content rendering** - Content adapts to any container size
7. **Fluid scaling** - Maintains aspect ratio while filling available space

### Responsive Design Integration

The viewer's responsive design works seamlessly with all endpoint types:

```tsx
// Content automatically scales to container
<div className="w-full h-64 md:h-80 lg:h-96">
  <InscriptionRenderer
    inscriptionId="your-inscription-id"
    apiEndpoint="https://ordinals.com" // Uses recursive endpoints
    className="w-full h-full"
  />
</div>
```

### Endpoint Selection Strategy

1. **Default behavior**: Uses `https://ordinals.com/content/` for content and `https://ordinals.com/r/inscription/` for metadata
2. **Custom endpoint**: Automatically detects if endpoint supports recursive format
3. **Fallback logic**: Falls back to node-required endpoints if recursive endpoints fail
4. **Error handling**: Provides clear error messages and retry mechanisms

Choose recursive endpoints whenever possible for the best user experience! 🚀
