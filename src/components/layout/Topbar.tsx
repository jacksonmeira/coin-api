import { useEffect } from 'react'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'

type TopbarProps = {
  activeNav: string
  query: string
  dark: boolean
  onQueryChange: (value: string) => void
  onToggleTheme: () => void
  onOpenMenu: () => void
}

export function Topbar({ activeNav, query, dark, onQueryChange, onToggleTheme, onOpenMenu }: TopbarProps) {
  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || (!event.ctrlKey && !event.metaKey)) return
      event.preventDefault()
      const searchInput = document.getElementById('coin-search') as HTMLInputElement | null
      searchInput?.focus()
      searchInput?.select()
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  return <header className="topbar">
    <button className="mobile-menu" onClick={onOpenMenu} aria-label="Abrir menu"><Menu size={20} /></button>
    <div className="breadcrumb">Workspace <span>/</span> <b>{activeNav}</b></div>
    <div className="topbar-actions">
      <label className="search-box"><Search size={16} /><input id="coin-search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar ativo..." /></label>
      <button className="icon-button theme-toggle" onClick={onToggleTheme} aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
      <button className="icon-button notification" aria-label="Notificações"><Bell size={17} /><i /></button>
      <div className="top-avatar">JD</div>
    </div>
  </header>
}
