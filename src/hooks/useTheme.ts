import { useEffect, useState } from 'react'

const STORAGE_KEY = 'coinpulse-theme'

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem(STORAGE_KEY) === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggleTheme: () => setDark((current) => !current) }
}
