import { BarChart3, ChevronDown, Compass, LayoutDashboard, Plus, Settings2, Wallet, X } from 'lucide-react'
import type { Coin } from '../../features/market/types'

type SidebarProps = {
  open: boolean
  activeNav: string
  coins: Coin[]
  favorites: string[]
  selectedCoinId: string
  onClose: () => void
  onNavigate: (label: string) => void
  onSelectCoin: (id: string) => void
  onFocusSearch: () => void
}

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Mercado', icon: Compass },
  { label: 'Portfólio', icon: Wallet },
  { label: 'Análises', icon: BarChart3 },
]

export function Sidebar({ open, activeNav, coins, favorites, selectedCoinId, onClose, onNavigate, onSelectCoin, onFocusSearch }: SidebarProps) {
  return <>
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><span /></span><span>coin<span>API</span></span><button className="mobile-close" onClick={onClose} aria-label="Fechar menu"><X size={18} /></button></div>
      <div className="workspace"><div className="workspace-icon" aria-hidden="true" /><div className="workspace-copy"><b>Meu espaço</b><span>Plano gratuito</span></div><ChevronDown size={15} className="muted-icon" /></div>
      <div className="side-label">MENU PRINCIPAL</div>
      <nav className="side-nav">{navigation.map(({ label, icon: Icon }) => <button key={label} onClick={() => onNavigate(label)} aria-current={activeNav === label ? 'page' : undefined} className={`nav-item ${activeNav === label ? 'nav-active' : ''}`}><Icon size={17} /><span>{label}</span></button>)}</nav>
      <div className="side-label watch-label">ACOMPANHANDO <button onClick={onFocusSearch} aria-label="Buscar ativo"><Plus size={14} /></button></div>
      <div className="watch-list">{favorites.map((id) => {
        const coin = coins.find((item) => item.id === id)
        return <button key={id} className={`watch-item ${selectedCoinId === id ? 'watch-selected' : ''}`} onClick={() => { onSelectCoin(id); onClose() }}>
          <span className="watch-coin">{coin?.image ? <img src={coin.image} alt="" /> : '◉'}</span>
          <span className="watch-name">{coin?.name ?? id}<small>{coin?.symbol.toUpperCase() ?? '—'}</small></span>
          <span className={(coin?.price_change_percentage_24h ?? 0) >= 0 ? 'positive' : 'negative'}>{coin ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(1)}%` : '—'}</span>
        </button>
      })}</div>
      <div className="sidebar-bottom">
        <button className="nav-item settings-item"><Settings2 size={17} /><span>Configurações</span></button>
      </div>
    </aside>
    {open && <button className="scrim" onClick={onClose} aria-label="Fechar navegação" />}
  </>
}
