import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import AdminPanel from './Admin.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/admin', element: <AdminPanel /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
