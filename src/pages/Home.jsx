import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Piechart from "./Piechart";
import axios from "axios";
import HolidaysList from "./HolidaysList";

const CountBox = ({ label, count }) => {
  return (
    <div className="count-box">
      <h2>{label}</h2>
      <p>{count}</p>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, validateToken, showSessionTimeoutModal, handleSessionTimeoutModal } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [profilesCount, setProfilesCount] = useState(0);

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
      console.log(data);
      setUsers(data);
      setUsersCount(data.length);
      const adminUsers = data.filter((user) => user.is_admin === 1);
      console.log(adminUsers);
      setAdminCount(adminUsers.length);
    } catch (err) {
      console.log(err);
    }
  };

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Welcome, {currentUser?.username}</h1>
        <div className="count-container">
          <div className="count-box">
            <CountBox label="Total Users" count={usersCount} />
          </div>
          <div className="count-box">
            <CountBox label="Admin Count" count={adminCount} />
          </div>
          <div className="count-box">
            <CountBox label="Total Profiles" count={profilesCount} />
          </div>
        </div>

        <div className="dashboard-content">
          <div className="pie-chart-container">
            {users && usersCount ? <Piechart usersCount={usersCount} adminCount={adminCount} profileCount={profilesCount} /> : null}
          </div>
          <div className="holidays-box-container"> 
            <HolidaysList />
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

export default Home;
