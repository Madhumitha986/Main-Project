import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSearchResults = () => {
    const [books, setBooks] = useState([]);
    const [selectedBorrower, setSelectedBorrower] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query");
    const { profile } = location.state || {};

    useEffect(() => {
        if (searchQuery) {
            axios.get(`http://localhost:5000/api/profile-search?query=${searchQuery}`)
                .then(response => setBooks(response.data))
                .catch(error => console.error("Error fetching books:", error));
        }
    }, [searchQuery]);

    const handleBorrowRequest = (book) => {
        if (!book || !profile) return;

        let userId, borrowerType;

        if (profile.rollnumber) {
            userId = profile.rollnumber;
            borrowerType = 'student';
        } else if (profile.staffid) {
            userId = profile.staffid;
            borrowerType = 'staff';
        } else {
            return;
        }

        const requestData = {
            userId,
            bookId: book.book_id,
            bookName: book.name.trim() || "Unknown Book",
            borrowerType
        };

        axios.post('http://localhost:5000/api/borrowRequest', requestData)
            .then(() => alert('Borrow request sent successfully!'))
            .catch(() => alert('Failed to send borrow request.'));
    };

    const fetchBorrowerDetails = async (bookId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/borrower-details/${bookId}`);
            setSelectedBorrower(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching borrower details:", error);
            alert("Could not fetch borrower details.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBorrower(null);
    };

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", minHeight: "100vh", paddingBottom: "20px" }}>
            <header style={{ backgroundColor: "#003366", color: "white", textAlign: "center", padding: "15px 0", fontSize: "22px" }}>
                <h1 style={{ margin: 0 }}>ACGCET LIBRARY</h1>
                <h3 style={{ fontSize: "18px", fontWeight: "normal" }}>Department of EEE</h3>
            </header>

            <section style={{ width: "80%", margin: "20px auto", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                <h2 style={{ textAlign: "center", fontSize: "24px" }}>Search Results for "{searchQuery}"</h2>

                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#004080", color: "white" }}>
                            <th>Book Name</th>
                            <th>Author</th>
                            <th>Book ID</th>
                            <th>Row No</th>
                            <th>Bero No</th>
                            <th>Position</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? books.map((book) => (
                            <tr key={book.book_id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td>{book.book_id}</td>
                                <td>{book.row_no}</td>
                                <td>{book.bero_no}</td>
                                <td>{book.position}</td>
                                <td style={{ color: book.availability === "Available" ? "green" : "red" }}>
                                    {book.availability}
                                </td>
                                <td>
                                    {book.availability === "Available" ? (
                                        <button
                                            onClick={() => handleBorrowRequest(book)}
                                            style={borrowButtonStyle}
                                            onMouseOver={e => e.target.style.backgroundColor = "#218838"}
                                            onMouseOut={e => e.target.style.backgroundColor = "#28a745"}
                                        >
                                            Borrow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => fetchBorrowerDetails(book.book_id)}
                                            style={detailsButtonStyle}
                                            onMouseOver={e => e.target.style.backgroundColor = "#e0a800"}
                                            onMouseOut={e => e.target.style.backgroundColor = "#ffc107"}
                                        >
                                            Click for Details
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>No books found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
    onClick={() => navigate(-1)}
    style={{
        padding: "10px 15px",
        fontSize: "16px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "#004080",
        color: "white"
    }}
    onMouseOver={e => e.target.style.backgroundColor = "#00264d"}
    onMouseOut={e => e.target.style.backgroundColor = "#004080"}
>
    Back to profile
</button>

                </div>
            </section>

            {showModal && selectedBorrower && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2>Borrower Details</h2>
                        <p><strong>Name:</strong> {selectedBorrower.name}</p>
                        <p><strong>Type:</strong> {selectedBorrower.borrower_type}</p>
                        <p><strong>Return Date:</strong> {selectedBorrower.return_date}</p>
                        <button onClick={closeModal} style={closeButton}>Close</button>
                    </div>
                </div>
            )}

            <footer style={{ textAlign: "center", padding: "15px", backgroundColor: "#003366", color: "white", fontSize: "14px", marginTop: "20px" }}>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

// Styles
const borrowButtonStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "white",
    transition: "background 0.3s"
};

const detailsButtonStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#ffc107",
    color: "black",
    transition: "background 0.3s"
};

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalContent = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
};

const closeButton = {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "#004080",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

export default ProfileSearchResults;
