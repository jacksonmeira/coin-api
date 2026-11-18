import { useCallback, useEffect, useState } from 'react'
import { getCoins, getMarketSummary, getPriceHistory } from '../api/coingecko'
import type { ChartRange, Coin, MarketSummary } from '../types'

const RANGE_DAYS: Record<ChartRange, string> = {
  '1D': '1', '7D': '7', '1M': '30', '3M': '90', '1Y': '365', ALL: 'max',
}

export function useMarketData(selectedCoinId: string, range: ChartRange) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [summary, setSummary] = useState<MarketSummary | null>(null)
  const [history, setHistory] = useState<Awaited<ReturnType<typeof getPriceHistory>>>([])
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [coinData, marketSummary] = await Promise.all([getCoins(), getMarketSummary()])
      setCoins(coinData)
      setSummary(marketSummary)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar o mercado.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  useEffect(() => {
    let cancelled = false
    setChartLoading(true)
    getPriceHistory(selectedCoinId, RANGE_DAYS[range])
      .then((points) => { if (!cancelled) setHistory(points) })
      .catch(() => { if (!cancelled) setHistory([]) })
      .finally(() => { if (!cancelled) setChartLoading(false) })
    return () => { cancelled = true }
  }, [selectedCoinId, range])

  return { coins, summary, history, loading, chartLoading, error, refresh }
}
