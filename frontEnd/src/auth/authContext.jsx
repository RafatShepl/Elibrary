import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
// Create context
const AuthContext = createContext(null);

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- VERIFY USER ---
  const verifyUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/verify", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {

        const data = await res.json();

        setUser(data.user);
        setIsAuthenticated(data.success);
        setIsAdmin(data.user?.role === "admin");
      

      } else {
         
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (err) {

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false); // mark loading complete
    }
  };

  useEffect(() => {
     if (message) {
      toast.success(message); 
    }
    if(error){
      toast.error(error)
    }
    verifyUser();
  }, [message,error]);

  // --- LOGIN ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await verifyUser();
      }

      return data;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER ---
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await verifyUser();
      }

      return data;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    message,
    setMessage,
    setError,
    isAuthenticated,
    isAdmin,
    loading,
    setLoading,
    login,
    register,
    logout,
    verifyUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
