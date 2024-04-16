import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8080/api/users/login", inputs, {
      withCredentials: true
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    const authToken = localStorage.getItem("user");
    console.log("authToken: ", JSON.parse(authToken));
    if (authToken) {
      setCurrentUser(JSON.parse(authToken));
    }
  };
  
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};