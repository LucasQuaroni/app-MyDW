import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.js'
import Layout from './pages/Layout.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
        errorElement: <div>Error</div>,
      },
      {
        path: "about",
        Component: About,
        errorElement: <div>Error</div>,
      },
      {
        path: "contact",
        Component: Contact,
        errorElement: <div>Error</div>,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
