import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

function UserPage() {
  const [file, setFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get('your-backend-endpoint/user-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserInfo(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem("userToken");
      await axios.post('your-backend-endpoint/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchData(); // Fetch the updated list
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteFile = async (fileName) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`your-backend-endpoint/delete/${fileName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchData(); // Fetch the updated list after deletion
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleFileUpload} primary>Upload File</Button>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Filename</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userInfo && userInfo.files ? (
            userInfo.files.map((file, index) => (
              <Table.Row key={index}>
                <Table.Cell>{file.name}</Table.Cell>
                <Table.Cell>
                <Button icon as="a" href={file.url} download>
                  <Icon name='download' />
                </Button>
                  <Button icon onClick={() => handleDeleteFile(file.name)}><Icon name='delete' /></Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>No files available</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default UserPage;