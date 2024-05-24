import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../components/Loader";
import UserAvatar from "../components/UserAvatar";
import { Edit24Regular, Delete24Regular  } from "@fluentui/react-icons"

const Reports = () => {
  const navigate = useNavigate(); 
  const { currentUser, logout, validateToken, showSessionTimeoutModal, handleSessionTimeoutModal } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", is_admin: 0 });

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/users`);
      const data = res.data;
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    } else if (!currentUser?.is_admin) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleEdit = (user) => {
    console.log("Edit clicked");
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, is_admin: user.is_admin ? 1 : 0 }); 
    setIsModalOpen(true);
  }

  const handleDelete = (user) => {
    console.log("Delete clicked");
    setSelectedUser(user)
    setIsDeleteModalOpen(true);
  }

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked ? 1 : 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  }

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${selectedUser?.id}`, formData, {
        withCredentials: true
      });
      setIsModalOpen(false);
      fetchAllUsers();
      setLoading(false);
      toast.success("User updated successfully");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Authentication error. Please login again.');
        logout();
      } else {
          toast.error(err.response.data);
          console.error('Error updating profile:', err);
      }
      setLoading(false);
    }
  }

 

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${selectedUser?.id}`, {
        withCredentials: true
      });
      setIsDeleteModalOpen(false);
      fetchAllUsers();
      setLoading(false);
      toast.success("User deleted successfully");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Authentication error. Please login again.');
        logout();
      } else {
          toast.error(err.response.data);
          console.error('Error updating profile:', err);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className="content-container">
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-container">
          <h1 style={{ textTransform: "capitalize" }}>Reports</h1>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>isAdmin</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map((user) => (
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
                          <td className="actions">
                          <Edit24Regular 
                            style={{ 
                              marginRight: "5px", 
                              verticalAlign: "middle", 
                              cursor: "pointer", 
                              backgroundColor: "blue", 
                              color: "white", 
                              padding: "5px", 
                              borderRadius: "5px", 
                            }} 
                            onClick={() => handleEdit(user)}
                          />
                          <Delete24Regular 
                            style={{ 
                              marginRight: "5px", 
                              verticalAlign: "middle", 
                              cursor: "pointer", 
                              backgroundColor: "red", 
                              color: "white", 
                              padding: "5px", 
                              borderRadius: "5px" 
                            }} 
                            onClick={() => handleDelete(user)} 
                          />
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
                <h2>Edit User</h2>
                <form onSubmit={handleEditUser}>
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} style={{ width: "95%"}} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "95%"}} />
                  </div>
                  {currentUser?.id === selectedUser?.id && currentUser?.is_admin === 1 ? (
                    <div className="form-group checkbox-group">
                      <label htmlFor="is_admin">Is Admin:</label>
                      <input 
                        type="checkbox" 
                        id="is_admin" 
                        name="is_admin" 
                        checked={formData.is_admin === 1} 
                        onChange={handleChange} 
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="form-group checkbox-group">
                      <label htmlFor="is_admin">Is Admin:</label>
                      <input 
                        type="checkbox" 
                        id="is_admin" 
                        name="is_admin" 
                        checked={formData.is_admin === 1} 
                        onChange={handleChange} 
                      />
                    </div>
                  )}
                  <div className="btn-container">
                    <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsDeleteModalOpen(false)}>
                  &times;
                </span>
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="btn-container">
                  <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  {currentUser?.id === selectedUser?.id && currentUser?.is_admin === 1 ? (
                    <button className="disabled" onClick={handleDeleteUser} disabled>Delete</button>
                  ) : (
                    <button onClick={handleDeleteUser}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )} 

    {showSessionTimeoutModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Session Timeout</h2>
          <p>Your session has timed out. Please log in again.</p>
          <button onClick={handleSessionTimeoutModal}>OK</button>
        </div>
      </div>
    )}

      <ToastContainer />
    </div>
  );
};

export default Reports;
