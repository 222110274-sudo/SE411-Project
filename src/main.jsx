import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ComputersProvider } from './context/ComputersContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ComputersProvider>
        <App />
      </ComputersProvider>
    </BrowserRouter>
  </StrictMode>,
)
