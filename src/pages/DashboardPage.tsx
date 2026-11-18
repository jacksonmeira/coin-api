import { useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useWatchlist } from '../hooks/useWatchlist'
import { useMarketData } from '../features/market/hooks/useMarketData'
import { MarketStats } from '../features/market/components/MarketStats'
import { MarketChart } from '../features/market/components/MarketChart'
import { CoinTable } from '../features/market/components/CoinTable'
import { PortfolioCard } from '../features/portfolio/components/PortfolioCard'
import type { ChartRange } from '../features/market/types'

export function DashboardPage() {
  const [selectedCoinId, setSelectedCoinId] = useState('bitcoin')
  const [range, setRange] = useState<ChartRange>('7D')
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Visão geral')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { dark, toggleTheme } = useTheme()
  const { favorites, toggleFavorite } = useWatchlist()
  const { coins, summary, history, loading, chartLoading, error, refresh } = useMarketData(selectedCoinId, range)
  const filteredCoins = useMemo(() => coins.filter((coin) => `${coin.name} ${coin.symbol}`.toLowerCase().includes(query.toLowerCase())), [coins, query])
  const selectedCoin = coins.find((coin) => coin.id === selectedCoinId)

  function scrollToSection(sectionId: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function navigateTo(label: string) {
    const sections: Record<string, string> = {
      'Visão geral': 'dashboard-top',
      Mercado: 'market-section',
      Portfólio: 'portfolio-section',
      Análises: 'analysis-section',
    }
    setActiveNav(label)
    setMobileNavOpen(false)
    scrollToSection(sections[label] ?? 'dashboard-top')
  }

  function selectCoin(id: string) {
    setSelectedCoinId(id)
    setActiveNav('Análises')
    scrollToSection('analysis-section')
  }

  return <div className="app-shell">
    <Sidebar open={mobileNavOpen} activeNav={activeNav} coins={coins} favorites={favorites} selectedCoinId={selectedCoinId} onClose={() => setMobileNavOpen(false)} onNavigate={navigateTo} onSelectCoin={selectCoin} onFocusSearch={() => document.getElementById('coin-search')?.focus()} />
    <main className="main-content">
      <Topbar activeNav={activeNav} query={query} dark={dark} onQueryChange={setQuery} onToggleTheme={toggleTheme} onOpenMenu={() => setMobileNavOpen(true)} />
      <div className="page-content" id="dashboard-top">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> MERCADO EM TEMPO REAL</div><h1>Visão geral</h1><p>Acompanhe o mercado cripto em um só lugar.</p></div><div className="heading-actions"><Button variant="outline" onClick={() => void refresh()} disabled={loading}><span className={loading ? 'spin' : ''}><Download size={15} /></span> Atualizar dados</Button><Button onClick={() => { navigateTo('Mercado'); document.getElementById('coin-search')?.focus() }}><Plus size={16} /> Adicionar ativo</Button></div></div>
        {error && <div className="error-banner"><span>{error}</span><button onClick={() => void refresh()}>Tentar novamente</button></div>}
        <MarketStats summary={summary} />
        <div className="dashboard-grid"><MarketChart coin={selectedCoin} coins={coins} history={history} range={range} loading={chartLoading} error={error} onRangeChange={setRange} onCoinChange={setSelectedCoinId} /><PortfolioCard /></div>
        <CoinTable coins={filteredCoins} loading={loading} query={query} favorites={favorites} onQueryChange={setQuery} onToggleFavorite={toggleFavorite} onSelectCoin={selectCoin} />
        <footer className="page-footer"><span>© 2026 CoinAPI. Dados de mercado via CoinGecko.</span><span><a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">CoinGecko</a><a href="#">Central de ajuda</a><a href="#">Termos</a></span></footer>
      </div>
    </main>
  </div>
}
