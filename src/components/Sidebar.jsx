import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { Home24Regular,ArrowTrending24Regular,BookCoins24Filled} from "@fluentui/react-icons";

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
          <Home24Regular  style={{marginRight: "5px",verticalAlign: "middle"}}/> Home
          </li>
        </Link>
        <Link to={`/profile/${profileId}`}>
          <li>
          < BookCoins24Filled style={{marginRight: "5px",verticalAlign: "middle"}}/> Profile
          </li>
        </Link>
        {currentUser?.is_admin ? (
          <Link to="/reports">
            <li>
            < ArrowTrending24Regular style={{marginRight: "5px",verticalAlign: "middle"}}/> Report
            </li>
          </Link>
        ) : null}
      </ul>
    </div>
  );
};

export default Sidebar;
