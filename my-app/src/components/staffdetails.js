// src/components/StaffDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function StaffDetails() {
  const { staffid } = useParams();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendUrl}/api/searchstaff/${staffid}`)
      .then(response => {
        setStaffData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching staff data:', error);
        setError('Failed to fetch staff details.');
        setLoading(false);
      });
  }, [staffid]);

  const handleLogout = () => {
    navigate('/Liblogin');
  };

  const goBackToProfile = () => {
    navigate('/librarianProfile');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Staff Details</h2>
        <div>
          <button
            onClick={goBackToProfile}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Back to profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Staff Personal Info */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
        <p><strong>Name:</strong> {staffData.name}</p>
        <p><strong>Staff ID:</strong> {staffData.staffid}</p>
        <p><strong>Contact Number:</strong> {staffData.contactnumber}</p>
      </div>

      {/* Borrowed Books Table */}
      <h3>Borrowed Books</h3>
      {staffData.borrowDetails.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Book ID</th>
              <th>Approved Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Bero No</th>
              <th>Position</th>
              <th>Row No</th>
            </tr>
          </thead>
          <tbody>
            {staffData.borrowDetails.map((book, index) => (
              <tr key={index}>
                <td>{book.book_name}</td>
                <td>{book.book_id}</td>
                <td>{book.approved_date ? book.approved_date.split('T')[0] : 'N/A'}</td>
                <td>{book.return_date ? book.return_date.split('T')[0] : 'N/A'}</td>
                <td>{book.return_status}</td>
                <td>{book.bero_no}</td>
                <td>{book.position}</td>
                <td>{book.row_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No borrowed books found.</p>
      )}
    </div>
  );
}

export default StaffDetails;
