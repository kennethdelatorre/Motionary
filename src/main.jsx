import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import GamesPage from './pages/GamesPage.jsx'
import WotdPage from './pages/WotdPage.jsx'
import GrammarPage from './pages/GrammarPage.jsx'
import SlangPage from './pages/SlangPage.jsx'
import CameraPage from './pages/CameraPage.jsx'
import CameraPip from './components/CameraPip.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CameraPip />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/wotd" element={<WotdPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/slang" element={<SlangPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)