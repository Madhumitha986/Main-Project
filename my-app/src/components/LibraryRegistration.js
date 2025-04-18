import React, { useState } from 'react';
import './lib register.css'; // Ensure your CSS file is in the same folder
import axios from 'axios'; // Import axios

function LibraryRegistration() {
    const [activeTab, setActiveTab] = useState('Student');

    // State for Student registration
    const [studentData, setStudentData] = useState({
        name: '',
        rollnumber: '',
        email: '',
        contactnumber: '',
        academicyear: ''
    });

    // State for Staff registration
    const [staffData, setStaffData] = useState({
        name: '',
        staffid: '',
        contactnumber: ''
    });

    // State for Librarian registration
    const [librarianData, setLibrarianData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Handle input change for each form
    const handleInputChange = (event, formType) => {
        const { name, value } = event.target;

        if (formType === 'Student') {
            setStudentData({ ...studentData, [name]: value });
        } else if (formType === 'Staff') {
            setStaffData({ ...staffData, [name]: value });
        } else if (formType === 'Librarian') {
            setLibrarianData({ ...librarianData, [name]: value });
        }
    };

    // Submit handler for Student registration
    const handleStudentSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/register-student', studentData)
          .then(response => {
            console.log('Student registered successfully:', response.data);
            alert('Student registered successfully'); 
          })
          .catch(error => {
            console.error('Error registering student:', error);
          });
    };

    // Submit handler for Staff registration
    const handleStaffSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/register-staff', staffData)
          .then(response => {
            console.log('Staff registered successfully:', response.data);
            alert('registered successfully');
          })
          .catch(error => {
            console.error('Error registering staff:', error);
          });
    };

    // Submit handler for Librarian registration
   {/* const handleLibrarianSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/register-librarian', librarianData)
          .then(response => {
            console.log('Librarian registered successfully:', response.data);
          })
          .catch(error => {
            console.error('Error registering librarian:', error);
          });
    };*/}

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
                    {/*<li><a href="lib_advance.html">Advanced Search</a></li>
                    <li><a href="#">Add a Book</a></li>*/}
                    <li><a href="#">About Us</a></li>
                </ul>
            </nav>

            {/* Registration Form Section */}
            <section className="register-section">
                <h2>Select Registration Type</h2>

                {/* Registration Option Tabs */}
                <div className="tab">
                    <button className={`tablinks ${activeTab === 'Student' ? 'active' : ''}`} onClick={() => setActiveTab('Student')}>Student</button>
                    <button className={`tablinks ${activeTab === 'Staff' ? 'active' : ''}`} onClick={() => setActiveTab('Staff')}>Staff</button>
                    {/*<button className={`tablinks ${activeTab === 'Librarian' ? 'active' : ''}`} onClick={() => setActiveTab('Librarian')}>Librarian</button>*/}
                </div>

                {/* Student Registration Form */}
                <div className="tabcontent" style={{ display: activeTab === 'Student' ? 'block' : 'none' }}>
                    <h3>Student Registration</h3>
                    <form onSubmit={handleStudentSubmit}>
                        <label htmlFor="studentname">Name:</label>
                        <input
                            type="text"
                            id="studentname"
                            name="name"
                            placeholder="Enter your name"
                            value={studentData.name}
                            onChange={(e) => handleInputChange(e, 'Student')}
                            required
                        />
                        <label htmlFor="rollnumber">Roll Number:</label>
                        <input
                            type="text"
                            id="rollnumber"
                            name="rollnumber"
                            placeholder="Enter your roll number"
                            value={studentData.rollnumber}
                            onChange={(e) => handleInputChange(e, 'Student')}
                            required
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={studentData.email}
                            onChange={(e) => handleInputChange(e, 'Student')}
                            required
                        />
                        <label htmlFor="contactnumber">Contact Number:</label>
                        <input
                            type="text"
                            id="contactnumber"
                            name="contactnumber"
                            placeholder="Enter your contact number"
                            value={studentData.contactnumber}
                            onChange={(e) => handleInputChange(e, 'Student')}
                            required
                        />
                        <label htmlFor="academicyear">Academic Year:</label>
                        <input
                            type="text"
                            id="academicyear"
                            name="academicyear"
                            placeholder="Enter your academic year"
                            value={studentData.academicyear}
                            onChange={(e) => handleInputChange(e, 'Student')}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                </div>

                {/* Staff Registration Form */}
                <div className="tabcontent" style={{ display: activeTab === 'Staff' ? 'block' : 'none' }}>
                    <h3>Staff Registration</h3>
                    <form onSubmit={handleStaffSubmit}>
                        <label htmlFor="staffname">Name:</label>
                        <input
                            type="text"
                            id="staffname"
                            name="name"
                            placeholder="Enter your name"
                            value={staffData.name}
                            onChange={(e) => handleInputChange(e, 'Staff')}
                            required
                        />
                        <label htmlFor="staffid">Staff ID:</label>
                        <input
                            type="text"
                            id="staffid"
                            name="staffid"
                            placeholder="Enter your staff ID"
                            value={staffData.staffid}
                            onChange={(e) => handleInputChange(e, 'Staff')}
                            required
                        />
                        <label htmlFor="staffContact">Contact Number:</label>
                        <input
                            type="text"
                            id="staffContact"
                            name="contactnumber"
                            placeholder="Enter your contact number"
                            value={staffData.contactnumber}
                            onChange={(e) => handleInputChange(e, 'Staff')}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                </div>

                {/* Librarian Registration Form */}
              {/* <div className="tabcontent" style={{ display: activeTab === 'Librarian' ? 'block' : 'none' }}>
                    <h3>Librarian Registration</h3>
                    <form onSubmit={handleLibrarianSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={librarianData.username}
                            onChange={(e) => handleInputChange(e, 'Librarian')}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={librarianData.password}
                            onChange={(e) => handleInputChange(e, 'Librarian')}
                            required
                        />
                        <label htmlFor="confirmpassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmpassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={librarianData.confirmPassword}
                            onChange={(e) => handleInputChange(e, 'Librarian')}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                </div>*/}
            </section>

            {/* Footer Section */}
            <footer>
                <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default LibraryRegistration;