import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './staff profile.css';

const StaffProfile = () => {
    const [profile, setProfile] = useState(null);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const staffid = queryParams.get('staffid');

        if (!staffid) {
            setErrorMessage("Missing staffId in query parameters");
            setLoading(false);
            return;
        }

        const fetchProfileAndBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/staffProfile?staffid=${staffid}`);
                setProfile(response.data.staff);
                setBooks(response.data.books);
            } catch (error) {
                setErrorMessage("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const fetchSelectedBook = () => {
            const storedBook = localStorage.getItem('selectedBook');
            if (storedBook) {
                try {
                    const bookObj = JSON.parse(storedBook);
                    setSelectedBook(bookObj);
                    setIsModalOpen(true);
                } catch (error) {
                    console.error("Error parsing selected book from localStorage:", error);
                }
            }
        };

        fetchProfileAndBooks();
        fetchSelectedBook();
    }, [location.search]);

    const handleBorrowRequest = () => {
        if (!selectedBook || !profile) {
            console.error("Missing book or user data.");
            return;
        }

        const requestData = {
            userId: profile.staffid,
            bookId: selectedBook.book_id,
            bookName: selectedBook.name.trim() || "Unknown Book",
            borrowerType: "staff",
        };

        axios.post('http://localhost:5000/api/borrowRequest', requestData)
            .then(response => console.log('Borrow request sent', response.data))
            .catch(error => console.error('Error sending borrow request', error))
            .finally(() => setIsModalOpen(false));
    };

    const handleLogout = () => {
        localStorage.removeItem('selectedBook');
        navigate("/LibLogin");
    };

    const handleSearch = () => {
        localStorage.setItem('searchQuery', query);
        if (query.length > 0) {
            navigate(`/profile-search-results?query=${query}&userId=${profile?.staffid}&borrowerType=staff`,{ state: { profile } });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
        <div>
            <header>
                <div className="header-content">
                    <h1>ACGCET LIBRARY</h1>
                    <h3 className="department">Department of EEE</h3>
                </div>
            </header>

            <nav>
                <ul>
                    
                    <li><a href="LibLogin" onClick={handleLogout}>Logout</a></li>
                </ul>
            </nav>

            <section className="staffprofile-section">
                <div className="staffprofile-header">
                    <h2>{profile?.name?.toUpperCase()}</h2>
                </div>
                <div className="staffprofile-details">
                    <p><strong>Staff ID:</strong> {profile?.staffid || "N/A"}</p>
                    
                </div>

                <section className="staffprofilesearch-section">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books..."
                        className="staffprofilesearch-bar"
                    />
                    <button onClick={handleSearch} className="staffprofilesearch-btn">Search</button>
                </section>

                <table className='stafftable'>
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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Borrow Book Request"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <div className="modal-body">
                    <p>Do you want to borrow the book "{selectedBook?.name}"?</p>
                </div>
                <div className="modal-footer">
                    <button onClick={handleBorrowRequest} className="confirm-btn">Yes</button>
                    <button onClick={() => setIsModalOpen(false)} className="cancel-btn">No</button>
                </div>
            </Modal>
        </div>
    );
};

export default StaffProfile;
