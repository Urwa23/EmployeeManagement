import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import apiRequest from "../../../lib/apiRequest"; // Import Axios instance
import './addAbsencesPage.scss';
import Button from '../../../components/button/Button';

function AddAbsencesPage() {
  // State for form inputs
  const [absenceType, setAbsenceType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null); // To handle errors
  const [success, setSuccess] = useState(null); // To show success messages
  const [substitute,setSubstitue]=useState('');

  const navigate = useNavigate(); // Hook for navigating to another page

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!from || !to || !absenceType) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setError(null); // Clear errors before submission
      setSuccess(null);

      // Assume current user ID is stored in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const requesterId = currentUser?.user?.id;

      // Send data to the backend
      const response = await apiRequest.post('/requestAbsence', {
        requesterId,
        reason: absenceType,
        from, // Pass 'from' date
        to,   // Pass 'to' date
        comment, // Optional
        substitute
      });

      setSuccess('Absence request created successfully.');

      // Clear the form fields
      setAbsenceType('');
      setFrom('');
      setTo('');
      setComment('');
      setSubstitue('')

      console.log('Response:', response.data); // Log the backend response

      // Redirect to the "View Absences" page after 2 seconds
      setTimeout(() => {
        navigate('/viewAbsenses'); // Replace with your route to the "View Absences" page
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error creating absence request.');
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>Request Absence</h1>
      <form onSubmit={handleSubmit}>
        {/* Absence Type */}
        <div className="form-group">
          <label htmlFor="absenceType">Absence Type</label>
          <select 
            id="absenceType" 
            value={absenceType} 
            onChange={(e) => setAbsenceType(e.target.value)}
          >
            <option value="">Select Absence Type</option>
            <option>Business Trip</option>
            <option>Sick Leave</option>
          </select>
        </div>

        {/* From */}
        <div className="form-group">
          <label htmlFor="from">From</label>
          <input 
            id="from" 
            type="date" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)} 
          />
        </div>

        {/* To */}
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input 
            id="to" 
            type="date" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
          />
        </div>

        {/* Substitute */}
        <div className="form-group">
          <label htmlFor="substitute">Substitute</label>
          <input 
          id="substitute" 
          type="text" 
          placeholder="Employee Name"
          onChange={(e) => setSubstitue(e.target.value)} 
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
          <Button type="submit" text="Submit Absence Request" />
        </div>

        {/* Error Message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Success Message */}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
}

export default AddAbsencesPage;
