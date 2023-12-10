import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      // Send credentials to backend
      const response = await axios.post('your-backend-endpoint/login', { email, password });
      localStorage.setItem("userToken", response.data.token); // Store the token returned by backend
      navigate('/user');
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