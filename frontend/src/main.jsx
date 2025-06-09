import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.pcss'
import App from './App.jsx'
import react from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './context/UserContext.jsx'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>,
)