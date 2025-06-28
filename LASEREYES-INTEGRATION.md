# 🔥 LaserEyes + Bitcoin Inscription Viewer Integration

Seamlessly display Bitcoin inscriptions from LaserEyes wallets with a beautiful, customizable gallery interface.

## 🚀 Quick Start

### 1. Installation

```bash
# Install both LaserEyes and the Inscription Viewer
npm install @omnisat/lasereyes-react bitcoin-inscription-viewer

# Or with yarn
yarn add @omnisat/lasereyes-react bitcoin-inscription-viewer
```

### 2. Setup LaserEyes Provider

```tsx
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes-react'

function App() {
  return (
    <LaserEyesProvider network={MAINNET}>
      <YourWalletComponent />
    </LaserEyesProvider>
  )
}
```

### 3. Use the LaserEyes Inscription Gallery

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MyWallet() {
  const handleInscriptionClick = (inscription) => {
    console.log('Clicked inscription:', inscription.inscriptionId)
    // Handle custom actions: send, list, navigate, etc.
  }

  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      enableModal={true}
      onInscriptionClick={handleInscriptionClick}
    />
  )
}
```

## 📋 API Reference

### LaserEyesInscriptionGallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Number of grid columns |
| `cardSize` | `number` | `200` | Card size in pixels |
| `showIndex` | `boolean` | `true` | Show inscription numbers |
| `enableModal` | `boolean` | `true` | Enable modal on click |
| `pageSize` | `number` | `20` | Inscriptions per page |
| `onInscriptionClick` | `function` | - | Click handler |
| `filterInscriptions` | `function` | - | Custom filter function |
| `loadingComponent` | `ReactNode` | - | Custom loading component |
| `errorComponent` | `ReactNode` | - | Custom error component |

### LaserEyes Inscription Type

```typescript
interface LaserEyesInscription {
  id: string
  inscriptionId: string
  content: string
  number: number
  address: string
  contentType: string
  output: string
  location: string
  genesisTransaction: string
  height: number
  preview: string
  outputValue: number
  offset?: number
}
```

## 🎨 Layout Examples

### 📱 Mobile-Friendly Gallery
```tsx
<LaserEyesInscriptionGallery
  columns={2} // 1 on mobile, 2 on tablet+
  cardSize={180}
  showIndex={true}
  enableModal={true}
/>
```

### 🖼️ Showcase View
```tsx
<LaserEyesInscriptionGallery
  columns={3}
  cardSize={300}
  showIndex={true}
  enableModal={true}
/>
```

### 📋 Compact Grid
```tsx
<LaserEyesInscriptionGallery
  columns={6}
  cardSize={120}
  showIndex={false}
  enableModal={true}
/>
```

## 🛠️ Advanced Use Cases

### 🏪 Marketplace Integration

```tsx
import { useLaserEyes } from '@omnisat/lasereyes-react'
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MarketplaceView() {
  const { sendInscriptions } = useLaserEyes()

  const handleListForSale = async (inscription) => {
    try {
      // List inscription on your marketplace
      await listInscriptionForSale(inscription.inscriptionId, price)
      
      // Show success message
      toast.success('Inscription listed for sale!')
    } catch (error) {
      toast.error('Failed to list inscription')
    }
  }

  const handleSendInscription = async (inscription, toAddress) => {
    try {
      const txId = await sendInscriptions([inscription.inscriptionId], toAddress)
      toast.success(\`Sent! Transaction: \${txId}\`)
    } catch (error) {
      toast.error('Failed to send inscription')
    }
  }

  return (
    <div>
      <h2>My Collection</h2>
      <LaserEyesInscriptionGallery
        columns={4}
        cardSize={200}
        enableModal={true}
        onInscriptionClick={(inscription) => {
          // Show action menu
          showActionMenu(inscription, {
            onList: () => handleListForSale(inscription),
            onSend: (address) => handleSendInscription(inscription, address),
            onView: () => window.open(\`/inscription/\${inscription.inscriptionId}\`)
          })
        }}
      />
    </div>
  )
}
```

### 🎮 Gaming Integration

```tsx
function GameInventory() {
  const [selectedInscriptions, setSelectedInscriptions] = useState([])

  const filterGameAssets = (inscriptions) => {
    // Filter for game-related inscriptions
    return inscriptions.filter(inscription => 
      inscription.contentType.includes('json') || 
      inscription.content.includes('game')
    )
  }

  const handleInscriptionSelect = (inscription) => {
    setSelectedInscriptions(prev => 
      prev.includes(inscription.inscriptionId)
        ? prev.filter(id => id !== inscription.inscriptionId)
        : [...prev, inscription.inscriptionId]
    )
  }

  return (
    <div>
      <h2>Game Assets ({selectedInscriptions.length} selected)</h2>
      <LaserEyesInscriptionGallery
        columns={5}
        cardSize={150}
        filterInscriptions={filterGameAssets}
        onInscriptionClick={handleInscriptionSelect}
      />
      
      <button 
        onClick={() => useInGame(selectedInscriptions)}
        disabled={selectedInscriptions.length === 0}
      >
        Use Selected in Game
      </button>
    </div>
  )
}
```

### 💼 Portfolio Tracker

```tsx
function PortfolioView() {
  const [totalValue, setTotalValue] = useState(0)

  const calculatePortfolioValue = (inscriptions) => {
    // Calculate total portfolio value
    const value = inscriptions.reduce((sum, inscription) => {
      return sum + getInscriptionMarketPrice(inscription.inscriptionId)
    }, 0)
    setTotalValue(value)
    return inscriptions
  }

  return (
    <div>
      <div className="portfolio-stats">
        <h2>Portfolio Value: {totalValue} BTC</h2>
        <p>Total Inscriptions: Loading...</p>
      </div>
      
      <LaserEyesInscriptionGallery
        columns={4}
        cardSize={200}
        filterInscriptions={calculatePortfolioValue}
        onInscriptionClick={(inscription) => {
          showInscriptionAnalytics(inscription)
        }}
      />
    </div>
  )
}
```

### 🔍 Collection Browser with Search

```tsx
function CollectionBrowser() {
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState('all')

  const filterInscriptions = (inscriptions) => {
    return inscriptions.filter(inscription => {
      const matchesSearch = inscription.inscriptionId.toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      const matchesType = contentTypeFilter === 'all' || 
        inscription.contentType.includes(contentTypeFilter)
      
      return matchesSearch && matchesType
    })
  }

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search inscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="text">Text</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <LaserEyesInscriptionGallery
        columns={3}
        cardSize={250}
        filterInscriptions={filterInscriptions}
        enableModal={true}
      />
    </div>
  )
}
```

## 🎯 Best Practices

### 1. Performance Optimization

```tsx
// Use pagination for large collections
<LaserEyesInscriptionGallery
  pageSize={20} // Load 20 at a time
  columns={3}
  cardSize={200}
/>
```

### 2. Error Handling

```tsx
// Custom error component
const CustomError = () => (
  <div className="error-state">
    <h3>Unable to load inscriptions</h3>
    <button onClick={() => window.location.reload()}>
      Retry
    </button>
  </div>
)

<LaserEyesInscriptionGallery
  errorComponent={<CustomError />}
  // ... other props
/>
```

### 3. Loading States

```tsx
// Custom loading component
const CustomLoading = () => (
  <div className="loading-state">
    <div className="spinner" />
    <p>Loading your inscriptions...</p>
  </div>
)

<LaserEyesInscriptionGallery
  loadingComponent={<CustomLoading />}
  // ... other props
/>
```

### 4. Responsive Design

```tsx
// Responsive columns based on screen size
const getColumns = () => {
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

<LaserEyesInscriptionGallery
  columns={getColumns()}
  cardSize={window.innerWidth < 640 ? 150 : 200}
/>
```

## 🔧 Troubleshooting

### Common Issues

1. **No inscriptions showing**: Ensure wallet is connected and has inscriptions
2. **Slow loading**: Reduce `pageSize` or `cardSize` for better performance
3. **Modal not opening**: Check that `enableModal={true}` is set
4. **Click handler not working**: Verify `onInscriptionClick` is defined

### Debug Mode

```tsx
<LaserEyesInscriptionGallery
  onInscriptionClick={(inscription) => {
    console.log('Debug - Inscription data:', inscription)
    // Your handling logic
  }}
/>
```

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to integrate?** Start with the quick start guide above and customize based on your needs!
