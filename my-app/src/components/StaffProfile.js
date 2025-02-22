import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './staff profile.css';

const StaffProfile = () => {
    const [profile, setProfile] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        console.log("Location search:", location.search);
        const queryParams = new URLSearchParams(location.search);
        const staffid = queryParams.get('staffid'); // Fetching staffId from query params
        console.log("Fetched staffid:", staffid);  // Debugging line to check the value of staffid


        if (!staffid) {
            setErrorMessage("Missing staffId in query parameters");
            setLoading(false);
            return;
        }

        // Fetch staff profile and borrowed books
        axios.get(`http://localhost:5000/staffProfile?staffid=${staffid}`)
            .then(response => {
                setProfile(response.data.staff); // Expecting `staff` key from backend response
                setBooks(response.data.books);
                setLoading(false);
            })
            .catch(error => {
                setErrorMessage("Failed to load profile. Please try again later.");
                setLoading(false);
            });
    }, [location.search]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div>
            {/* Header Section */}
            <header>
                <div className="header-content">
                    <h1>ACGCET LIBRARY</h1>
                    <h3 className="department">Department of EEE</h3>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav>
                <ul>
                    <li><a href="LibraryHome">Home</a></li>
                    <li><a href="LibLogin">Logout</a></li>
                    <li><a href="LibraryRegistration">Register</a></li>
                    <li><a href="lib_advance.html">Advanced search</a></li>
                    <li><a href="#">Add a Book</a></li>
                    <li><a href="#">About Us</a></li>
                </ul>
            </nav>

            {/* Profile Section */}
            <section className="staffprofile-section">
                <div className="staffprofile-header">
                    <h2>{profile?.name?.toUpperCase()}</h2>
                </div>
                <div className="staffprofile-details">
                    <p><strong>Staff ID:</strong> {profile?.staffid || "N/A"}</p>
                    
                    <p><strong>Contact:</strong> {profile?.contactnumber || "N/A"}</p>
                </div>

                {/* Search Bar */}
                <section className="staffprofilesearch-section">
                    <input type="text" placeholder="Search for books..." className="staffprofilesearch-bar" />
                    <button type="submit" className="staffprofilesearch-btn">Search</button>
                </section>

                {/* Borrowed Books Section */}
                <section>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Book Name</th>
                                <th>Book ID</th>
                                <th>Borrow Date</th>
                                <th>Return Date</th>
                                <th>Return Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.length > 0 ? (
                                books.map((book, index) => (
                                    <tr key={book.bookId}>
                                        <td>{book.bookName}</td>
                                        <td>{book.bookId}</td>
                                        <td>{book.borrowDate || "N/A"}</td>
                                        <td>{book.returnDate || "N/A"}</td>
                                        <td>{book.returnStatus || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No borrowed books found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </section>

            {/* Footer Section */}
            <footer>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default StaffProfile;
