import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate, getCookie } from '../utils';
import Loader from '../components/Loader';

const Profile = () => {
  const navigate = useNavigate(); 
  const [profileData, setProfileData] = useState({
    phone: '',
    dob: '',
    city: '',
    about: '',
    profile_pic: ''
  });

  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileData({ ...profileData, profile_pic: e.target.files[0] });
  };

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setLoading(true); 
      try {
          const accessToken = getCookie('access_token');

          if (!profileData.id) {
              const createResponse = await axios.post('http://localhost:8080/api/profile', profileData, {
                  headers: {
                      'x-auth-token': accessToken,
                      'Content-Type': 'multipart/form-data'
                  }
              });
              toast.success('Profile created successfully!');
              setProfileData(createResponse.data);
              refreshProfileData();
              setLoading(false);
          }

          const updateResponse = await axios.put(`http://localhost:8080/api/profile/${profileData.id}`, profileData, {
              headers: {
                  'x-auth-token': accessToken,
                  'Content-Type': 'multipart/form-data'
              }
          });
          toast.success('Profile updated successfully!');
          console.log(updateResponse.data);
          refreshProfileData();
          setLoading(false);
      } catch (error) {
          toast.error(error.response.data);
          console.error('Error updating profile:', error);
      }
  };

  useEffect(() => {
    if (currentUser) {
        const fetchProfileData = async () => {
            try {
              const response = await axios.get(`http://localhost:8080/api/profile/${currentUser.id}`);
              response.data.dob = formatDate(response.data.dob);
              setProfileData(response.data);
            } catch (error) {
              console.error('Error fetching profile data:', error);
            }
          };
          fetchProfileData();
        }
  }, [currentUser]);

  const refreshProfileData = () => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile/${currentUser.id}`);
        response.data.dob = formatDate(response.data.dob);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className='content-container'>
      {loading && <Loader />} 
      {!loading && (
        <div className="profile-container">
          <div className="profile-form-container">
            <h1>Profile</h1>
            <h3>Hii <span style={{color: 'blue', textTransform: 'capitalize'}}>{currentUser?.username}</span>, Update your profile</h3>
            <div className="profile-form-card">
                <form>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                        type="tel"
                        id="phone"
                        name='phone'
                        value={profileData.phone} 
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth:</label>
                        <input
                        type="date"
                        id="dob"
                        name='dob'
                        value={profileData.dob} 
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input
                        type="text"
                        id="city"
                        name='city'
                        value={profileData.city} 
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="about">About:</label>
                        <textarea 
                            name="about" 
                            value={profileData.about} 
                            onChange={handleChange} 
                            rows={5}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile_pic">Profile Picture:</label>
                        <input
                        type="file"
                        id="profile_pic"
                        name="profile_pic"
                        onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit" onClick={handleUpdateProfile}>Update</button>
                </form>
                <ToastContainer />
            </div>
          </div>
          <div className="profile-image-container">
            {profileData.profile_pic && (
              <img
              src={`http://localhost:8080/uploads/${profileData.profile_pic}`}
              alt="Profile Picture"
              className='profile-image'
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile