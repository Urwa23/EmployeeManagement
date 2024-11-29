import React, { useState, useContext } from 'react';
import './addvacationPage.scss';
import Button from '../../../components/button/Button';
import { AuthContext } from "../../../context/AuthContext.jsx";
import apiRequest from '../../../lib/apiRequest.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function AddVacationPage() {
  // State to store form data
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the from and to dates
    if (new Date(fromDate) >= new Date(toDate)) {
      alert("'From' date should be earlier than 'To' date.");
      return;
    }

    // Prepare data to be sent to the backend
    const requestData = {
      requesterId: currentUser.user.id, // You can fetch the logged-in user's ID from context or state
      from: fromDate,
      to: toDate,
      status: 'PENDING', // Default status or use user input if applicable
      comment,
    };

    // Set loading state to true while submitting
    setLoading(true);

    try {
      // Use the Axios instance to make the request
      const response = await apiRequest.post('/requestVacation', requestData);

      // Handle the response (e.g., show a success message)
      console.log('Vacation Request Created:', response.data);
      // alert('Vacation request submitted successfully!');
      
      // Optionally reset the form
      setFromDate('');
      setToDate('');
      setComment('');

      // Redirect to the "/viewVacations" page after successful submission
      navigate('/viewVacations');  // Use navigate to redirect

    } catch (error) {
      console.error('Error creating vacation request:', error);
      alert('Error creating vacation request');
    } finally {
      // Set loading state to false once the request is finished
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>Request Vacation</h1>
      <form onSubmit={handleSubmit}>
        {/* From */}
        <div className="form-group">
          <label htmlFor="from">From</label>
          <input
            id="from"
            type="date"  // Changed to "date" to capture only the date part
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* To */}
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="date"  // Changed to "date" to capture only the date part
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            rows="4"
            placeholder="Max. 500 Words"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <Button type="submit" text={loading ? 'Submitting...' : 'Submit Vacation Request'} />
        </div>
      </form>
      
    
    </div>
  );
}

export default AddVacationPage;
