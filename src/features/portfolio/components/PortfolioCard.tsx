import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'

const DEMO_HISTORY = [25,28,26,33,30,36,33,41,38,46,43,54,49,63,58,71,66,80,76,92].map((value) => ({ value }))
const ALLOCATION = [['Bitcoin',68,'#f5a623'],['Ethereum',22,'#8470ea'],['Solana',7,'#28b996'],['Outros',3,'#d9dee7']] as const

export function PortfolioCard() {
  const [visible, setVisible] = useState(true)
  return <Card id="portfolio-section" className="portfolio-card"><CardHeader><div><CardTitle>Portfólio de exemplo</CardTitle><p>Simulação visual · não são seus investimentos</p></div><button className="text-icon-button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Ocultar valores' : 'Mostrar valores'}>{visible ? <Eye size={16} /> : <EyeOff size={16} />}</button></CardHeader>
    <CardContent><div className="portfolio-total">{visible ? '$24,680.50' : '••••••••'}</div><div className="portfolio-change"><span className="change-pill green"><ArrowUpRight size={13} /> 12,8%</span><span>+$2.804,20 este mês</span></div>
      <div className="portfolio-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={DEMO_HISTORY}><defs><linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20ba88" stopOpacity={.18} /><stop offset="100%" stopColor="#20ba88" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="value" stroke="#20ba88" strokeWidth={2} fill="url(#portfolioFill)" /></AreaChart></ResponsiveContainer></div>
      <div className="allocation-title"><span>Alocação de ativos</span><button>Ver detalhes <ArrowUpRight size={13} /></button></div><div className="allocation-bar">{ALLOCATION.map(([name, percent, color]) => <span key={name} style={{ width: `${percent}%`, background: color }} />)}</div>
      <div className="allocation-list">{ALLOCATION.map(([name, percent, color]) => <div className="allocation-row" key={name}><i style={{ background: color }} /><span>{name}</span><b>{percent}%</b></div>)}</div>
    </CardContent>
  </Card>
}
