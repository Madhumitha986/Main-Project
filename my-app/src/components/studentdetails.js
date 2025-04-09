// src/components/studentdetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentDetails() {
  const { rollnumber } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/searchstudent/${rollnumber}`)
      .then(response => {
        setStudentData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
        setError('Failed to fetch student details.');
        setLoading(false);
      });
  }, [rollnumber]);

  const handleLogout = () => {
    // Clear localStorage/session if you're using it
    // localStorage.removeItem('studentToken');
    navigate('/Liblogin');
  };

  const goBackToProfile = () => {
    navigate('/librarianProfile'); // or the correct path to StudentProfile
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Student Details</h2>
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

      {/* Student Personal Info */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
        <p><strong>Name:</strong> {studentData.name}</p>
        <p><strong>Roll Number:</strong> {studentData.rollnumber}</p>
        <p><strong>Email:</strong> {studentData.email}</p>
        <p><strong>Contact Number:</strong> {studentData.contactnumber}</p>
        <p><strong>Academic Year:</strong> {studentData.academicyear}</p>
      </div>

      {/* Borrowed Books Table */}
      <h3>Borrowed Books</h3>
      {studentData.borrowDetails.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse',marginTop:'10px'}}>
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
            {studentData.borrowDetails.map((book, index) => (
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

export default StudentDetails;
