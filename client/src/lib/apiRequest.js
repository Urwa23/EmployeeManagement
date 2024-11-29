import axios from "axios";

// Create an Axios instance with default configurations
const apiRequest = axios.create({
  baseURL: "https://employeemanagement-backend-bnc7.onrender.com/api", // Your backend API URL
  withCredentials: true, // Include credentials (cookies) in requests
});

// Add a request interceptor to manually set the token into cookies from localStorage
apiRequest.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (where you saved it)
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

    // If the token exists, set it in the cookie manually
    if (token) {
      // Set token in cookies (with an expiration date or session cookie)
      document.cookie = `token=${token}; path=/; SameSite=Strict`; // Sets the token as a cookie
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the Axios instance to use it in other parts of the app
export default apiRequest;
