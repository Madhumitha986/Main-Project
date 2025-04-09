import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
    const [books, setBooks] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query");

    useEffect(() => {
        if (searchQuery) {
            console.log("here")
            axios.get(`http://localhost:5000/api/search-books?query=${searchQuery}`)
            .then(response => {
                console.log("Books from backend:", response.data);  // ADD THIS
                setBooks(response.data);
            })
                
                .catch(error => console.error("Error fetching books:", error));
        }
    }, [searchQuery]);

    const handleBorrow = (book) => {
        localStorage.setItem('selectedBook', JSON.stringify(book));  // Store the book
        console.log("Book stored in localStorage:", book);  // Debugging check
        navigate('/LibLogin');
    };

    return (
        <div style={{ 
            fontFamily: "Arial, sans-serif", 
            backgroundColor: "#f4f4f9", 
            minHeight: "100vh",
            paddingBottom: "20px"
        }}>
            {/* Header */}
            <header style={{ 
                backgroundColor: "#003366", 
                color: "white", 
                textAlign: "center", 
                padding: "15px 0", 
                fontSize: "22px" 
            }}>
                <h1 style={{ margin: 0 }}>ACGCET LIBRARY</h1>
                <h3 style={{ fontSize: "18px", fontWeight: "normal" }}>Department of EEE</h3>
            </header>

            {/* Search Results Section */}
            <section style={{ 
                width: "80%", 
                margin: "20px auto", 
                background: "white", 
                padding: "20px", 
                borderRadius: "8px", 
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" 
            }}>
                <h2 style={{ textAlign: "center", fontSize: "24px" }}>Search Results for "{searchQuery}"</h2>

                {/* Book Table */}
                <table style={{ 
                    width: "100%", 
                    borderCollapse: "collapse", 
                    marginTop: "20px", 
                    background: "white"
                }}>
                    <thead>
                        <tr style={{ backgroundColor: "#004080", color: "white" }}>
                            <th style={{ padding: "12px", textAlign: "center" }}>Book Name</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Author</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Availability</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? (
                            books.map((book) => (
                                <tr key={book.id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "12px", textAlign: "center" }}>{book.name}</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>{book.author}</td>
                                    <td style={{ 
                                        padding: "12px", 
                                        textAlign: "center", 
                                        color: book.availability === "Available" ? "green" : "red"
                                    }}>
                                        {book.availability}
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        {book.availability === "Available" ? (
                                            <button 
                                                onClick={() => handleBorrow(book)}
                                                style={{
                                                    padding: "8px 12px",
                                                    fontSize: "14px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#007bff",
                                                    color: "white",
                                                    transition: "background 0.3s"
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                                                onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                                            >
                                                {"Login to Borrow"}
                                            </button>
                                        ) : (
                                            <span>Not Available</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                                    No books found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Back to Home Button */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button 
                        onClick={() => navigate("/LibraryHome")}
                        style={{
                            padding: "10px 15px",
                            fontSize: "16px",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                            backgroundColor: "#004080",
                            color: "white",
                            transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#00264d"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#004080"}
                    >
                        Back to Home
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ 
                textAlign: "center", 
                padding: "15px", 
                backgroundColor: "#003366", 
                color: "white", 
                fontSize: "14px", 
                marginTop: "20px" 
            }}>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default SearchResults;
