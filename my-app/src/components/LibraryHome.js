import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lib home.css";


const LibraryHome = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    

    // Handle search and navigate to results page
    const handleSearch = () => {
        localStorage.setItem('searchQuery', query);
        
        if (query.length > 0) {
            navigate(`/search-results?query=${query}`);

            
            
        }
    };

    return (
        <div>
            <header>
                <div className="header-content">
                    <h1>Welcome to ACGCET Library</h1>
                    <h3 className="department">Department of EEE</h3>
                </div>
            </header>

            <nav>
                <ul>
                    <li><a href="/LibraryHome">Home</a></li>
                    <li><a href="/LibLogin">Login</a></li>
                    <li><a href="/LibraryRegistration">Register</a></li>
                    
                    <li><a href="#">About Us</a></li>
                </ul>
            </nav>

            <section className="homesearch-section">
                <input
                    type="text"
                    placeholder="Search for books, authors, subjects..."
                    className="homesearch-bar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch} className="homesearch-btn">Search</button>
            </section>

            <footer className="homefooter">
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LibraryHome;
