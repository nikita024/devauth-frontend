import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { login, currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res = await login(inputs);
     if (res) {
      toast.success("Login Successfully");
      navigate("/dashboard");
    }
    } catch (err) {
      toast.error(err.response.data)
    }
  };

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const accessToken = localStorage.getItem("user");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);


  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Login</h1>
          <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSubmit}>Login</button>
          <span>
            New User? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;