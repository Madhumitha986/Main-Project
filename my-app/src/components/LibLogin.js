import React, { useState } from 'react';
import axios from 'axios';
import './lib login.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';



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

    

    // Function to switch to the login form
    const openForm = (loginType) => {
        setActiveTab(loginType);
        setActiveRegister(null);
        setError('');
    };

    // Function to open the register form
    const openRegisterForm = (registerType) => {
        setActiveRegister(registerType);
        setError('');
    };

    // Handle student login
    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login-student', { rollnumber });
            console.log(response.data.success); // Log response for debugging

            // Redirect or display success message
            //if (response.data.success) {
                if (response.data.success) {
                    console.log("reached");
                    const selectedBookId = localStorage.getItem('selectedBookId');
                    navigate(`/profile?userId=${response.data.userId}&borrowerType=student`);
                }
                
        
            
            else {
                setError('Invalid roll number or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
            console.error(':', error);
        }
        setLoading(true);
    };

    // Handle staff login
    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('reched')
            const response = await axios.post('http://localhost:5000/login-staff', { name, staffid });
            console.log(response.data); // Log response for debugging
            

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
    // Handle librarian login
    const handleLibrarianLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log("reached try block");
            console.log(username);
            const response = await axios.post('http://localhost:5000/login-librarian', { username,password });
            console.log(response.data.success); // Log response for debugging

            // Redirect or display success message
            //if (response.data.success) {
                if (response.data.success) {
                    console.log("reached");
                    navigate(`/librarianProfile`);
                }
                
            else {
                setError('Invalid password  or login failed');
            }
        } catch (error) {
            setError('Error connecting to server. Please try again.');
            console.error(':', error);
        }
        setLoading(false);
    };


    return (
        <div>
            {/* Header Section */}
            <header>
                <div className="header-content">
                    <h1>Welcome to ACGCET Library</h1>
                    <h3 className="department">Department of EEE</h3>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav>
                <ul>
                    <li><a href="LibraryHome">Home</a></li>
                    <li><a href="LibLogin">Login</a></li>
                    <li><a href="LibraryRegistration">Register</a></li>
                    <li><a href="lib-advance.html">Advanced search</a></li>
                    <li><a href="#">Add a Book</a></li>
                    <li><a href="#">About Us</a></li>
                </ul>
            </nav>

            {/* Login Form Section */}
            <section className="login-section">
                <h2>Select Login Type</h2>

                {/* Login Tabs */}
                <div className="tab">
                    <button className={activeTab === 'Student' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Student')}>Student</button>
                    <button className={activeTab === 'Staff' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Staff')}>Staff</button>
                    <button className={activeTab === 'Librarian' ? 'tablinks active' : 'tablinks'} onClick={() => openForm('Librarian')}>Librarian</button>
                </div>

                {/* Conditional Rendering for Each Tab Content */}
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
                        <p className="new-user">New user? <a href="LibraryRegistration" onClick={() => openRegisterForm('StudentRegister')}>Register here</a></p>
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
                                onChange={(e) => setname(e.target.value)} 
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
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} 
                            /> 
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button type="submit" disabled={loading}>Login</button>
                        </form>
                        <p className="new-user">New user? <a href="#" onClick={() => openRegisterForm('LibrarianRegister')}>Register here</a></p>
                    </div>
                )}
            </section>

            {/* Register Forms Section */}
            {activeRegister && (
                <section className="register-section">
                    {/* Registration forms for Student, Staff, Librarian */}
                </section>
            )}

            {/* Footer Section */}
            <footer>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LibLogin;
