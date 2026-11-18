import { useEffect, useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronDown, MoreHorizontal, Search, Settings2 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { currency } from '../../../lib/utils'
import type { Coin } from '../types'
import { Sparkline } from './Sparkline'

type SortMode = 'marketCap' | 'price' | 'gainers' | 'losers' | 'name'
const PAGE_SIZE = 8
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'marketCap', label: 'Maior capitalização' },
  { value: 'price', label: 'Maior preço' },
  { value: 'gainers', label: 'Maiores altas (24h)' },
  { value: 'losers', label: 'Maiores quedas (24h)' },
  { value: 'name', label: 'Nome (A–Z)' },
]

type CoinTableProps = {
  coins: Coin[]
  loading: boolean
  query: string
  favorites: string[]
  onQueryChange: (query: string) => void
  onToggleFavorite: (id: string) => void
  onSelectCoin: (id: string) => void
}

export function CoinTable({ coins, loading, query, favorites, onQueryChange, onToggleFavorite, onSelectCoin }: CoinTableProps) {
  const [sortMode, setSortMode] = useState<SortMode>('marketCap')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [query])

  const sortedCoins = useMemo(() => [...coins].sort((a, b) => {
    switch (sortMode) {
      case 'price': return b.current_price - a.current_price
      case 'gainers': return b.price_change_percentage_24h - a.price_change_percentage_24h
      case 'losers': return a.price_change_percentage_24h - b.price_change_percentage_24h
      case 'name': return a.name.localeCompare(b.name)
      default: return a.market_cap_rank - b.market_cap_rank
    }
  }), [coins, sortMode])

  const pageCount = Math.max(1, Math.ceil(sortedCoins.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleCoins = sortedCoins.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const selectedSort = SORT_OPTIONS.find((option) => option.value === sortMode)?.label ?? 'Ordenar'

  function updateQuery(value: string) {
    setPage(1)
    onQueryChange(value)
  }

  function updateSort(value: SortMode) {
    setSortMode(value)
    setPage(1)
    setFilterOpen(false)
  }

  return <Card id="market-section" className="market-card">
    <CardHeader className="market-header">
      <div><CardTitle>Criptomoedas em destaque</CardTitle><p>Explore os ativos mais relevantes do mercado.</p></div>
      <div className="market-tools">
        <label className="table-search"><Search size={14} /><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Buscar moeda..." /></label>
        <div className="filter-control">
          <button className="filter-button" aria-label={`Ordenar: ${selectedSort}`} aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}><Settings2 size={15} /> Filtros <ChevronDown size={13} /></button>
          {filterOpen && <div className="filter-menu" role="menu" aria-label="Ordenar criptomoedas">{SORT_OPTIONS.map((option) => <button key={option.value} role="menuitemradio" aria-checked={sortMode === option.value} className={sortMode === option.value ? 'filter-option filter-option-active' : 'filter-option'} onClick={() => updateSort(option.value)}>{option.label}{sortMode === option.value && <span>✓</span>}</button>)}</div>}
        </div>
        <button className="text-icon-button" aria-label="Mais opções"><MoreHorizontal size={18} /></button>
      </div>
    </CardHeader>

    <div className="table-scroll"><table><thead><tr><th>#</th><th>ATIVO</th><th>PREÇO</th><th>24H</th><th className="chart-col">ÚLTIMOS 7 DIAS</th><th>CAPITALIZAÇÃO</th><th /></tr></thead>
      <tbody>
        {loading && !coins.length ? Array.from({ length: 5 }, (_, index) => <tr key={index}><td colSpan={7}><div className="table-skeleton" /></td></tr>) : visibleCoins.map((coin) => <tr key={coin.id}>
          <td className="rank-cell"><button className={`star ${favorites.includes(coin.id) ? 'starred' : ''}`} onClick={() => onToggleFavorite(coin.id)} aria-label={`${favorites.includes(coin.id) ? 'Remover' : 'Adicionar'} ${coin.name} aos favoritos`}>★</button><span>{String(coin.market_cap_rank).padStart(2, '0')}</span></td>
          <td><button className="coin-name" onClick={() => onSelectCoin(coin.id)}><img src={coin.image} alt="" /><span><b>{coin.name}</b><small>{coin.symbol.toUpperCase()}</small></span></button></td>
          <td className="price-cell">{currency(coin.current_price, coin.current_price < 1 ? 4 : 2)}</td>
          <td><span className={`table-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>{coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span></td>
          <td className="chart-col"><Sparkline values={coin.sparkline_in_7d?.price} positive={coin.price_change_percentage_24h >= 0} /></td>
          <td className="cap-cell">{currency(coin.market_cap, 0)}</td><td><button className="row-more" aria-label={`Mais opções para ${coin.name}`}><MoreHorizontal size={17} /></button></td>
        </tr>)}
      </tbody>
    </table>
    {!loading && !sortedCoins.length && <div className="empty-table">Nenhum ativo encontrado para “{query}”.</div>}</div>

    <div className="table-footer"><span>Mostrando <b>{sortedCoins.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, sortedCoins.length)}</b> de <b>{sortedCoins.length}</b> ativos</span>
      <div className="pagination"><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>Anterior</button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} className={currentPage === pageNumber ? 'page-number' : ''} aria-current={currentPage === pageNumber ? 'page' : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}
        <button onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount}>Próxima <ArrowUpRight size={12} /></button>
      </div>
    </div>
  </Card>
}
