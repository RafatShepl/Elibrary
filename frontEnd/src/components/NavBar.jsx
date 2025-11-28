import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { ShoppingBagIcon, ShoppingBasketIcon, ShoppingCartIcon } from "lucide-react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const Navigate = useNavigate()

  // --- User menu component ---
  const UserMenu = ({ isMobile = false }) => {


    if (!isAuthenticated) {
      return (
        <div className={`flex ${isMobile ? "flex-col gap-3" : "gap-1"}`}>
          <Link
            to="/register"
            className={`bg-green-600 text-gray-800 text-sm hover:opacity-90 active:scale-95 transition-all ${isMobile ? "w-full h-11 flex items-center justify-center" : "hidden lg:flex w-20 h-11 rounded-full items-center justify-center"
              }`}
          >
            Register
          </Link>
          <Link
            to="/login"
            className={`bg-sky-400 text-gray-800 text-sm hover:opacity-90 active:scale-95 transition-all ${isMobile ? "w-full h-11 flex items-center justify-center" : "hidden lg:flex w-20 h-11 rounded-full items-center justify-center"
              }`}
          >
            Login
          </Link>
        </div>
      );
    }

    return (
      <div className={`flex ${isMobile ? "flex-col gap-3" : "gap-2"} items-center`}>
        {isAdmin && (
          <Link
            to="/admin"
            className={`bg-green-600 text-gray-800 text-sm hover:opacity-90 active:scale-95 transition-all ${isMobile ? "w-full h-11 flex items-center justify-center" : "hidden lg:flex w-20 h-11 rounded-full items-center justify-center"
              }`}
          >
            Admin Dashboard
          </Link>
        )}
        {!isAdmin && user && (
          <p className="flex items-center gap-2 text-sm ">
            Welcome, {user.username}!
            <span className="hover:text-green-600">
              <Link to={'/shoppingCart'}><ShoppingCartIcon /></Link>
            </span>

          </p>
        )}
        <button
          onClick={()=>{logout(),Navigate('/')}}
          className={`bg-sky-400 text-gray-800 text-sm hover:opacity-90 active:scale-95 transition-all ${isMobile ? "w-full h-11 flex items-center justify-center" : "hidden lg:flex w-20 h-11 rounded-full items-center justify-center"
            }`}
        >
          LOGOUT
        </button>
      </div>
    );
  };

  return (
    <nav className="h-[100px] sticky top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 shadow-xl transition-all bg-amber-50">
      {/* Logo */}
      <Link to="/">
        <h1 className="font-bold text-2xl text-green-500">Elibrary</h1>
      </Link>

      {/* Desktop Menu */}
      <ul className="text-black md:flex hidden items-center gap-10">
        <li>
          <Link className="hover:text-green-400 transition" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="hover:text-green-400 transition" to="/allBooks">
            All Books
          </Link>
        </li>
        <li>
          <Link className="hover:text-green-400 transition" to="/portfolio">
            Portfolio
          </Link>
        </li>
        <li>
          <Link className="hover:text-green-400 transition" to="/pricing">
            Pricing
          </Link>
        </li>
      </ul>

      {/* Desktop User Section */}
      <UserMenu />

      {/* Mobile Menu Button */}
      <button
        aria-label="menu-btn"
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="menu-btn inline-block md:hidden active:scale-90 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="black"
          viewBox="0 0 24 24"
        >
          <path d="M3 6h18M3 12h18M3 18h18" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu absolute top-[70px] left-0 w-full p-6 md:hidden bg-amber-50">
          <ul className="flex flex-col space-y-4 text-black text-lg">
            <li>
              <Link to="/" className="text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-sm">
                Services
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="text-sm">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-sm">
                Pricing
              </Link>
            </li>
          </ul>

          {/* Mobile User Section */}
          <div className="mt-6">
            <UserMenu isMobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
}
