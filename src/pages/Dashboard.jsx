import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate(); 
  const { currentUser, validateToken, showSessionTimeoutModal, handleSessionTimeoutModal } = useContext(AuthContext);

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Welcome, {currentUser?.username}</h1>
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