import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const LibraryHome = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    localStorage.setItem("searchQuery", query);
    if (query.trim().length > 0) {
      navigate(`/search-results?query=${query}`);
    }
  };
  
  const quotes = [
    "“A room without books is like a body without a soul.” – Cicero",
    "“So many books, so little time.” – Frank Zappa",
    "“Reading is essential for those who seek to rise above the ordinary.” – Jim Rohn",
    "“Once you learn to read, you will be forever free.” – Frederick Douglass"
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedWords = [
    "🔍 Search Books",
    "📖 Borrow Books",
    "📈 Track Your Returns",
    "📡 Check Real-Time Availability"
  ];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const librarianFeatures = [
    "📊 Manage Borrow & Returns",
    "📚 Track 753 Book Records",
    "🔔 Handle Requests in Real-Time",
    "🔎 View Student/Staff Borrowed book details"
  ];
  const [featureIndex, setFeatureIndex] = useState(0);
  useEffect(() => {
    const featureTimer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % librarianFeatures.length);
    }, 2500);
    return () => clearInterval(featureTimer);
  }, []);

  const libraryDescriptions = [
    "📘 Our EEE Department Library is the hub of knowledge at ACGCET.",
    "📚 We house 700+ technical books tailored for electrical and electronics engineering.",
    "🏛️ Located centrally, the library is open from 9 AM to 5 PM on all working days.",
    "👨‍🏫 The library supports over 500 students and staff with dedicated access."
  ];
  const [libDescIndex, setLibDescIndex] = useState(0);
  useEffect(() => {
    const descTimer = setInterval(() => {
      setLibDescIndex((prev) => (prev + 1) % libraryDescriptions.length);
    }, 3000);
    return () => clearInterval(descTimer);
  }, []);

  const policyStatements = [
    "🧑‍🎓 Students and staff with valid ACGCET credentials can log in and access resources.",
    "📖 Books can be borrowed for a maximum of 90 days.",
    "⌛ No fine will be charged for late returns.",
    "🔐 Only registered users can make borrow requests."
  ];
  const [policyIndex, setPolicyIndex] = useState(0);
  useEffect(() => {
    const policyTimer = setInterval(() => {
      setPolicyIndex((prev) => (prev + 1) % policyStatements.length);
    }, 3500);
    return () => clearInterval(policyTimer);
  }, []);

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", backgroundColor: "#f4f4f4" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#003366", color: "white", padding: "30px 10px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "40px", letterSpacing: "1px" }}>ACGCET | EEE Department Library</h1>
        <p style={{ fontSize: "18px", color: "#ccc", marginTop: "8px" }}>Explore. Learn. Grow.</p>
      </header>

      {/* Navigation Bar */}
      <nav style={{ backgroundColor: "#005599", padding: "10px", textAlign: "center" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <li style={{ display: "inline", margin: "0 20px" }}><a href="/LibraryHome" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
          <li style={{ display: "inline", margin: "0 20px" }}><a href="/LibLogin" style={{ color: "white", textDecoration: "none" }}>Login</a></li>
          <li style={{ display: "inline", margin: "0 20px" }}><a href="/LibraryRegistration" style={{ color: "white", textDecoration: "none" }}>Register</a></li>
          <li style={{ display: "inline", margin: "0 20px" }}><a href="/About" style={{ color: "white", textDecoration: "none" }}>About Us</a></li>
        </ul>
      </nav>

      {/* Search Bar */}
      <section style={{ textAlign: "center", margin: "40px 0" }}>
        <input
          type="text"
          placeholder="Search for books, authors, subjects..."
          style={{ width: "400px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#005599", color: "white", border: "none", marginLeft: "10px", cursor: "pointer" }}
        >
          Search
        </button>
      </section>

      {/* Rotating Quote */}
      <div style={{ textAlign: "center", fontStyle: "italic", fontSize: "18px", color: "#333" }}>
        {quotes[quoteIndex]}
      </div>

      {/* Cards Section */}
      <section style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "50px", gap: "20px" }}>
        <div style={{ width: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h3 style={{ color: "#003366", marginBottom: "15px" }}>What You Can Do</h3>
          <p style={{ fontSize: "20px", color: "#444" }}>{animatedWords[wordIndex]}</p>
        </div>

        <div style={{ width: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h3 style={{ color: "#003366", marginBottom: "15px" }}>Librarian Features</h3>
          <p style={{ fontSize: "18px", color: "#555", minHeight: "48px" }}>{librarianFeatures[featureIndex]}</p>
        </div>
        <div style={{ width: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h3 style={{ color: "#003366", marginBottom: "15px" }}>About our Library</h3>
          <p style={{ fontSize: "18px", color: "#555", minHeight: "48px" }}>{libraryDescriptions[libDescIndex]}</p>
        </div>
        <div style={{ width: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h3 style={{ color: "#003366", marginBottom: "15px" }}>Library policies</h3>
          <p style={{ fontSize: "18px", color: "#555", minHeight: "48px" }}>{policyStatements[policyIndex]}</p>
        </div>
      </section>

     

      {/* How to Use */}
      <section style={{ margin: "60px auto", maxWidth: "800px", padding: "30px", backgroundColor: "#e0f0ff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#003366", textAlign: "center" }}>How to Use the Library</h2>
        <ol style={{ fontSize: "16px", lineHeight: "1.8", color: "#333", paddingLeft: "20px" }}>
          <li>Register your account through the registration page.</li>
          <li>Log in using your credentials.</li>
          <li>Search for books using the search bar on the homepage or dashboard.</li>
          <li>Click on a book to view details and request to borrow it.</li>
          <li>Track borrowed books and return dates from your profile.</li>
        </ol>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#003366", color: "white", textAlign: "center", padding: "10px 0" }}>
        <p>&copy; 2025 ACGCET Library. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LibraryHome;
