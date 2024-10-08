import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit/AuthProvider'
import ScrollToTop from './ScrollToTop'
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


const authStore = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
  cookieSameSite: 'None',
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VercelAnalytics />
      <SpeedInsights/>
      <ScrollToTop />
      <AuthProvider store={authStore}>
        <App />                            
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
