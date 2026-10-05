import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

// StrictMode намеренно выключен: в учебных демо он удваивал бы вызовы
// рендера и эффектов в dev-режиме, из-за чего счётчики показывали бы «враньё».
// Про StrictMode отдельно рассказано в теме «Жизненный цикл компонента».
createRoot(document.getElementById('root')!).render(<App />)
