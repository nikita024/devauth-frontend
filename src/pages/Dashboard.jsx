import { useContext, useEffect , useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Piechart from "./Piechart";
import axios from "axios";
import "../style.css";
import UserAvatar from "../components/UserAvatar";
import CountBox from "../components/CountBox";

const Dashboard = () => {
  const navigate = useNavigate(); 
  const { currentUser, validateToken, showSessionTimeoutModal, handleSessionTimeoutModal } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [adminCount, setAdminCount]= useState(0);
  const [profile, setProfiles] = useState([]);
  const [profilesCount, setProfilesCount] = useState(0);
  const [ltdUsers, setLtdUsers] = useState([]);

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users`);
      const data = res.data;
      console.log(data)
      setUsers(data);
      const ltdUsers = data.slice(0,4);
      setLtdUsers(ltdUsers);
      setUsersCount(data.length);
      const adminUsers = data.filter((user) => user.is_admin === 1);
      console.log(adminUsers)
      setAdminCount(adminUsers.length);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/profile`);
      const data = response.data; 
      console.log(data);
      setProfiles(data);
      setProfilesCount(data.length);
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleReportButtonClick = () => {
    navigate("/reports");
  };
  

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Welcome, {currentUser?.username}</h1>
        
        <div className="count-container">
          <CountBox label="Total Users" count={usersCount} />
          <CountBox label="Admin Count" count={adminCount} />
          <CountBox label="Total Profiles" count={profilesCount} />
        </div>
        
        <div className="dashboard-content">
          <div className="pie-chart-container">
            {users && usersCount ? (
              <Piechart usersCount={usersCount} adminCount={adminCount} profileCount={profilesCount} />
            ) : null}
          </div>
          
          <div className="report-box">
            <h2>Reports</h2>
            <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>isAdmin</th>
                  </tr>
              </thead>
              <tbody>
                  {ltdUsers.map((user) => (
                      <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <UserAvatar username={user.username} profilePicture={user.profilePicture} />
                              <span style={{ marginLeft: "10px" }}>{user.username}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.is_admin ? "Yes" : "No"}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {currentUser?.is_admin ?
            <button className="report-button" onClick={handleReportButtonClick}>View Reports</button>
          :null}
          </div>
        </div>
       
      </div>
      {showSessionTimeoutModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Session Timeout</h2>
            <p>Your session has timed out. Please log in again.</p>
            <button onClick={handleSessionTimeoutModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
