import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';  // Import socket.io-client to listen for events

const socket = io('http://localhost:5000'); // Connect to your server

const LibrarianProfile = () => {
    const [stats, setStats] = useState({ borrowed: 0, returned: 0 });
    const [books, setBooks] = useState([]);
    const [borrowRequests, setBorrowRequests] = useState([]);  // State to hold borrow requests
    const [searchRollNumber, setSearchRollNumber] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Fetch librarian statistics and books (as you already have)
        axios.get('http://localhost:5000/librarian/stats')
            .then(response => setStats(response.data))
            .catch(error => console.error("Error fetching statistics", error));

        axios.get('http://localhost:5000/books')
            .then(response => setBooks(response.data))
            .catch(error => console.error("Error fetching books", error));

        // Listen for new borrow requests from the server
        socket.on('newBorrowRequest', (request) => {
            setBorrowRequests(prevRequests => [...prevRequests, request]);
        });

        // Cleanup the socket listener when component unmounts
        return () => {
            socket.off('newBorrowRequest');
        };
    }, []);

    const handleSearch = () => {
        if (!searchRollNumber) return;
        axios.get(`http://localhost:5000/student?rollnumber=${searchRollNumber}`)
            .then(response => setStudentDetails(response.data))
            .catch(error => console.error("Error fetching student details", error));
    };

    return (
        <div style={{ fontFamily: 'Times New Roman, Times, serif', backgroundColor: '#f4f4f4', margin: '0', padding: '0' }}>
            <header style={{ backgroundColor: '#003366', color: 'white', textAlign: 'center', padding: '10px 0' }}>
                <h1 style={{ margin: '0', fontSize: '28px' }}>ACGCET LIBRARY</h1>
                <h3 style={{ margin: '0', fontSize: '18px', color: '#cccccc' }}>Department of EEE</h3>
            </header>

            {/* Librarian Dashboard */}
            <div style={{ padding: '20px', textAlign: 'left', marginLeft: '65px' }}>
                <h2 style={{ color: '#003366' }}>Librarian Dashboard</h2>
                <p><strong>Total Books Borrowed:</strong> {stats.borrowed}</p>
                <p><strong>Total Books Returned:</strong> {stats.returned}</p>
            </div>

            {/* Borrow Requests Section */}
            <div style={{ padding: '20px', textAlign: 'left', marginLeft: '65px' }}>
                <h3>New Borrow Requests</h3>
                <table style={{ margin: '20px auto', width: '80%', borderCollapse: 'collapse', textAlign: 'center', background: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#005599', color: 'white' }}>
                            <th>Student Roll Number</th>
                            <th>Book Name</th>
                            <th>Request Time</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {borrowRequests.length > 0 ? (
                            borrowRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.userId}</td>
                                    <td>{request.bookName}</td>
                                    <td>{new Date().toLocaleString()}</td> {/* Display request time */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No new borrow requests</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Search Student Section */}
            <div style={{ padding: '20px', textAlign: 'left', marginLeft: '65px' }}>
                <h3>Search Student</h3>
                <input type="text" placeholder="Enter Roll Number" value={searchRollNumber} onChange={e => setSearchRollNumber(e.target.value)}
                    style={{ padding: '8px', width: '300px', border: '1px solid #1d1e1f', borderRadius: '4px' }} />
                <button onClick={handleSearch} style={{ padding: '10px 20px', marginLeft: '10px', backgroundColor: '#005599', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Search</button>
                {studentDetails && (
                    <div style={{ marginTop: '20px' }}>
                        <p><strong>Name:</strong> {studentDetails.name}</p>
                        <p><strong>Roll Number:</strong> {studentDetails.rollnumber}</p>
                        <p><strong>Email:</strong> {studentDetails.email}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: '#003366', color: 'white', textAlign: 'center', padding: '10px 0' }}>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LibrarianProfile;
