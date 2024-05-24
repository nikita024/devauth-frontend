import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageCropper from '../components/ImageCropper';
import { v4 as uuidv4 } from 'uuid';

const CreateProfile = () => {
  const { currentUser, validateToken, showSessionTimeoutModal, handleSessionTimeoutModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState(null);
  const [profileData, setProfileData] = useState({
    phone: '',
    dob: '',
    city: '',
    about: '',
    profile_pic: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [croppingImage, setCroppingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // setProfileData({ ...profileData, profile_pic: file });
    setPreviewImage(URL.createObjectURL(file));
    setCroppingImage(true);
  };

  const handleCropComplete = async (croppedImageBlob) => {
    try {
        // Convert Blob URL to binary data
        const response = await fetch(croppedImageBlob);
        const blobData = await response.blob();

        const uniqueId = uuidv4();
        const fileExtension = croppedImageBlob.split('.').pop();
        const uniqueFileName = `${uniqueId}.${fileExtension}`;

        // Create new File object from binary data
        const binaryDataBlob = new File([blobData], uniqueFileName, { type: 'image/jpeg' });
        setProfileData({ ...profileData, profile_pic: binaryDataBlob });
        setPreviewImage(URL.createObjectURL(binaryDataBlob));
        setCroppingImage(false);
    } catch (error) {
        console.error('Error handling cropped image:', error);
    }
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
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      console.log(response.data);
      navigate(`/profile/${response.data.data.id}`);
      toast.success(response.data.message);
      setPreviewImage(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Authentication error. Please login again.');
        navigate('/login');
      } else {
          toast.error(error.response.data.error);
          // alert(error.response.data.error);
          console.error('Error updating profile:', error);
      }
    }
  };

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className='content-container'>
      <div className="profile-container">
        <div className="profile-form-container">
          <h1>Create Profile</h1>

          <div className="profile-form-card">
            <form>
              <div className="form-group">
                <label htmlFor="profile_pic">Profile Picture:</label>
                <div className="form-group-horizontal">
                  <input
                    type="file"
                    id="profile_pic"
                    name="profile_pic"
                    onChange={handleImageChange}
                  />
                  <div className="profile-preview-container">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Selected Profile"
                        className="profile-preview"
                        width={100}
                        height={100}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:<span className="required">*</span></label>
                <input
                  type="number"
                  id="phone"
                  name='phone'
                  value={profileData.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth:<span className="required">*</span></label>
                <input
                  type="date"
                  id="dob"
                  name='dob'
                  value={profileData.dob || ""}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
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
              <button type="submit" onClick={handleCreateProfile}>Create</button>
            </form>

          </div>
        </div>
      </div>

      {croppingImage && (
        <ImageCropper imageSrc={previewImage} onCropComplete={handleCropComplete} />
      )}
      
      <ToastContainer />

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
}

export default CreateProfile;
