import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { SelectedManagerProvider } from './state/selectedManager.context.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SelectedManagerProvider>
        <App />
      </SelectedManagerProvider>
    </BrowserRouter>
  </React.StrictMode>
)
