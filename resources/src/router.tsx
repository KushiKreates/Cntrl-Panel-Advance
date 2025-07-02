import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './routes'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}