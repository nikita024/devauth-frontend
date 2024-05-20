import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
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

  return (
    <div className="sidebar">
      <ul>
        <Link to="/dashboard">
          <li>
            <i className="fas fa-home"></i> Home
          </li>
        </Link>
        <Link to={`/profile/${profileId}`}>
          <li>
            <i className="fas fa-user"></i> Profile
          </li>
        </Link>
        {currentUser?.is_admin ? (
          <Link to="/reports">
            <li>
              <i className="fas fa-chart-bar"></i> Reports
            </li>
          </Link>
        ) : null}
      </ul>
    </div>
  );
};

export default Sidebar;
