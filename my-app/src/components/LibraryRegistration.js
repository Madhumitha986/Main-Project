import React, { useState } from 'react';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LibraryRegistration = () => {
    const [activeTab, setActiveTab] = useState('Student');

    const [studentData, setStudentData] = useState({
        name: '',
        rollnumber: '',
        email: '',
        contactnumber: '',
        academicyear:'',
        
    });

    const [staffData, setStaffData] = useState({
        name: '',
        staffid: '',
        contactnumber: '',
        
    });

    

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleStudentRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/register-student`, studentData);
            alert('Student registered successfully');
window.location.reload();

        } catch (err) {
            alert('Student registration failed');
        }
    };

    const handleStaffRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/register-staff`, staffData);
            alert('Staff registered successfully');
window.location.reload();

        } catch (err) {
            alert('Staff registration failed');
        }
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

            <section style={{ textAlign: "center", marginTop: "30px" }}>
                <h2 style={{ fontSize: "28px" }}>Register as</h2>
                <div style={{ marginBottom: "20px" }}>
                    {['Student', 'Staff'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTabChange(type)}
                            style={{
                                ...fontStyle,
                                padding: "10px 20px",
                                marginRight: "10px",
                                backgroundColor: activeTab === type ? "#005599" : "#ccc",
                                color: activeTab === type ? "white" : "black",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {activeTab === 'Student' && (
                    <form onSubmit={handleStudentRegister}>
                        <input type="text" placeholder="Name" required value={studentData.name} onChange={(e) => setStudentData({ ...studentData, name: e.target.value })} style={inputStyle} /><br />
                        <input type="text" placeholder="Roll Number" required value={studentData.rollnumber} onChange={(e) => setStudentData({ ...studentData, rollnumber: e.target.value })} style={inputStyle} /><br />
                        <input type="email" placeholder="Email" required value={studentData.email} onChange={(e) => setStudentData({ ...studentData, email: e.target.value })} style={inputStyle} /><br />
                        <input type="text" placeholder="Contact number" required value={studentData.contactnumber} onChange={(e) => setStudentData({ ...studentData, contactnumber: e.target.value })} style={inputStyle} /><br />
                        <input type="text" placeholder="Academic year" required value={studentData.academicyear} onChange={(e) => setStudentData({ ...studentData, academicyear: e.target.value })} style={inputStyle} /><br />
                        <button type="submit" style={buttonStyle}>Register</button>
                    </form>
                )}

                {activeTab === 'Staff' && (
                    <form onSubmit={handleStaffRegister}>
                        <input type="text" placeholder="Name" required value={staffData.name} onChange={(e) => setStaffData({ ...staffData, name: e.target.value })} style={inputStyle} /><br />
                        <input type="text" placeholder="Staff ID" required value={staffData.staffid} onChange={(e) => setStaffData({ ...staffData, staffid: e.target.value })} style={inputStyle} /><br />
                        <input type="text" placeholder="contactnumber" required value={staffData.contactnumber} onChange={(e) => setStaffData({ ...staffData, contactnumber: e.target.value })} style={inputStyle} /><br />
                        
                        <button type="submit" style={buttonStyle}>Register</button>
                    </form>
                )}

            </section>

            <footer style={{ backgroundColor: "#003366", color: "white", padding: "15px 10px", textAlign: "center", marginTop: "40px" }}>
                <p style={{ margin: 0 }}>&copy; 2025 ACGCET Library. All rights reserved.</p>
            </footer>
        </div>
    );
};

const inputStyle = {
    padding: "10px",
    width: "250px",
    marginBottom: "10px",
    fontFamily: "Times New Roman"
};

const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#005599",
    color: "white",
    border: "none",
    cursor: "pointer"
};

export default LibraryRegistration;