export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  sparkline_in_7d?: { price: number[] }
}

export type MarketSummary = {
  marketCap: number
  volume24h: number
  change24h: number
  bitcoinDominance: number
}

export type PricePoint = { label: string; value: number }
export type ChartRange = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'
