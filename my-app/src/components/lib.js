/*import React, { useState } from 'react';
import axios from 'axios';
import './lib login.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';

const lib = () => {
    const [activeTab, setActiveTab] = useState('Student');
    const [activeRegister, setActiveRegister] = useState(null);
    const [rollnumber, setRollnumber] = useState('');
    const [name, setName] = useState('');
    const [staffid, setStaffid] = useState('');
    const [librarianid, setLibrarianid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            const response = await axios.post('http://localhost:5000/login-student', { rollnumber });
            if (response.data.success) {
                navigate(`/profile?userId=${response.data.userId}&borrowerType=student`);
            } else {
                setError('Invalid roll number or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
        }
        setLoading(false);
    };

    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login-staff', { name, staffid });
            if (response.data.success) {
                navigate(`/StaffProfile?userId=${response.data.userId}&borrowerType=staff`);
            } else {
                setError('Invalid staff credentials or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
        }
        setLoading(false);
    };

    const handleLibrarianLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login-librarian', { librarianid, password });
            if (response.data.success) {
                navigate(`/LibrarianDashboard?userId=${response.data.userId}&borrowerType=librarian`);
            } else {
                setError('Invalid librarian credentials or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
        }
        setLoading(false);
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
                    <li><a href="/lib">Login</a></li>
                    <li><a href="/LibraryRegistration">Register</a></li>
                    <li><a href="/lib-advance.html">Advanced search</a></li>
                    <li><a href="#">Add a Book</a></li>
                    <li><a href="#">About Us</a></li>
                </ul>
            </nav>

            <section className="login-section">
                <h2>Select Login Type</h2>
                <div className="tab">
                    <button className={activeTab === 'Student' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Student')}>Student</button>
                    <button className={activeTab === 'Staff' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Staff')}>Staff</button>
                    <button className={activeTab === 'Librarian' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Librarian')}>Librarian</button>
                </div>

                {activeTab === 'Student' && (
                    <div className="tabcontent">
                        <h3>Student Login</h3>
                        <form onSubmit={handleStudentLogin}>
                            <label htmlFor="rollnumber">Roll Number:</label>
                            <input
                                type="text"
                                id="rollnumber"
                                name="rollnumber"
                                placeholder="Enter your roll number"
                                required
                                value={rollnumber}
                                onChange={(e) => setRollnumber(e.target.value)}
                            />
                            <button type="submit" disabled={loading}>Login</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                        <p className="new-user">New user? <a href="/LibraryRegistration" onClick={() => openRegisterForm('StudentRegister')}>Register here</a></p>
                    </div>
                )}

                {activeTab === 'Staff' && (
                    <div className="tabcontent">
                        <h3>Staff Login</h3>
                        <form onSubmit={handleStaffLogin}>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="staffid">Staff ID:</label>
                            <input
                                type="text"
                                id="staffid"
                                name="staffid"
                                placeholder="Enter your ID"
                                required
                                value={staffid}
                                onChange={(e) => setStaffid(e.target.value)}
                            />
                            <button type="submit" disabled={loading}>Login</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                        <p className="new-user">New user? <a href="#" onClick={() => openRegisterForm('StaffRegister')}>Register here</a></p>
                    </div>
                )}

                {activeTab === 'Librarian' && (
                    <div className="tabcontent">
                        <h3>Librarian Login</h3>
                        <form onSubmit={handleLibrarianLogin}>
                            <label htmlFor="librarianid">Librarian ID:</label>
                            <input
                                type="text"
                                id="librarianid"
                                name="librarianid"
                                placeholder="Enter your ID"
                                required
                                value={librarianid}
                                onChange={(e) => setLibrarianid(e.target.value)}
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" disabled={loading}>Login</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}
            </section>

            <footer>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default lib;
