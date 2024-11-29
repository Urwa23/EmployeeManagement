import React, { useState } from 'react';
import './addWorkingTimePage.scss';
import Button from '../../../components/button/Button';
import apiRequest from '../../../lib/apiRequest'; // Ensure axios instance is imported

function AddWorkingTimePage() {
  const [dateOption, setDateOption] = useState('today'); // Tracks selected date option
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for date selection
  const [formData, setFormData] = useState({
    start: '',
    end: '',
    pause: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(null); // Success message state
  const [error, setError] = useState(null); // Error state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date option change and set selected date
  const handleDateOptionChange = (e) => {
    const value = e.target.value;
    setDateOption(value);

    let newDate;
    if (value === 'today') {
      newDate = new Date(); // Today's date
    } else if (value === 'yesterday') {
      newDate = new Date();
      newDate.setDate(newDate.getDate() - 1); // Yesterday's date
    } else {
      newDate = null; // Custom date will be selected
    }

    setSelectedDate(newDate); // Update selected date
  };

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate inputs
    if (!formData.start || !formData.end || !selectedDate) {
      setError('Start time, end time, and date are required.');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const requesterId = currentUser?.user?.id;

    // Prepare request data
    const requestData = {
      requesterId,
      startTime: formData.start, // Time string (e.g., "09:00")
      endTime: formData.end, // Time string (e.g., "17:00")
      pause: formData.pause,
      comment: formData.comment,
      date: selectedDate.toISOString(), // Full date sent to the backend
    };

    try {
      setLoading(true); // Show loading indicator

      // Make API call
      const response = await apiRequest.post('/createWorkingTimeRequest', requestData);

      // Success handling
      setSuccess('Working time request submitted successfully.');
      setError(null); // Clear any previous errors
      setFormData({ start: '', end: '', pause: '', comment: '' }); // Reset form
    } catch (err) {
      // Error handling
      setError('Error submitting working time request.');
      setSuccess(null); // Clear success message
      console.error(err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="add-working-time-page">
      <h1>Enter Working Time</h1>
      <form className="working-time-form" onSubmit={handleSave}>
        {/* Date Options */}
        <div className="form-group">
          <label>Date</label>
          <div className="date-options">
            <label>
              <input
                type="radio"
                name="dateOption"
                value="today"
                checked={dateOption === 'today'}
                onChange={handleDateOptionChange}
              />
              Today
            </label>
            <label>
              <input
                type="radio"
                name="dateOption"
                value="yesterday"
                checked={dateOption === 'yesterday'}
                onChange={handleDateOptionChange}
              />
              Yesterday
            </label>
            <label>
              <input
                type="radio"
                name="dateOption"
                value="selectDate"
                checked={dateOption === 'selectDate'}
                onChange={handleDateOptionChange}
              />
              Select Date
            </label>
            {dateOption === 'selectDate' && (
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            )}
          </div>
        </div>

        {/* Start Time */}
        <div className="form-group">
          <label htmlFor="start">Start</label>
          <input
            type="time"
            id="start"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
          />
        </div>

        {/* End Time */}
        <div className="form-group">
          <label htmlFor="end">End</label>
          <input
            type="time"
            id="end"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
          />
        </div>

        {/* Pause */}
        <div className="form-group">
          <label htmlFor="pause">Pause</label>
          <input
            type="text"
            id="pause"
            name="pause"
            placeholder="Format '45m' or '1h 30m' or '1.5'"
            value={formData.pause}
            onChange={handleInputChange}
          />
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Max. 500 Words"
            rows="4"
            value={formData.comment}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="form-group">
          <Button type="submit" text={loading ? 'Saving...' : 'Save'} />
        </div>

        {/* Success/Error Messages */}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddWorkingTimePage;
