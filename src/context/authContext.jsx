import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const onStorageChange = (e) => {
      if (e.key === "user") {
        setCurrentUser(JSON.parse(e.newValue));
      } else if (e.key === "logout") {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const login = async (inputs) => {
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", inputs, {
        withCredentials: true
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setCurrentUser(res.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const logout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.setItem("logout", Date.now().toString());
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
