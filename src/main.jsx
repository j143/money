import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'purecss/build/pure-min.css'
import 'purecss/build/grids-responsive-min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
