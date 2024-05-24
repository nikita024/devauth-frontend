import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../assets/image/Nikks.png";
import LogoN from "../assets/image/N.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style.css";
import UserAvatar from "./UserAvatar";

const Navbar = () => {

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout, validateToken } = useContext(AuthContext);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile`);
        const userProfiles = response.data.filter(profile => profile.uid === currentUser?.id);
        if (userProfiles.length > 0) {
          setProfileId(userProfiles[0].id);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, [currentUser?.id]);

  const openDropdown = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const user = localStorage.getItem("user");
    
     if (!currentUser && !user) {
      logout();
      navigate("/login");
    }
  }, [currentUser, logout, navigate]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/dashboard">
          <img src={LogoN} alt="" />
          {/* <img src={Logo} alt="" /> */}
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
            <button className="dropbtn" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserAvatar username={currentUser?.username} profilePicture={currentUser?.profilePicture} width={40} height={40} />
                <span style={{color: 'blue', textTransform: 'capitalize'}}>{currentUser?.username}</span> &#9660;
              </div>
            </button>
            {showDropdown && (
              <div className="dropdown-content" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                <Link to={`/profile/${profileId}`} >
                  <li className="dropdown-item">
                    Profile
                  </li>
                </Link>
                <Link onClick={logout}>
                  <li className="dropdown-item">
                    Logout
                  </li>
                </Link>
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
