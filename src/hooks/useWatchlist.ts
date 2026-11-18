import { useState } from 'react'

const STORAGE_KEY = 'coinpulse-favorites'
const DEFAULT_FAVORITES = ['bitcoin', 'ethereum', 'solana']

function readFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as string[] : DEFAULT_FAVORITES
  } catch {
    return DEFAULT_FAVORITES
  }
}

export function useWatchlist() {
  const [favorites, setFavorites] = useState(readFavorites)

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return { favorites, toggleFavorite }
}
