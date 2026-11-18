import { ArrowUpRight, BarChart3, Shield, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { currency } from '../../../lib/utils'
import type { MarketSummary } from '../types'

function Change({ value }: { value?: number }) {
  if (value === undefined) return <span className="change-pill">—</span>
  const positive = value >= 0
  return <span className={`change-pill ${positive ? 'green' : 'red'}`}><ArrowUpRight size={13} /> {Math.abs(value).toFixed(2)}%</span>
}

export function MarketStats({ summary }: { summary: MarketSummary | null }) {
  return <div className="metric-grid">
    <Card className="metric-card"><CardHeader><span className="metric-label">Capitalização total</span><span className="metric-icon lavender"><BarChart3 size={17} /></span></CardHeader><CardContent><div className="metric-value">{summary ? currency(summary.marketCap, 0) : '—'}</div><div className="metric-foot"><Change value={summary?.change24h} /><span>vs. últimas 24h</span></div><div className="metric-decoration"><div /><div /><div /><div /><div /><div /></div></CardContent></Card>
    <Card className="metric-card"><CardHeader><span className="metric-label">Volume em 24h</span><span className="metric-icon mint"><TrendingUp size={17} /></span></CardHeader><CardContent><div className="metric-value">{summary ? currency(summary.volume24h, 0) : '—'}</div><div className="metric-foot"><span>Volume negociado nas últimas 24 horas</span></div><div className="volume-bars">{[28,43,35,57,39,68,48,72,53,82,62,91,60,76,50,69,44,63,39,54].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></CardContent></Card>
    <Card className="metric-card"><CardHeader><span className="metric-label">Dominância do Bitcoin</span><span className="metric-icon amber"><Shield size={17} /></span></CardHeader><CardContent><div className="metric-value">{summary ? `${summary.bitcoinDominance.toFixed(1)}%` : '—'}</div><div className="metric-foot"><span>Participação no valor total de mercado</span></div><div className="dominance-track"><span style={{ width: `${summary?.bitcoinDominance ?? 56}%` }} /></div><div className="dominance-labels"><span>BTC</span><span>Altcoins</span></div></CardContent></Card>
  </div>
}
