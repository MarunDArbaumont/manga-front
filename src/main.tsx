import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./assets/main.css"
import { AuthProvider } from './context/AuthContext.tsx'


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
