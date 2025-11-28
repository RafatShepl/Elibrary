import { useState, useContext, createContext } from "react";
import { useAuth } from "../auth/authContext";
import { useEffect } from "react";

const cartContext = createContext(null);

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export default function CartProvider({ children }) {
  const { setLoading, setMessage ,setError,user} = useAuth();
  const [cartData, setCartData] = useState([]);

  // =============================
  // GET CART
  // =============================
  const refreshCart = async () => {
    setLoading(true);
    try {
      setMessage("");

      const res = await fetch("http://localhost:3000/cart/", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCartData(data.data || []);
    
      } else {
        setError(data.message || "Failed to fetch cart");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if(user){
  refreshCart();
  }

}, []);
  // =============================
  // ADD TO CART
  // =============================
  const addToCart = async ( bookId, quantity ) => {

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/cart/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshCart();
        setMessage(data.message);
      } else {
        setError(data.message);
      }

      return data;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UPDATE CART
  // =============================
  const updateCart = async ( bookId, quantity ) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/cart/", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshCart();
        setMessage(data.message);
      } else {
        setError(data.message);
      }

      return data;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // DELETE FROM CART
  // =============================
  const removeFromCart = async (bookId ) => {
    ;console.log(bookId )
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/cart/${bookId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        await refreshCart();
        setMessage(data.message);
      } else {
        setError(data.message);
      }

      return data;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartData,
    refreshCart,
    addToCart,
    updateCart,
    removeFromCart,
  };

  return (
    <cartContext.Provider value={value}>
      {children}
    </cartContext.Provider>
  );
}
