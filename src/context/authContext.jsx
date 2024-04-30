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

  // const isValidToken = (token) => {
  //   if (!token) return false; // Token is empty or not provided

  //   // Decode the token payload
  //   const payload = JSON.parse(atob(token.split('.')[1]));

  //   // Check if token is expired by comparing the expiration time with current time
  //   return payload.exp * 1000 > Date.now(); // Multiplying by 1000 as exp is in seconds
  // };

  const login = async (inputs) => {
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", inputs, {
        withCredentials: true
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setCurrentUser(res.data);
      return res.data; 
    } catch (error) {
      console.error("Login error:", error);
      throw error; 
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

  // useEffect(() => {
  //   // Check token validity when currentUser changes
  //   if (currentUser && currentUser.token && !isValidToken(currentUser.token)) {
  //     // Token is invalid, log out user
  //     logout();
  //   }
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};