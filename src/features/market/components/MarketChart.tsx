import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronDown, LoaderCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { compact, currency } from '../../../lib/utils'
import type { ChartRange, Coin, PricePoint } from '../types'

const ranges: { value: ChartRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '7D', label: '7D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1A' },
  { value: 'ALL', label: 'Máx' },
]

type MarketChartProps = {
  coin?: Coin
  coins: Coin[]
  history: PricePoint[]
  range: ChartRange
  loading: boolean
  error?: string
  onRangeChange: (range: ChartRange) => void
  onCoinChange: (id: string) => void
}

export function MarketChart({ coin, coins, history, range, loading, error, onRangeChange, onCoinChange }: MarketChartProps) {
  const change = useMemo(() => {
    const first = history[0]?.value
    const last = history[history.length - 1]?.value
    return first && last ? ((last - first) / first) * 100 : null
  }, [history])

  return <Card id="analysis-section" className="chart-card">
    <CardHeader className="chart-header"><div><CardTitle>Desempenho do mercado</CardTitle><p>Variação de preço ao longo do tempo</p></div>
      <div className="chart-controls"><div className="asset-select"><select value={coin?.id ?? 'bitcoin'} onChange={(event) => onCoinChange(event.target.value)} aria-label="Selecionar ativo">{coins.map((item) => <option value={item.id} key={item.id}>{item.symbol.toUpperCase()}</option>)}</select><ChevronDown size={13} aria-hidden="true" /></div><div className="range-tabs">{ranges.map((item) => <button key={item.value} className={range === item.value ? 'range-active' : ''} onClick={() => onRangeChange(item.value)}>{item.label}</button>)}</div></div>
    </CardHeader>
    <div className="chart-summary"><strong>{coin ? currency(coin.current_price) : '—'}</strong><span className={(change ?? coin?.price_change_percentage_24h ?? 0) >= 0 ? 'positive' : 'negative'}>{change === null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`} <small>no período</small></span></div>
    <div className="chart-wrap">{loading && <div className="chart-loading"><LoaderCircle className="spin" size={20} /></div>}
      {history.length > 1 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={history} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}><defs><linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3987f6" stopOpacity={.23} /><stop offset="95%" stopColor="#3987f6" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--grid)" strokeDasharray="4 5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} minTickGap={38} tickMargin={12} /><YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={(value) => `$${compact(value)}`} width={62} domain={['auto', 'auto']} /><Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 12 }} formatter={(value) => [currency(Number(value)), coin?.symbol.toUpperCase() ?? 'Preço']} /><Area type="monotone" dataKey="value" stroke="#3987f6" strokeWidth={2.5} fill="url(#marketFill)" activeDot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }} /></AreaChart></ResponsiveContainer> : <div className="chart-empty">{loading ? 'Carregando histórico de preços...' : error || 'Histórico indisponível no momento'}</div>}
    </div>
    <div className="chart-footer"><span><i className="legend-dot" /> {coin?.name ?? 'Bitcoin'} <span>·</span> USD</span><span>Atualizado agora <i className="live-dot" /></span></div>
  </Card>
}
