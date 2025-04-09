import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './lib profile.css';
//import { io } from 'socket.io-client';
//const socket = io('http://localhost:5000');




const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    

    
    
    
    
    useEffect(() => {
         // Fetch user profile and borrowed books
        const fetchProfileAndBooks = async () => {
            const queryParams = new URLSearchParams(location.search);
            const userId = queryParams.get('userId');
            const borrowerType = queryParams.get('borrowerType');

            if (!userId || !borrowerType) {
                setErrorMessage("Missing userId or borrowerType in query parameters");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/profile?userId=${userId}&borrowerType=${borrowerType}`);
                setProfile(response.data.user);
                setBooks(response.data.books);
            } catch (error) {
                setErrorMessage("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        // Retrieve selected book from localStorage
        const fetchSelectedBook = () => {
            const storedBook = localStorage.getItem('selectedBook');
            if (storedBook) {
                try {
                    const bookObj = JSON.parse(storedBook);
                    setSelectedBook(bookObj);
                    setIsModalOpen(true); // Open modal when a book is selected
                } catch (error) {
                    console.error("Error parsing selected book from localStorage:", error);
                }
            }
        };

        fetchProfileAndBooks();
        fetchSelectedBook();
    }, [location.search]);
    console.log("Profile Data:", profile);
console.log("Selected Book:", selectedBook);



const handleBorrowRequest = () => {
    if (!selectedBook || !profile) {
        console.error("Missing book or user data.");
        return;
    }

    // Trim extra spaces or new lines from book name
    const bookNameClean = selectedBook.name ? selectedBook.name.trim() : "Unknown Book";
    console.log("Selected Book Data:", selectedBook);

    
    const requestData = {
        userId: profile.rollnumber,  // Use roll number as user ID
        bookId: selectedBook.book_id,  
        bookName: bookNameClean, 
        borrowerType: "student",  // Set borrower type explicitly
    };

    console.log("Sending Borrow Request:", requestData);

    axios.post('http://localhost:5000/api/borrowRequest', requestData)
        .then(response => {
            console.log('Borrow request sent', response.data);
            alert("Borrow request sent successfully!");
           // socket.emit('borrowRequest', { userId: profile.rollnumber, bookName: selectedBook.id });
        })
        .catch(error => console.error('Error sending borrow request', error))
        .finally(() => {
            setIsModalOpen(false);
        });
 
    };
    
    
    const handleLogout = () => {
        localStorage.removeItem('selectedBook'); // Clear selected books
        navigate("/LibLogin"); // Redirect to login page
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }
    const handleSearch = () => {
        localStorage.setItem('searchQuery', query);
        
        if (query.length > 0) {
            navigate(`/profile-search-results?query=${query}&userId=${profile?.rollnumber}&borrowerType=student` ,{ state: { profile } });

            
            
        }
    };
const closeModal = () => {
    setIsModalOpen(false);
    localStorage.removeItem('selectedBook');
};
    

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
                    <li><a href="lib_advance.html">Advanced search</a></li>
                    <li><a href="LibLogin" onClick={handleLogout}>Logout</a></li>
                </ul>
            </nav>

            {/* Profile Section */}
            <section className="studentprofile-section">
                <div className="studentprofile-header">
                    <h2>{profile?.name?.toUpperCase()}</h2>
                </div>
                <div className="studentprofile-details">
                    <p><strong>Roll Number:</strong> {profile?.rollnumber || "N/A"}</p>
                    <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
                    <p><strong>Academic Year:</strong> {profile?.academicyear || "N/A"}</p>
                </div>

                {/* Search Bar */}
                <section className="studentprofilesearch-section">
                <input
                   type="text"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)} // Now `setQuery` is used
                   placeholder="Search for books..."
                   className="studentprofilesearch-bar"
/>
                    <button 
                type="submit" 
                className="studentprofilesearch-btn"
                onClick={handleSearch}>Search</button>
                </section>

                {/* Borrowed Books Section */}
              <table className='studenttable'>
                    <thead>
                        <tr>
                            <th>Book Name</th>
                            <th>Book ID</th>
                            <th>Borrow Date</th>
                            <th>Author Name</th>
                            <th>Return Date</th>
                            <th>Return Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.bookName}</td>
                                    <td>{book.bookId}</td>
                                    <td>{book.borrowDate || "N/A"}</td>
                                    <td>{book.authorName || "N/A"}</td>
                                    <td>{book.returnDate || "N/A"}</td>
                                    <td>{book.returnStatus || "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No borrowed books found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* Modal for Borrow Request */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Borrow Book Request"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                
                
                   {/* <button onClick={() => setIsModalOpen(false)} className="close-btn">X</button>*/}
                
                <div className="modal-body">
                    <p>Do you want to borrow the book "{selectedBook?.name}"?</p>
                </div>
                <div className="modal-footer">
                <button onClick={() => handleBorrowRequest(selectedBook?.id, profile?.id,selectedBook?.bookName, profile?.borrowerType)} className="confirm-btn">Yes</button>

                <button onClick={closeModal} className="cancel-btn">No</button>

                </div>
            </Modal>
        </div>
    );
};

export default StudentProfile;

 
