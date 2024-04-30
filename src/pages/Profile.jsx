import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate } from '../utils';
import Loader from '../components/Loader';

const Profile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate(); 
  const [currentProfileId, setCurrentProfileId] = useState(null);
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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile`);
        const userProfiles = response.data.filter(profile => profile.uid === currentUser?.id);
        if (userProfiles.length > 0) {
          setCurrentProfileId(userProfiles[0].id);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, [currentUser?.id]);

  useEffect(() => {
    console.log(currentProfileId, profileId);
    if (currentProfileId === null && profileId === 'null') {
      navigate("/profile/create");
    }

    if (currentProfileId !== null && profileId !== 'null' && currentProfileId !== profileId) {
      navigate(`/profile/${currentProfileId}`);
    }
  }, [currentProfileId, profileId, navigate]);


  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setLoading(false); 
      try {
        const updateResponse = await axios.put(`http://localhost:8080/api/profile/${profileData.id}`, profileData, {
          headers: {
            'x-auth-token': currentUser.token,
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
    if (currentUser && profileId) {
        const fetchProfileData = async () => {
            try {
              const response = await axios.get(`http://localhost:8080/api/profile/${profileId}`);
              response.data.dob = formatDate(response.data.dob);
              setProfileData(response.data);
            } catch (error) {
              console.error('Error fetching profile data:', error);
            }
          };
          fetchProfileData();
        }
  }, [currentUser, profileId]);

  const refreshProfileData = () => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile/${profileId}`);
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
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, profileId, navigate]);

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
                        <label htmlFor="email">Email:</label>
                        <input
                          type="email" 
                          id="email" 
                          name="email" 
                          value={profileData?.email ? profileData?.email : currentUser?.email} 
                          placeholder="Enter your email" 
                          onChange={handleChange} 
                        />
                    </div>
                  {/* <div className="input-container" style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={profileData?.email ? profileData?.email : currentUser?.email} 
                      placeholder="Enter your email" 
                      onChange={handleChange}  
                      style={{ paddingRight: '15px' }} 
                    />
                      <i
                        className="fas fa-edit edit-icon"
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      ></i>
                  </div> */}
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
