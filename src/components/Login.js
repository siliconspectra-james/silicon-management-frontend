import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useAuth } from './AuthContext';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authState, setAuthInfo } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Login Mounted. Auth state:", authState.isAuthenticated);
    // Temporary removal of auto-redirect logic for testing
  }, [authState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdv7pXR1-C5G_Rk9XACk33lMii0fuCf9Y', { email, password, returnSecureToken: true });
      console.log('login: ', response.data);

      localStorage.setItem("userToken", response.data.idToken);
      localStorage.setItem("uid", response.data.localId);
      console.log(response.data.idToken)
      console.log(response.data.localId)
      // Decode the idToken
      const decodedToken = jwtDecode(response.data.idToken);
      const isAdmin = decodedToken?.admin == true;
      localStorage.setItem('isAdmin', isAdmin)
      console.log(response.data.isAdmin)
      setAuthInfo({ isAdmin: decodedToken?.admin == true });
      navigate('/user', { replace: true });
    } catch (error) {
      setError('Login failed. Invalid email or password.');
    }
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input 
              fluid 
              icon='user' 
              iconPosition='left' 
              placeholder='E-mail address' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <Button color='teal' fluid size='large'>
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Login;