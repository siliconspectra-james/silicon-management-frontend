import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Segment, Loader, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function UserProfile() {
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const newip = 'http://10.0.0.79:5000/management';


  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");
      const uid = localStorage.getItem("uid");
      if (!token || !uid) {
        setIsLoading(false);
        return;
      }
      const isAdmin = localStorage.getItem("isAdmin") === 'true';
      let url = isAdmin ? `${newip}/user/admin/all` : `${newip}/user/candidate/${uid}`;

      try {
        const response = await axios.get(url, { headers: { 'auth': token } });
        let userInfoData = response.data;

        if (!userInfoData.degree) {
          userInfoData.degree = {
            bachelor: '',
            bachelorGraduate: '',
            master: '',
            masterGraduate: '',
            phd: '',
            phdGraduate: ''
          };
        }
        setEditedUserInfo(userInfoData);
        console.log(userInfoData)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load user data');
      }
      setIsLoading(false);
    };

    fetchUserInfo();
    console.log("Fetched user info:", editedUserInfo);
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
    const birthYear = editedUserInfo.candidateBirthday ? new Date(editedUserInfo.candidateBirthday).getFullYear() : currentYear;
    return Array.from({ length: currentYear - birthYear + 1 }, (_, index) => {
      const year = currentYear - index;
      return { key: year, text: year, value: year.toString()  };
    });
  };

  const handleSave = async () => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("userToken");
    try {
      await axios.put(`http://10.0.0.79:5000/management/user/candidate/${uid}`, editedUserInfo, {
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
            value={value.toString() || ''}
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
            {renderField('Name', editedUserInfo?.candidateName, 'candidateName')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Marketing Name', editedUserInfo?.candidateMarketingName, 'candidateMarketingEmail')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Gender', editedUserInfo?.candidateGender, 'candidateGender')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Birthday', editedUserInfo?.candidateBirthday, 'candidateBirthday', 'date')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Phone Number', editedUserInfo?.candidatePhoneNumber, 'candidatePhoneNumber')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Market Phone Number', editedUserInfo?.candidateMarketingPhoneNumber, 'candidateMarketingPhoneNumber')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Linkedin', editedUserInfo?.candidateLinkedin, 'candidateLinkedin')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Location', editedUserInfo?.candidateLocation, 'candidateLocation')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Email', editedUserInfo?.candidateEmail, 'candidateEmail')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Market Email', editedUserInfo?.candidateMarketingEmail, 'candidateMarketingEmail')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Bachelor', editedUserInfo.degree?.bachelor, 'degree.bachelor')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Bachelor Graduate Year', editedUserInfo.degree?.bachelorGraduate, 'degree.bachelorGraduate', 'year')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('Master', editedUserInfo.degree?.master, 'degree.master')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('Master Graduate Year', editedUserInfo.degree?.masterGraduate, 'degree.masterGraduate', 'year')}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            {renderField('PhD', editedUserInfo.degree?.phd, 'degree.phd')}
          </Grid.Column>
          <Grid.Column width={8}>
            {renderField('PhD Graduate Year', editedUserInfo.degree?.phdGraduate, 'degree.phdGraduate', 'year')}
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

export default UserProfile;
