import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { login } = useAuth();

  // Success callback function
  const handleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential; // Get the Google token from the response
  
      // Send the Google token to the backend
      const res = await fetch('http://localhost:5000/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),  
      });
  
      if (!res.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await res.json(); // Assume the response contains JWT token and user data
      login({ token: data.token, user: data.user });
      console.log("token: ",data.token)
      window.location.href = '/';  // Redirect to the homepage or dashboard
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLoginSuccessAsManager = async (response) => {
    try {
      const googleToken = response.credential; // Get the Google token from the response
  
      // Send the Google token to the backend
      const res = await fetch('http://localhost:5000/auth/google/callbackManager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),  
      });
  
      if (!res.ok) {
        throw new Error('Authentication failed');
      }
      // console.log("token: ",data.token)
      const data = await res.json(); // Assume the response contains JWT token and user data
      login({ token: data.token, user: data.user });
      console.log("token: ",data.token)
      window.location.href = '/'; 
      console.log("token: ",data.token)
       // Redirect to the homepage or dashboard
       // Redirect to the homepage or dashboard
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Failure callback function
  const handleLoginFailure = () => {
    alert('Login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="499461452738-0jtk5kn7ldtgm74lntbtabdl2p9c85ok.apps.googleusercontent.com">
      <div className="login-page">
        <h1>Login</h1>
        <h1>as User</h1>
        <GoogleLogin 
        
          onSuccess={handleLoginSuccess} 
          onError={handleLoginFailure} // Now this will work because it's defined
        />
        <h2>
          As Manager
        </h2>
        <GoogleLogin 
        
          onSuccess={handleLoginSuccessAsManager} 
          onError={handleLoginFailure} // Now this will work because it's defined
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
