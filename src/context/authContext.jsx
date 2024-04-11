import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { getCookie } from "../utils";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8080/api/users/login", inputs, {
      withCredentials: true
    });
    setCurrentUser(res.data);
  };
  
  const logout = async (inputs) => {
    await axios.post("http://localhost:8080/api/users/logout", null, {
      withCredentials: true
    });
    setCurrentUser(null);
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      setCurrentUser({ token: accessToken });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};