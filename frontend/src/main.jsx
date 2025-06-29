import { StrictMode } from 'react'
import './index.pcss'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import { UserProvider } from './context/UserContext.jsx'
import { FavoritosProvider } from './context/FavoritosContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <StrictMode>
      <UserProvider>
        <FavoritosProvider>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </FavoritosProvider>
      </UserProvider>
    </StrictMode>,
)