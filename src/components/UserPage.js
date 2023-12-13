import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import UserProfile from './UserProfile';

function UserPage() {
  const [file, setFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const newip = 'http://10.0.0.79:5000/management';
  const token = localStorage.getItem("userToken");
  const uid = localStorage.getItem("uid");
  const isAdmin = localStorage.getItem("isAdmin")
  console.log(token)
  console.log('hello')



  const fetchUserInfo = async () => {
    const token = localStorage.getItem("userToken");
    const uid = localStorage.getItem("uid");
    console.log(`in fetch ${token}`)
    if (!token || !uid) return; // Ensure token and uid are available
  
    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    let url = isAdmin ? `${newip}/user/admin/all` : `${newip}/user/candidate/${uid}`;
    try {
      const response = await axios.get(url, { headers: { 'auth': token } });
      setUserInfo(isAdmin ? response.data[0] : response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async () => {
    // Logic for file upload
  };

  const handleOpenUserInfo = () => setModalOpen(true);

  const handleCloseModal = () => {
    setIsEditing(false);
    setModalOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  

  const handleUserProfileUpdate = async (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
    if (!updatedUserInfo) return;
    try {
      const uid = localStorage.getItem("uid");
      const token = localStorage.getItem("userToken");
      await axios.put(`http://10.0.0.79:5000/management/user/candidate/${uid}`, updatedUserInfo, {
        headers: { 'auth': token }
      });
      console.log("User profile updated successfully");
      await fetchUserInfo(); // Re-fetch user info
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('uid');
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '100vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em' }}>
          <Icon name="user circle" />
          <strong>User: {userInfo && userInfo.candidateName}</strong>
          <Button style={{ marginLeft: '20px' }} onClick={handleOpenUserInfo}>Profile</Button>
        </div>
        <div>
          <input type="file" style={{ marginRight: '20px' }} onChange={handleFileChange} />
          <Button onClick={handleFileUpload} primary>Upload File</Button>
          <Button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</Button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={handleCloseModal} closeOnDimmerClick={false}>
        <Modal.Header>User Profile</Modal.Header>
        <Modal.Content>
          {userInfo && (
            <UserProfile 
              userInfo={userInfo} 
              onUpdate={handleUserProfileUpdate} 
              isEditing={isEditing}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleEditToggle} color={isEditing ? 'blue' : null}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default UserPage;