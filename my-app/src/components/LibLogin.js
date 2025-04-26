import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const LibLogin = () => {
    const [activeTab, setActiveTab] = useState('Student');
    const [activeRegister, setActiveRegister] = useState(null);
    const [rollnumber, setRollnumber] = useState('');
    const [name, setname] = useState('');
    const [staffid, setStaffid] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const openForm = (loginType) => {
        setActiveTab(loginType);
        setActiveRegister(null);
        setError('');
    };

    const openRegisterForm = (registerType) => {
        setActiveRegister(registerType);
        setError('');
    };

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${backendUrl}/login-student`, { rollnumber });
            if (response.data.success) {
                const selectedBookId = localStorage.getItem('selectedBookId');
                navigate(`/profile?userId=${response.data.userId}&borrowerType=student`);
            } else {
                setError('Invalid roll number or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
            console.error(':', error);
        }
        setLoading(false);
    };

    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${backendUrl}/login-staff`, { name, staffid });
            if (response.data.success) {
                navigate(`/staffProfile?staffid=${response.data.staffid}&borrowerType=staff`);
            } else {
                setError('Invalid staff credentials or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
            console.error('Login failed:', error);
        }
        setLoading(false);
    };

    const handleLibrarianLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${backendUrl}/login-librarian`, { username, password });
            if (response.data.success) {
                navigate(`/librarianProfile`);
            } else {
                setError('Invalid password or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
            console.error(':', error);
        }
        setLoading(false);
    };

    const fontStyle = { fontFamily: '"Times New Roman", serif' };

    return (
        <div style={{ ...fontStyle }}>
            <header style={{ backgroundColor: "#003366", color: "white", padding: "30px 10px", textAlign: "center" }}>
                <h1 style={{ margin: 0, fontSize: "40px", letterSpacing: "1px" }}>ACGCET | EEE Department Library</h1>
                <p style={{ fontSize: "18px", color: "#ccc", marginTop: "8px" }}>Explore. Learn. Grow.</p>
            </header>

            <nav style={{ backgroundColor: "#005599", padding: "10px", textAlign: "center" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibraryHome" style={{ color: "white", textDecoration: "none" }}>Home</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibLogin" style={{ color: "white", textDecoration: "none" }}>Login</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibraryRegistration" style={{ color: "white", textDecoration: "none" }}>Register</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/About" style={{ color: "white", textDecoration: "none" }}>About Us</a>
                    </li>
                </ul>
            </nav>

            <section style={{ padding: "30px", textAlign: "center" }}>
                <h2 style={{ fontSize: "28px" }}>Select Login Type</h2>

                <div style={{ marginBottom: "20px" }}>
                    <button style={{ ...fontStyle, padding: "10px 20px", marginRight: "10px", backgroundColor: activeTab === 'Student' ? "#005599" : "#ccc", color: activeTab === 'Student' ? "white" : "black", border: "none", cursor: "pointer" }} onClick={() => openForm('Student')}>Student</button>
                    <button style={{ ...fontStyle, padding: "10px 20px", marginRight: "10px", backgroundColor: activeTab === 'Staff' ? "#005599" : "#ccc", color: activeTab === 'Staff' ? "white" : "black", border: "none", cursor: "pointer" }} onClick={() => openForm('Staff')}>Staff</button>
                    <button style={{ ...fontStyle, padding: "10px 20px", backgroundColor: activeTab === 'Librarian' ? "#005599" : "#ccc", color: activeTab === 'Librarian' ? "white" : "black", border: "none", cursor: "pointer" }} onClick={() => openForm('Librarian')}>Librarian</button>
                </div>

                {activeTab === 'Student' && (
                    <div>
                        <h3>Student Login</h3>
                        <form onSubmit={handleStudentLogin}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="rollnumber">Roll Number:</label><br />
                                <input type="text" id="rollnumber" name="rollnumber" placeholder="Enter your roll number" required value={rollnumber} onChange={(e) => setRollnumber(e.target.value)} style={{ padding: "10px", width: "250px", fontFamily: "Times New Roman" }} />
                            </div>
                            <button type="submit" disabled={loading} style={{ padding: "10px 20px", backgroundColor: "#005599", color: "white", border: "none", cursor: "pointer" }}>Login</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <p style={{ marginTop: "10px" }}>New user? <a href="/LibraryRegistration" onClick={() => openRegisterForm('StudentRegister')}>Register here</a></p>
                    </div>
                )}

                {activeTab === 'Staff' && (
                    <div>
                        <h3>Staff Login</h3>
                        <form onSubmit={handleStaffLogin}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="name">Name:</label><br />
                                <input type="text" id="name" name="name" placeholder="Enter your name" required value={name} onChange={(e) => setname(e.target.value)} style={{ padding: "10px", width: "250px", fontFamily: "Times New Roman" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="staffid">Staff ID:</label><br />
                                <input type="text" id="staffid" name="staffid" placeholder="Enter your ID" required value={staffid} onChange={(e) => setStaffid(e.target.value)} style={{ padding: "10px", width: "250px", fontFamily: "Times New Roman" }} />
                            </div>
                            <button type="submit" disabled={loading} style={{ padding: "10px 20px", backgroundColor: "#005599", color: "white", border: "none", cursor: "pointer" }}>Login</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <p style={{ marginTop: "10px" }}>New user? <a href="#" onClick={() => openRegisterForm('StaffRegister')}>Register here</a></p>
                    </div>
                )}

                {activeTab === 'Librarian' && (
                    <div>
                        <h3>Librarian Login</h3>
                        <form onSubmit={handleLibrarianLogin}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="username">Username:</label><br />
                                <input type="text" id="username" name="username" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "10px", width: "250px", fontFamily: "Times New Roman" }} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="password">Password:</label><br />
                                <input type="password" id="password" name="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px", width: "250px", fontFamily: "Times New Roman" }} />
                            </div>
                            <button type="submit" disabled={loading} style={{ padding: "10px 20px", backgroundColor: "#005599", color: "white", border: "none", cursor: "pointer" }}>Login</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <p style={{ marginTop: "10px" }}>New user? <a href="#" onClick={() => openRegisterForm('LibrarianRegister')}>Register here</a></p>
                    </div>
                )}
            </section>

            <footer style={{ backgroundColor: "#003366", color: "white", padding: "15px 10px", textAlign: "center", marginTop: "40px" }}>
                <p style={{ margin: 0 }}>&copy; 2025 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LibLogin;
