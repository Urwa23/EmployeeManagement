import React, { useEffect, useState } from 'react';
import TableComponent from '../../../components/table/Table';
import apiRequest from '../../../lib/apiRequest';

function ViewAbsencesPage() {
  const [data, setData] = useState([]); // State to store fetched absence requests
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  const columns = ["From", "To", "Type", "State", "Substitute"];

  // Fetch absence requests from the backend
  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest.get('/getAbsencesRequests');
        const absences = response.data;

        // Map the fetched data to the table structure
        const formattedData = absences.map((absence) => ({
          From: new Date(absence.from).toLocaleDateString(), // Format date
          To: new Date(absence.to).toLocaleDateString(),
          Type: absence.reason,
          State: absence.status,
          Substitute: absence.substitute || "N/A", // Handle missing substitute
        }));

        setData(formattedData); // Update the data state
        setLoading(false); // Stop loading
      } catch (err) {
        
        console.error('Error fetching absence requests:', err);
        setError(err.response?.data?.message || 'Failed to fetch absences.');
        setLoading(false); // Stop loading
      }
    };

    fetchAbsences();
  }, []); // Empty dependency array to fetch data on component mount

  return (
    <div>
      <h1>Absences Overview</h1>
      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {!loading && !error && (
        <TableComponent columns={columns} data={data} />
      )}
    </div>
  );
}

export default ViewAbsencesPage;
