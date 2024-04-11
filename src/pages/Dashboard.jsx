import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate(); 
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1>Welcome</h1>
      </div>
    </div>
  );
};

export default Dashboard;