import React, { useState, useEffect } from 'react';
import apiRequest from '../../lib/apiRequest';
import TableComponent from '../../components/table/Table';
import "./viewRequestsPage.scss"

function ViewRequestsPage() {
  const [absenceData, setAbsenceData] = useState([]); // Absence request data state
  const [vacationData, setVacationData] = useState([]); // Vacation request data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success message state
  const [refreshRequests, setRefreshRequests] = useState(false); // State to trigger re-fetching
  const [loadingAction, setLoadingAction] = useState(null); // Loading state for approval/rejection

  const columns = ["Name", "From", "To", "Type", "State", "Hour/Day", "Action"]; // Table columns
  const currentUser = JSON.parse(localStorage.getItem('user')); // Retrieve current user from localStorage
  const userRole = currentUser?.user?.role;  // Get the user's role
  // Fetch absence and vacation requests for subordinates
  useEffect(() => {

    const fetchRequests = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiRequest.get('/getSubordinateRequests');
        const rawAbsenceData = response.data.absenceRequests;

        // Transform absence requests for the table
        const formattedAbsenceData = rawAbsenceData.map((request) => ({
          Name: request.requester.name,
          From: new Date(request.from).toLocaleDateString(), // Format date
          To: new Date(request.to).toLocaleDateString(),     // Format date
          Type: request.reason,
          State: request.status,
          "Hour/Day": "Day", // Example: Adjust as per your logic
          id: request.id, // Include ID to identify the request
        }));

        setAbsenceData(formattedAbsenceData);  // Set absence data

        const rawVacationData = response.data.vacationRequests;
        const formattedVacationData = rawVacationData.map((request) => ({
          Name: request.requester.name,
          From: new Date(request.from).toLocaleDateString(), // Format date
          To: new Date(request.to).toLocaleDateString(),     // Format date
          Type: request.reason,
          State: request.status,
          "Hour/Day": "Day", // Example: Adjust as per your logic
          id: request.id, // Include ID to identify the request
        }));

        setVacationData(formattedVacationData); // Set vacation data
        setLoading(false); // Stop loading
      } catch (err) {
        if(userRole=="USER"){
          setError('You are not a manager');
          setLoading(false);
        }
        else{
        setError('Failed to fetch requests');
        setLoading(false);
        } // Stop loading in case of error
      }
    };

    fetchRequests();
  }, [refreshRequests]); // Dependency on refreshRequests to trigger re-fetch

  // Function to handle approval/rejection of absence/vacation request
  const handleRequestStatusChange = async (id, type, status) => {
    try {
      setLoadingAction(id); // Set the loading action for specific request
      const endpoint = type === 'vacation' ? '/changeVacationRequestStatus' : '/changeAbsenceRequestStatus';
      
      // Call the backend API to update the status
      await apiRequest.post(endpoint, { id, status });

      // Update the data to reflect the new status
      const updateStatus = (data) => {
        return data.map((item) =>
          item.id === id ? { ...item, State: status } : item
        );
      };

      setAbsenceData(updateStatus(absenceData)); // Update absence data
      setVacationData(updateStatus(vacationData)); // Update vacation data

      setSuccess(`Request ${status} successfully.`); // Set success message
      setError(null); // Clear previous error

      // Trigger re-fetch after status change
      setRefreshRequests(!refreshRequests); // Toggle the refreshRequests state to trigger useEffect

      setLoadingAction(null); // Reset loading action once done
    } catch (err) {
      setError('Error updating request status.');
      setSuccess(null); // Clear success message
      setLoadingAction(null); // Reset loading action in case of error
    }
  };

  return (
    <div>
      <h1>Requests Overview</h1>
      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}

      {/* Display Absence Requests */}
      <h2>Absence Requests</h2>
      <TableComponent
  columns={columns}
  data={absenceData.map((item) => ({
    ...item,
    Action: (
      <div>
        <button 
          className="accept"
          disabled={loadingAction === item.id}
          onClick={() => handleRequestStatusChange(item.id, 'absence', 'APPROVED')}
        >
          {loadingAction === item.id ? 'Processing...' : 'Accept'}
        </button>
        <button 
          className="reject"
          disabled={loadingAction === item.id}
          onClick={() => handleRequestStatusChange(item.id, 'absence', 'REJECTED')}
        >
          {loadingAction === item.id ? 'Processing...' : 'Reject'}
        </button>
      </div>
    ),
  }))}
/>

      {/* Display Vacation Requests */}
      <h2>Vacation Requests</h2>
      <TableComponent
  columns={columns}
  data={vacationData.map((item) => ({
    ...item,
    Action: (
      <div>
        <button 
          className="accept"
          disabled={loadingAction === item.id}
          onClick={() => handleRequestStatusChange(item.id, 'vacation', 'APPROVED')}
        >
          {loadingAction === item.id ? 'Processing...' : 'Accept'}
        </button>
        <button 
          className="reject"
          disabled={loadingAction === item.id}
          onClick={() => handleRequestStatusChange(item.id, 'vacation', 'REJECTED')}
        >
          {loadingAction === item.id ? 'Processing...' : 'Reject'}
        </button>
      </div>
    ),
  }))}
/>
    </div>
  );
}

export default ViewRequestsPage;
