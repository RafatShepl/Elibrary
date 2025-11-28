
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './auth/authContext.jsx';
import CartProvider from './cart/cartContext.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
        <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>

)
