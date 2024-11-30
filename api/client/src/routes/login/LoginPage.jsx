import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { login } = useAuth();

  // Simulate the login success by setting mock token and user data
  const handleLoginSuccess = async (response) => {
    try {
      // Mock user data
      const mockUserData = {
        id: "mockUserId",
        name: "Mock User",
        email: "mockuser@example.com",
        picture: "https://example.com/mockuser.jpg"
      };

      const mockToken = "mockAccessToken"; // Mock access token

      // Simulate login by setting mock data in context (bypassing backend call)
      login({ token: mockToken, user: mockUserData });

      console.log("Simulated token: ", mockToken);
      window.location.href = '/';  // Redirect to the homepage or dashboard
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLoginSuccessAsManager = async (response) => {
    try {
      // Mock manager user data
      const mockManagerData = {
        id: "mockManagerId",
        name: "Mock Manager",
        email: "mockmanager@example.com",
        role: "Manager",
        picture: "https://example.com/mockmanager.jpg"
      };

      const mockToken = "mockManagerAccessToken"; // Mock access token for manager

      // Simulate login for manager by setting mock data in context (bypassing backend call)
      login({ token: mockToken, user: mockManagerData });

      console.log("Simulated manager token: ", mockToken);
      window.location.href = '/';  // Redirect to the homepage or dashboard
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
        <h2>As Manager</h2>
        <GoogleLogin 
          onSuccess={handleLoginSuccessAsManager} 
          onError={handleLoginFailure} // Now this will work because it's defined
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
