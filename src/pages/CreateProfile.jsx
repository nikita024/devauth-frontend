import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState(null);
  const [profileData, setProfileData] = useState({
    phone: '',
    dob: '',
    city: '',
    about: '',
    profile_pic: ''
  });

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
          setProfileId(userProfiles[0].id);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, [currentUser?.id]);

  useEffect(() => {
    if (profileId !== null) {
      navigate(`/profile/${profileId}`);
    }
  }, [profileId, navigate]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/profile', profileData, {
        headers: {
          'x-auth-token': currentUser.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      navigate(`/profile/${response.data.data.id}`);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error creating profile');
      console.error('Error creating profile:', error);
    }
  };

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, profileId, navigate]);

  return (
    <div className='content-container'>
      <div className="profile-container">
        <div className="profile-form-container">
          <h1>Create Profile</h1>

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
              <button type="submit" onClick={handleCreateProfile}>Create</button>
            </form>

            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
