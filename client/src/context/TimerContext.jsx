// src/context/TimerContext.js
import React, { createContext, useState, useContext } from "react";

// Create a context for the timer
const TimerContext = createContext();

// Timer provider to wrap the components and provide the state
export const TimerProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);  // Timer state to track working time
  const [isTimerRunning, setIsTimerRunning] = useState(false); // State to track whether working timer is running
  const [isPauseTimerRunning, setIsPauseTimerRunning] = useState(false); // State to track whether pause timer is running
  const [pauseTime, setPauseTime] = useState(0);  // State to track pause time
  const [intervalId, setIntervalId] = useState(null);  // Store interval ID to clear it later
  const [pauseStartTime, setPauseStartTime] = useState(null); // Store when pause timer started

  // Timer logic: Start, pause, or resume the timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      clearInterval(intervalId);  // Stop the current working timer interval
      setIntervalId(null);  // Clear the interval ID
      setIsTimerRunning(false);  // Mark the working timer as paused
      setIsPauseTimerRunning(true);  // Start the pause timer
      setPauseStartTime(Date.now());  // Record when the pause timer starts
    } else if (isPauseTimerRunning) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);  // Increment working timer every second
      }, 1000);
      setIntervalId(id);  // Save the interval ID to stop it later
      setIsTimerRunning(true);  // Resume the working timer
      setIsPauseTimerRunning(false);  // Stop the pause timer
      setPauseStartTime(null);  // Reset the pause start time after resuming
    } else {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);  // Increment working timer every second
      }, 1000);
      setIntervalId(id);  // Save the interval ID to stop it later
      setIsTimerRunning(true);  // Set the working timer state to "running"
    }
  };

  // Handle pause timer logic (update pauseTime)
  const updatePauseTime = () => {
    if (isPauseTimerRunning && pauseStartTime) {
      setPauseTime((prevPauseTime) => prevPauseTime + 1);
    }
  };

  // Update pause time every second
  React.useEffect(() => {
    let pauseInterval;
    if (isPauseTimerRunning && pauseStartTime) {
      pauseInterval = setInterval(updatePauseTime, 1000);
    }

    return () => clearInterval(pauseInterval);
  }, [isPauseTimerRunning, pauseStartTime]);

  // Reset all timers
  const resetTimer = () => {
    clearInterval(intervalId);  // Clear the interval
    setIsTimerRunning(false);  // Set timer state to stopped
    setIsPauseTimerRunning(false);  // Set pause timer state to stopped
    setTimer(0);  // Reset the timer
    setPauseTime(0);  // Reset the pause timer
    setIntervalId(null);  // Clear intervalId
    setPauseStartTime(null);  // Reset the pause start time
  };

  return (
    <TimerContext.Provider
      value={{
        timer,
        isTimerRunning,
        isPauseTimerRunning,
        pauseTime,
        toggleTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to access the timer context
export const useTimer = () => {
  return useContext(TimerContext);
};
