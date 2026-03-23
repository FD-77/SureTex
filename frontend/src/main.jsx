import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './Pages/header.jsx'
import {Outlet} from 'react-router-dom'
import {RouterProvider} from 'react-router-dom'
import Router from './routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="relative min-h-screen overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover -z-10">
            <source src="/public/images/0_Clouds_Sky_3840x2160.mp4" type="video/mp4" />
        </video>
        <RouterProvider router={Router}></RouterProvider>
    </div>
  </StrictMode>,
)
