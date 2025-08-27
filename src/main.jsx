import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fix mobile viewport height issues
const setVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Set initial viewport height
setVH()

// Re-calculate on resize and orientation change
window.addEventListener('resize', setVH)
window.addEventListener('orientationchange', () => {
  setTimeout(setVH, 100)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
