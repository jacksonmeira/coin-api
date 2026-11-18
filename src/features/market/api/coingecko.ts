import type { Coin, MarketSummary, PricePoint } from '../types'

const BASE_URL = 'https://api.coingecko.com/api/v3'
const apiKey = import.meta.env.VITE_COINGECKO_API_KEY

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: apiKey ? { 'x-cg-demo-api-key': apiKey } : {},
  })
  if (!response.ok) {
    const message = response.status === 429
      ? 'Limite de requisições atingido. Tente novamente em instantes.'
      : `CoinGecko respondeu com erro (${response.status}).`
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export function getCoins(currency = 'usd') {
  return request<Coin[]>(`/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`)
}

export async function getMarketSummary(): Promise<MarketSummary> {
  const response = await request<{ data: { total_market_cap: { usd: number }; total_volume: { usd: number }; market_cap_change_percentage_24h_usd: number; market_cap_percentage: { btc: number } } }>('/global')
  return {
    marketCap: response.data.total_market_cap.usd,
    volume24h: response.data.total_volume.usd,
    change24h: response.data.market_cap_change_percentage_24h_usd,
    bitcoinDominance: response.data.market_cap_percentage.btc,
  }
}

export async function getPriceHistory(id: string, days: string): Promise<PricePoint[]> {
  const response = await request<{ prices: [number, number][] }>(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`)
  const stride = Math.max(1, Math.floor(response.prices.length / 80))
  const dateOptions: Intl.DateTimeFormatOptions = days === '1'
    ? { hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short' }

  return response.prices
    .filter((_, index) => index % stride === 0)
    .map(([timestamp, value]) => ({
      label: new Intl.DateTimeFormat('pt-BR', dateOptions).format(timestamp),
      value,
    }))
}
