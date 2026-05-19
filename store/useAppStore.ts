import { create } from 'zustand'
import type { AlertType, Severity } from '@/types'

interface AppState {
  // Theme
  isLightMode: boolean
  toggleLightMode: () => void

  // Competitor filters
  competitorSearch: string
  setCompetitorSearch: (v: string) => void
  competitorCategory: string
  setCompetitorCategory: (v: string) => void

  // Alert filters
  alertSearch: string
  setAlertSearch: (v: string) => void
  alertTypeFilter: AlertType | 'all'
  setAlertTypeFilter: (v: AlertType | 'all') => void
  alertSeverityFilter: Severity | 'all'
  setAlertSeverityFilter: (v: Severity | 'all') => void

  // Mobile sidebar
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isLightMode: false,
  toggleLightMode: () => set((s) => ({ isLightMode: !s.isLightMode })),

  competitorSearch: '',
  setCompetitorSearch: (v) => set({ competitorSearch: v }),
  competitorCategory: 'all',
  setCompetitorCategory: (v) => set({ competitorCategory: v }),

  alertSearch: '',
  setAlertSearch: (v) => set({ alertSearch: v }),
  alertTypeFilter: 'all',
  setAlertTypeFilter: (v) => set({ alertTypeFilter: v }),
  alertSeverityFilter: 'all',
  setAlertSeverityFilter: (v) => set({ alertSeverityFilter: v }),

  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
