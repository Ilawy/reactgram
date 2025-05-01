import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RootComponent } from './components/demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <RootComponent /> */}
  </StrictMode>,
)
