import React from 'react'
import Dashboard from './Pages/Home'
import StorePage from './Pages/Store'

interface RouteConfig {
  path: string
  element: React.ReactNode
}

const routes: RouteConfig[] = [
  { path: '/home', element: <Dashboard /> },
  { path: '/home/store', element: <StorePage /> },

]

export default routes