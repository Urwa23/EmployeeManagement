import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook to access the logout function
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting to the login page
import { useTimer } from '../../context/TimerContext'; // Import the TimerContext
import './navbar.scss';

function Navbar() {
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Hook to navigate to different routes
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.user?.id;

  // Access timer state and functions from TimerContext
  const { timer, isTimerRunning, isPauseTimerRunning, pauseTime, toggleTimer, resetTimer } = useTimer();

  // Logout function to handle logging out the user
  const handleLogout = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userId = currentUser?.user?.id;

    // Send a POST request to logout and pass the userId
    await fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure content-type is application/json
      },
      body: JSON.stringify({ userId }), // Send userId in the body of the request
      credentials: 'include', // Include cookies for session management if needed
    });

    // Clear user data and navigate to login page
    logout(); // Clear context or state
    navigate('/login'); // Redirect to login page after logout
  };

  // Function to format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <nav>
        <div className='first-container'>
          <p className='title'>Time Tracker</p>
        </div>

        <div className='second-container'>
          {/* Timer Display */}
          <div className="timer">
            <span className='working_timer'>Working Timer: {formatTime(timer)}</span>
            {isPauseTimerRunning && <span className='pause_timer'> (Pause Timer: {formatTime(pauseTime)})</span>}
          </div>

          {/* Timer control buttons */}
          <div className="timer-controls">
            <button onClick={toggleTimer}>
              {isTimerRunning ? 'Pause Working Timer' : isPauseTimerRunning ? 'Resume Working Timer' : 'Start Working Timer'}
            </button>
            {/* <button onClick={resetTimer}>Reset Timer</button> */}
          </div>

          <input type="text" value={currentUser?.user?.email} />

          {/* Add the Logout button in the navbar */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
