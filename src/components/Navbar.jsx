import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../assets/react.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/dashboard">
        <img src={Logo} alt="" />
        </Link>
      </div>
      <div className="links">
        <Link className="link" to="/dashboard">
          <h6>Home</h6>
        </Link>
        <Link className="link" to="/contact">
          <h6>Contacts</h6>
        </Link>
        {currentUser ? (
          <div className="dropdown">
            <button className="dropbtn" onClick={toggleDropdown}>
              Hi, <span style={{color: 'blue', textTransform: 'capitalize'}}>{currentUser?.username}</span> &#9660;
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <div className="user-info"> 
                  <p><Link to="/profile" style={{ textDecoration: 'none', color: '#fff', marginLeft: '10px' }}>Profile</Link></p>
                </div>
                <div className="user-info"> 
                  <p><span onClick={logout}>Logout</span></p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="login-link" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;