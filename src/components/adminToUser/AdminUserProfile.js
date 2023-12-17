import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Segment, Loader, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function AdminUserProfile() {
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiEndpoint = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");
      const selectedUserId = localStorage.getItem("selectedUserId");

      if (!token || !selectedUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const endpoint = `${apiEndpoint}/user/admin/${selectedUserId}`;
        const response = await axios.get(endpoint, { headers: { 'auth': token } });
        let userInfoData = response.data;
        console.log(`what is ${response}`)

        if (!userInfoData.useruserDegree) {
          userInfoData.useruserDegree = {
            bachelor: '',
            bachelorGraduate: '',
            master: '',
            masterGraduate: '',
            phd: '',
            phdGraduate: ''
          };
        }
        setEditedUserInfo(userInfoData);
        console.log(`admin fetch single user data is : ${userInfoData}`)
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e, { name, value }) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      let updatedParent = editedUserInfo[parent];
      if (!updatedParent) {
        updatedParent = {};
      }
      setEditedUserInfo({
        ...editedUserInfo,
        [parent]: { ...updatedParent, [child]: value },
      });
    } else {
      setEditedUserInfo({ ...editedUserInfo, [name]: value });
    }
  };

  const handleDateChange = (date, name) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setEditedUserInfo({ ...editedUserInfo, [name]: formattedDate });
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const birthYear = editedUserInfo.userBirthday ? new Date(editedUserInfo.userBirthday).getFullYear() : currentYear;
    return Array.from({ length: currentYear - birthYear + 1 }, (_, index) => {
      const year = currentYear - index;
      return { key: year, text: year, value: year?.toString() };
    });
  };

  const handleSave = async () => {
    const selectedUserId = localStorage.getItem("selectedUserId");
    const token = localStorage.getItem("userToken");
    if (!selectedUserId) return;

    try {
      await axios.put(`${apiEndpoint}/user/admin/${selectedUserId}`, editedUserInfo, {
        headers: { 'auth': token }
      });
      console.log("User profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const renderField = (label, value, name, type = 'text') => {
    let dateValue = type === 'date' && value ? new Date(value) : null;

    return isEditing ? (
      type === 'date' ? (
        <Form.Field>
          <label>{label}</label>
          <DatePicker
            selected={dateValue}
            onChange={(date) => handleDateChange(date, name)}
            dateFormat="yyyy-MM-dd"
          />
        </Form.Field>
      ) : type === 'year' ? (
        <Form.Field>
          <label>{label}</label>
          <Select
            placeholder='Select Year'
            name={name}
            value={value?.toString() || ''}
            options={getYearOptions()}
            onChange={handleChange}
          />
        </Form.Field>
      ) : (
        <Form.Input
          label={label}
          name={name}
          value={value || ''}
          onChange={handleChange}
        />
      )
    ) : (
      <Segment basic>
        <strong>{label}: </strong>
        {type === 'date' ? new Date(value).toLocaleDateString() : value}
      </Segment>
    );
  };

  if (isLoading) {
    return <Loader active>Loading...</Loader>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Form>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Name', editedUserInfo?.userName, 'userName')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Marketing Name', editedUserInfo?.userMarketingName, 'userMarketingName')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Gender', editedUserInfo?.userGender, 'userGender')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Birthday', editedUserInfo?.userBirthday, 'userBirthday', 'date')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Phone Number', editedUserInfo?.userPhoneNumber, 'userPhoneNumber')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Market Phone Number', editedUserInfo?.userMarketingPhoneNumber, 'userMarketingPhoneNumber')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Linkedin', editedUserInfo?.userLinkedin, 'userLinkedin')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Location', editedUserInfo?.userLocation, 'userLocation')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Email', editedUserInfo?.userEmail, 'userEmail')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Market Email', editedUserInfo?.userMarketingEmail, 'userMarketingEmail')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Bachelor', editedUserInfo.userDegree?.bachelor, 'userDegree.bachelor')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Bachelor Graduate Year', editedUserInfo.userDegree?.bachelorGraduate, 'userDegree.bachelorGraduate', 'year')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Master', editedUserInfo.userDegree?.master, 'userDegree.master')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Master Graduate Year', editedUserInfo.userDegree?.masterGraduate, 'userDegree.masterGraduate', 'year')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('PhD', editedUserInfo.userDegree?.phd, 'userDegree.phd')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('PhD Graduate Year', editedUserInfo.userDegree?.phdGraduate, 'userDegree.phdGraduate', 'year')}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid>
                <Grid.Row>
                    <Grid.Column textAlign='right'>
                        {isEditing ? ( 
                            <Button onClick={handleSave} color='blue' style={{ marginTop: '20px' }}>Save</Button>
                        ) : (
                            <Button onClick={toggleEdit} color='green' style={{ marginTop: '20px' }}>Edit</Button>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    </Form>
  );
}

export default AdminUserProfile;
