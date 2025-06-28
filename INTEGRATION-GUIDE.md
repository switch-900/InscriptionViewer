# 🚀 Bitcoin Inscription Viewer - Complete Integration Guide

A comprehensive React library for displaying Bitcoin inscriptions with seamless LaserEyes wallet integration.

## 📦 What You Get

### 1. **InscriptionGallery** - Basic Gallery Component
Perfect for displaying any list of inscription IDs with customizable layouts.

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer'

// Basic usage - just pass inscription IDs
<InscriptionGallery
  inscriptionIds={['6fb976ab...i0', 'e317a2a5...i0']}
  columns={3}
  cardSize={200}
  enableModal={true}
/>
```

### 2. **LaserEyesInscriptionGallery** - Wallet Integration
Automatically fetches and displays inscriptions from connected LaserEyes wallets.

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

// Auto-fetches from connected wallet
<LaserEyesInscriptionGallery
  columns={3}
  cardSize={200}
  enableModal={true}
  onInscriptionClick={(inscription) => {
    console.log('Clicked:', inscription.inscriptionId)
  }}
/>
```

## 🔥 LaserEyes Integration Benefits

### ✅ **Automatic Data Fetching**
- No manual API calls needed
- Automatically fetches inscriptions from connected wallet
- Handles pagination for large collections

### ✅ **Real-time Updates**
- Refreshes when wallet contents change
- Handles wallet connection/disconnection
- Auto-retries on network errors

### ✅ **Smart Pagination**
- Loads inscriptions in batches for performance
- "Load More" functionality built-in
- Configurable page sizes

### ✅ **Rich Metadata Access**
- Full inscription details from LaserEyes
- Content type detection
- Transaction information
- Preview URLs when available

## 🛠️ Implementation Examples

### 1. **Wallet Dashboard**
```tsx
import { LaserEyesProvider } from '@omnisat/lasereyes-react'
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function WalletDashboard() {
  return (
    <LaserEyesProvider network="mainnet">
      <div className="wallet-dashboard">
        <h1>My Bitcoin Inscriptions</h1>
        <LaserEyesInscriptionGallery
          columns={4}
          cardSize={250}
          showIndex={true}
          enableModal={true}
        />
      </div>
    </LaserEyesProvider>
  )
}
```

### 2. **Marketplace Integration**
```tsx
function MarketplaceView() {
  const { sendInscriptions } = useLaserEyes()

  const handleListForSale = async (inscription) => {
    // List inscription on your marketplace
    await marketplace.list(inscription.inscriptionId, price)
  }

  const handleSend = async (inscription, toAddress) => {
    // Send using LaserEyes
    const txId = await sendInscriptions([inscription.inscriptionId], toAddress)
    alert(\`Sent! Transaction: \${txId}\`)
  }

  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      onInscriptionClick={(inscription) => {
        showActionMenu(inscription, {
          onList: () => handleListForSale(inscription),
          onSend: (address) => handleSend(inscription, address)
        })
      }}
    />
  )
}
```

### 3. **Gaming Platform**
```tsx
function GameAssets() {
  const [selectedAssets, setSelectedAssets] = useState([])

  const filterGameAssets = (inscriptions) => {
    return inscriptions.filter(inscription => 
      inscription.contentType.includes('json') ||
      inscription.content.includes('game')
    )
  }

  return (
    <div>
      <h2>Game Assets ({selectedAssets.length} selected)</h2>
      <LaserEyesInscriptionGallery
        columns={5}
        cardSize={150}
        filterInscriptions={filterGameAssets}
        onInscriptionClick={(inscription) => {
          setSelectedAssets(prev => 
            prev.includes(inscription.inscriptionId)
              ? prev.filter(id => id !== inscription.inscriptionId)
              : [...prev, inscription.inscriptionId]
          )
        }}
      />
      <button onClick={() => useInGame(selectedAssets)}>
        Use Selected in Game
      </button>
    </div>
  )
}
```

### 4. **Portfolio Tracker**
```tsx
function PortfolioView() {
  const [portfolioValue, setPortfolioValue] = useState(0)

  const calculateValue = (inscriptions) => {
    const total = inscriptions.reduce((sum, inscription) => {
      return sum + getMarketPrice(inscription.inscriptionId)
    }, 0)
    setPortfolioValue(total)
    return inscriptions
  }

  return (
    <div>
      <div className="portfolio-header">
        <h2>Portfolio Value: {portfolioValue} BTC</h2>
      </div>
      <LaserEyesInscriptionGallery
        columns={4}
        cardSize={200}
        filterInscriptions={calculateValue}
        onInscriptionClick={(inscription) => {
          showInscriptionAnalytics(inscription)
        }}
      />
    </div>
  )
}
```

## 📱 Responsive Layouts

### Mobile-First Design
```tsx
// Automatically responsive
<LaserEyesInscriptionGallery
  columns={2} // 1 on mobile, 2 on tablet+
  cardSize={180}
/>
```

### Compact View
```tsx
// Show many inscriptions at once
<LaserEyesInscriptionGallery
  columns={6}
  cardSize={120}
  showIndex={false}
/>
```

### Showcase View
```tsx
// Large cards for featured items
<LaserEyesInscriptionGallery
  columns={2}
  cardSize={350}
  showIndex={true}
/>
```

## 🎯 Key Advantages

### 🔗 **Seamless Integration**
- Works with any LaserEyes-powered app
- No complex API management needed
- Handles wallet state automatically

### ⚡ **Optimized Performance**
- Lazy loading for large collections
- Smart caching to reduce API calls
- Efficient re-rendering with React.memo

### 🎨 **Customizable UI**
- Multiple layout options
- Custom loading/error components
- Flexible styling with CSS classes

### 🛡️ **Type Safety**
- Full TypeScript support
- Comprehensive type definitions
- IDE autocomplete and error checking

### 📊 **Rich Functionality**
- Modal views for detailed inspection
- Click handlers for custom actions
- Filter functions for custom logic
- Pagination for large collections

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
npm install @omnisat/lasereyes-react bitcoin-inscription-viewer
```

### Step 2: Setup Provider
```tsx
import { LaserEyesProvider } from '@omnisat/lasereyes-react'

function App() {
  return (
    <LaserEyesProvider network="mainnet">
      <YourAppComponents />
    </LaserEyesProvider>
  )
}
```

### Step 3: Use the Component
```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MyComponent() {
  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      enableModal={true}
    />
  )
}
```

## 🔧 Advanced Configuration

### Custom Filters
```tsx
const filterRareInscriptions = (inscriptions) => {
  return inscriptions.filter(inscription => inscription.number < 1000)
}

<LaserEyesInscriptionGallery
  filterInscriptions={filterRareInscriptions}
/>
```

### Custom Loading/Error Components
```tsx
<LaserEyesInscriptionGallery
  loadingComponent={<CustomSpinner />}
  errorComponent={<CustomErrorMessage />}
/>
```

### Click Handling
```tsx
<LaserEyesInscriptionGallery
  onInscriptionClick={(inscription) => {
    // Send to another address
    // List for sale
    // Navigate to detail page
    // Add to favorites
    // etc.
  }}
/>
```

---

**Ready to integrate?** This library makes it incredibly easy to add Bitcoin inscription viewing capabilities to any LaserEyes-powered application with just a few lines of code!
