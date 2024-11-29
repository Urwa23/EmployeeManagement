import React, { useState, useEffect } from 'react';
import './viewWorkingTimePage.scss';
import TableComponent from '../../../components/table/Table';
import apiRequest from '../../../lib/apiRequest'; // Import axios instance for API calls

function ViewWorkingTimePage() {
  const columns = ["Date","From", "To", "Type", "State", "Hour/Day"];
  
  const [data, setData] = useState([]); // State to hold working time requests data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch working time requests when the component is mounted
  useEffect(() => {
    const fetchWorkingTimeRequests = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest.get('/getWorkingTimeRequests'); 
        console.log(response.data)
        
        // Format data to be displayed in the table
        const formattedData = response.data.map((request) => ({
          Date:request.date.split('T')[0] ,
          From: request.startTime, // Format the start time
          To: request.endTime, // Format end time (if exists)
          Type: "Working Time", // Static type, you can adjust if needed
          State: request.status, // Assuming status is part of the response
          "Hour/Day": request.pause || "0", // Assuming pause is used to calculate hours (adjust as needed)
        }));

        setData(formattedData); // Set the formatted data
        setLoading(false); // Stop loading
      } catch (err) {
        setError('Failed to fetch working time requests'); // Set error message
        setLoading(false); // Stop loading
        console.error(err);
      }
    };

    fetchWorkingTimeRequests(); // Fetch data on mount
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h1>Working Time Overview</h1>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}
      
      {/* Show error state */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Display the data if loaded */}
      {!loading && !error && <TableComponent columns={columns} data={data} />}
    </div>
  );
}

export default ViewWorkingTimePage;
