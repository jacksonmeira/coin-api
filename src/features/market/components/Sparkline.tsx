import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export function Sparkline({ values, positive }: { values?: number[]; positive: boolean }) {
  const instanceId = useId().replace(/:/g, '')
  const data = (values?.slice(-24) ?? []).map((value, index) => ({ index, value }))
  if (data.length < 2) return <div className="spark-empty" />

  const color = positive ? '#16a979' : '#ec625f'
  const gradient = `${instanceId}-${positive ? 'positive' : 'negative'}`
  return <div className="spark"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={.24} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.7} fill={`url(#${gradient})`} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
}
