import { createContext, useContext, useMemo, useState } from 'react'

const SelectedManagerContext = createContext(null)

export function SelectedManagerProvider({ children }) {
  const [selectedManager, setSelectedManager] = useState(null)

  const value = useMemo(
    () => ({
      selectedManager,
      setSelectedManager
    }),
    [selectedManager]
  )

  return <SelectedManagerContext.Provider value={value}>{children}</SelectedManagerContext.Provider>
}

export function useSelectedManager() {
  const context = useContext(SelectedManagerContext)
  if (!context) {
    throw new Error('useSelectedManager must be used inside SelectedManagerProvider')
  }
  return context
}
