import { create } from 'zustand'
import { User } from '@/payload-types'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const data = await res.json()
        set({ user: data.user })
      } else {
        set({ user: null })
      }
    } catch (_error) {
      set({ user: null })
    } finally {
      set({ isLoading: false })
    }
  },
  logout: async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      set({ user: null })
    } catch (error) {
      console.error('Logout failed', error)
    }
  },
}))
