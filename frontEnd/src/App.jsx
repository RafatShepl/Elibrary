
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import AdminLayout from "./components/Admin/admin-layout"
import AllBooks from "./pages/all-books.jsx"
import AddBook from "./components/Admin/add-book"
import Register from './pages/register'
import Login from './pages/login'
import { AuthProvider, useAuth } from './auth/authContext'
import AdminRoute from './components/Admin/admin-route'
import UpdateBook from './components/Admin/update-book'
import ShoppingCart from './pages/shoppingCart'
import CartProvider from './cart/cartContext'
import { Toaster } from 'react-hot-toast';
import Loader from './components/loader'
import BookDetails from './pages/bookDetails'
function App() {
  const location = useLocation();
  const { loading } = useAuth()
  const showHeader = /^\/admin(\/|$)/.test(location.pathname);

  return (
    <>
      {/* Navbar يظهر فقط خارج صفحات الادمن */}
      {!showHeader && <NavBar />}
      {loading && <Loader />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/book-details/:id" element={<BookDetails />} />
        <Route path="/allBooks" element={<AllBooks />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AllBooks />} />
          <Route path="addBook" element={<AddBook />} />
          <Route path="updateBook/:id" element={<UpdateBook />} />
          <Route path="books" element={<AllBooks />} />
        </Route>
      </Routes>

    </>




  );
}


export default App
