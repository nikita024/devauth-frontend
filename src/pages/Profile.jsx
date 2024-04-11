import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate, getCookie } from '../utils';

const Profile = () => {
  const navigate = useNavigate(); 
  const [profileData, setProfileData] = useState({
      phone: '',
      dob: '',
      city: '',
      about: ''
    });

  const { currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//         const accessToken = getCookie('access_token');
//       const response = await axios.put(`http://localhost:8080/api/profile/${profileData.id}`, profileData, {
//         headers: {
//             'x-auth-token': accessToken
//         }
//       });
//       toast.success('Profile updated successfully!');
//       console.log(response.data);
//     } catch (error) {
//       toast.error(error.response.data);
//       console.error('Error updating profile:', error);
//     }
//   };
const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        const accessToken = getCookie('access_token');

        if (!profileData.id) {
            const createResponse = await axios.post('http://localhost:8080/api/profile', profileData, {
                headers: {
                    'x-auth-token': accessToken
                }
            });
            toast.success('Profile updated successfully!');
            setProfileData(createResponse.data);
        }

        const updateResponse = await axios.put(`http://localhost:8080/api/profile/${profileData.id}`, profileData, {
            headers: {
                'x-auth-token': accessToken
            }
        });
        toast.success('Profile updated successfully!');
        console.log(updateResponse.data);
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

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className='content-container'>
        <div className="profile-container">
            <h1>Profile</h1>
            <h3>Hii <span style={{color: 'blue', textTransform: 'capitalize'}}>{currentUser?.username}</span>, Update your profile</h3>
            <div className="profile-form-card">
                <form onSubmit={handleUpdateProfile}>
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
                    <button type="submit">Update</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    </div>
  )
}

export default Profile
