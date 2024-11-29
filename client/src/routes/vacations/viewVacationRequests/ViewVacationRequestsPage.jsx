import React, { useEffect, useState } from 'react';
import './viewVacationRequestsPage.scss';
import TableComponent from '../../../components/table/Table';
import apiRequest from '../../../lib/apiRequest';

function ViewVacationRequestsPage() {
  const [data, setData] = useState([]); // State to store vacation requests
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  const columns = ["From", "To", "Type", "State"];

  // Fetch vacation requests from the backend
  useEffect(() => {
    const fetchVacationRequests = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest.get('/getVacationRequests');
        const vacationRequests = response.data;

        // Map the fetched data to the table structure
        const formattedData = vacationRequests.map((request) => ({
          From: new Date(request.from).toLocaleDateString(), // Format 'from' date
          To: new Date(request.to).toLocaleDateString(), // Format 'to' date
          Type: "Vacation", // Fixed value for vacation type
          State: request.status, // Use the status from the backend
        }));

        setData(formattedData); // Update the data state
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Error fetching vacation requests:', err);
        setError(err.response?.data?.message || 'Failed to fetch vacation requests.');
        setLoading(false); // Stop loading
      }
    };

    fetchVacationRequests();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <h1>Vacation Overview</h1>
      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {!loading && !error && (
        <TableComponent columns={columns} data={data} /> 
      )}
    </div>
  );
}

export default ViewVacationRequestsPage;
