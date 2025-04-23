import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // logout icon
import { FiHome, FiUsers, FiUserCheck, FiBookOpen, FiBell, FiRepeat } from 'react-icons/fi'; // Add at the top
import { saveAs } from 'file-saver'; 
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Define icon mapping
const tabIcons = {
  dashboard: <FiHome />,
  students: <FiUsers />,
  staff: <FiUserCheck />,
  books: <FiBookOpen />,
  notifications: <FiBell />,
  ReturnManagement: <FiRepeat />
};




//const socket = io('http://localhost:5000',{transports: ['websocket'] });



const LibrarianProfile = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ borrowed: 0, returned: 0 });
    const [books, setBooks] = useState([]);
    const [studentBorrowDetails, setStudentBorrowDetails] = useState([]);
    const [staffBorrowDetails, setStaffBorrowDetails] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [studentSearchInput, setStudentSearchInput] = useState('');
    const [staffSearchInput, setStaffSearchInput] = useState('');
  
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const navigate = useNavigate();
    const [showAddBook, setShowAddBook] = useState(false);
const [bookId, setBookId] = useState('');
const [bookName, setBookName] = useState('');
const [author, setAuthor] = useState('');
const [bero, setbero] = useState('');
const [row_no, setrow_no] =useState('');
const [position, setposition] =useState('');


const handleAddBook = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${backendUrl}/api/add-book`, {
            book_id: bookId,
            name: bookName,
            author: author,
            bero_no:bero,
            row_no: row_no,
            position: position
        });

        if (res.status === 200) {
            alert('Book added successfully!');
            setBookId('');
            setBookName('');
            setAuthor('');
            setbero('');
            setrow_no('');
            setposition('');
            setShowAddBook(false);
            // Refresh book list if needed
        } else {
            alert('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Error occurred while adding book');
    }
};

const handleDownloadBooks = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/download-books`, {
            responseType: 'blob', // Important for binary file
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'books.xlsx');
    } catch (error) {
        console.error('Error downloading Excel:', error);
        alert('Failed to download Excel');
    }
};

    const handleLogout = () => {
        // You can clear session/local storage here if needed
        navigate('/Liblogin');
      };
    
    useEffect(() => {
    const fetchBorrowDetails = async () => {
        try {
            const studentResponse = await fetch(`${backendUrl}/api/student-borrow-details`);
            const staffResponse = await fetch(`${backendUrl}/api/staff-borrow-details`);
            
            const studentData = await studentResponse.json();
            const staffData = await staffResponse.json();
            console.log("STAFF BORROW DATA:", staffData);
            
            setStudentBorrowDetails(studentData);
            setStaffBorrowDetails(staffData);
        } catch (error) {
            console.error('Error fetching borrow details:', error);
        }
    };
    fetchBorrowDetails();
}, []);

    
    useEffect(() => {
        axios.get(`${backendUrl}/pending-requests`)
            .then(response => {
                console.log("Pending requests data:", response.data); // Log the response data
                setNotifications(response.data);
                
            })
            .catch(error => console.error("Error fetching pending requests", error));
    }, []);
    
    useEffect(() => {
       axios.get(`${backendUrl}/api/stats`)
            .then(response => setStats(response.data))
            .catch(error => console.error("Error fetching statistics", error));

        axios.get(`${backendUrl}/books`)
            .then(response => setBooks(response.data))
            .catch(error => console.error("Error fetching books", error));
          
    }, []);
    const handleApproveRequest = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/approve-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id })  // ✅ Sending `id` in the body
            });
    
            const data = await response.json();
            alert(data.message || 'Request approved successfully!');
            setNotifications((prevNotifications) => 
                prevNotifications.filter(notification => notification.id !== id)
            );
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request.');
        }
    };
    
    
    const handleRejectRequest = async (id) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                const response = await fetch(`${backendUrl}/api/reject-request`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requestId: id })
                });
    
                const data = await response.json();
                alert(data.message || 'Request rejected successfully!');
                setNotifications((prevNotifications) =>
                    prevNotifications.filter(notification => notification.id !== id)
                );
            } catch (error) {
                console.error('Error rejecting request:', error);
                alert('Failed to reject request.');
            }
        }
    };
    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/borrowed-books`); // Replace with your API endpoint
                setBorrowedBooks(response.data);
                console.log("borrowed book:",response.data);
                
            } catch (error) {
                console.error('Error fetching borrowed books:', error);
            }
        };

        fetchBorrowedBooks();
    }, []);

    // Handle Return Logic
    const handleReturn = async (bookId) => {
        try {
            await axios.delete(`${backendUrl}/api/return-book/${bookId}`); // Replace with your API endpoint
            setBorrowedBooks((prevBooks) =>
                prevBooks.filter((book) => book.book_id !== bookId)
            );
            alert('Book returned successfully!');
        } catch (error) {
            console.error('Error returning book:', error);
            alert('Failed to return the book.');
        }
    };

    
    

    const handleStudentSearch = () => {
  if (studentSearchInput.trim() !== '') {
    navigate(`/StudentDetails/${studentSearchInput}`);
  }
};

const handleStaffSearch = () => {
  if (staffSearchInput.trim() !== '') {
    navigate(`/StaffDetails/${staffSearchInput}`);
  }
};
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', backgroundColor: '#003366', color: 'white', padding: '50px'}}>
                <h2 style={{ textAlign: 'center' }}></h2>
                <nav>
                    <button
  onClick={handleLogout}
  style={{
    position: 'absolute',
    paddingTop:'50px',
    top: '20px',
    left: '20px',
    backgroundColor:  '#003366', // indigo
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  }}
  
  
>
  <FiLogOut size={18} />
  Logout
</button>

                    {['dashboard', 'students', 'staff', 'books', 'notifications', 'ReturnManagement'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          style={{
                            paddingBottom:'20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '10px',
                            backgroundColor: activeTab === tab ? '#002244' : 'transparent',
                            border: 'none',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          {tabIcons[tab]}
                          {tab.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                      ))}
                      
                </nav>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f4f4' }}>
                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div>
                    <h2 style={{
                      color: '#003366',
                      padding: '20px 30px',
                      marginBottom: '10px',
                      fontSize: '24px',
                      borderBottom: '2px solid #ccc'
                    }}>
                      📊 Library Statistics
                    </h2>
                  
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '20px',
                      flexWrap: 'wrap',
                      padding: '20px'
                    }}>
                      {[
                        { label: 'Total Books Borrowed', value: stats.total_borrowed, bg:'#cce5ff', icon: '📚' },
                        { label: 'Overdue Books', value: stats.overdue_books, bg: '#f08080', icon: '⏰' },
                        { label: 'Total Books Available', value: stats.total_available, bg: 'violet', icon: '📖' },
                        { label: 'Pending Borrow Requests', value: stats.pending_requests, bg: '#fff3cd', icon: '⏳' }
                      ].map((item, index) => (
                        <div key={index} style={{
                          backgroundColor: item.bg,
                          padding: '20px',
                          borderRadius: '12px',
                          width: '220px',
                          textAlign: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontSize: '30px', marginBottom: '10px' }}>{item.icon}</div>
                          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>{item.label}</div>
                          <div style={{ fontSize: '20px', color: '#333' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                )}

                {/* Students Borrow History */}
                {activeTab === 'students' && (
                    <div>
                        <h2>Student Borrow Details</h2>
                        <input type="text" placeholder="Enter rollnumber..." value={studentSearchInput}
                            onChange={(e) => setStudentSearchInput(e.target.value)}
                            style={{ padding: '8px', width: '250px', marginRight: '10px' }} />
                       <button onClick={handleStudentSearch} style={{ padding: '8px', backgroundColor: '#005599', color: 'white', border: 'none', cursor: 'pointer' }}>Search</button>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Book ID</th>
                    <th>Book Name</th>
                    
                    <th>Approved Date</th>
                    <th>Return Date</th>
                    
                </tr>
            </thead>
            <tbody>
                {studentBorrowDetails.map(student => (
                    <tr key={student.book_id}>
                        <td>{student.rollnumber}</td>
                        <td>{student.name}</td>
                        <td>{student.book_id}</td>
                        <td>{student.book_name}</td>
                      {/* <td>{student.request_date.split('T')[0]}</td>*/}
                        <td>{student.approved_date ? student.approved_date : 'N/A'}</td>
                        <td>{student.return_date ? student.return_date : 'N/A'}</td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
                    </div>
                )}

                {/* Staff Borrow History */}
                {activeTab === 'staff' && (
                    <div>
                        <h2>Staff Borrow details</h2>
                        <input type="text" placeholder="enter staff id..." value={staffSearchInput}
                            onChange={(e) => setStaffSearchInput(e.target.value)}
                            style={{ padding: '8px', width: '250px', marginRight: '10px' }} />
                       <button onClick={handleStaffSearch} style={{ padding: '8px', backgroundColor: '#005599', color: 'white', border: 'none', cursor: 'pointer' }}>Search</button>
                       <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Book ID</th>
                    <th>Book Name</th>
                    
                    <th>Approved Date</th>
                    <th>Return Date</th>
                    
                </tr>
            </thead>
            <tbody>
                {staffBorrowDetails.map(staff => (
                    <tr key={staff.book_id}>
                        <td>{staff.staffid}</td>
                        <td>{staff.name}</td>
                        <td>{staff.book_id}</td>
                        <td>{staff.book_name}</td>
                       {/* <td>{staff.request_date.split('T')[0]}</td> */}
                        <td>{staff.approved_date ? staff.approved_date.split('T')[0] : 'N/A'}</td>
                        <td>{staff.return_date ? staff.return_date.split('T')[0] : 'N/A'}</td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
                    </div>
                )}




                {/* Book Management */}
{activeTab === 'books' && (
    <div>
        <h2>Book Management</h2>

        {/* Download Button */}
        <button
            onClick={handleDownloadBooks}
            style={{
                padding: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px'
            }}
        >
            Download Excel
        </button>

        {/* Add Book Button */}
        <button
            onClick={() => setShowAddBook(true)}
            style={{
                padding: '8px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
            }}
        >
            Add Book
        </button>

        {/* Add Book Form Modal */}
        {showAddBook && (
            <form onSubmit={handleAddBook} style={{ marginTop: '20px' }}>
                <input type="text" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} required />
                <input type="text" placeholder="Book Name" value={bookName} onChange={(e) => setBookName(e.target.value)} required />
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <input type="text" placeholder="Bero" value={bero} onChange={(e) => setbero(e.target.value)} required />
                <input type="text" placeholder="Row no" value={row_no} onChange={(e) => setrow_no(e.target.value)} required />
                <input type="text" placeholder="position" value={position} onChange={(e) => setposition(e.target.value)} required />
                <button type="submit" style={{ marginLeft: '10px' }}>Submit</button>
            </form>
        )}

       
    </div>
)}


                {/* Notifications & Alerts */}
                {activeTab === 'notifications' && (
  <div>
    <h2>Notifications & Alerts</h2>
    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
      <thead style={{ backgroundColor: '#003366', color: 'white' }}>
        <tr>
          <th style={{ padding: '10px' }}>User ID</th>
          <th style={{ padding: '10px' }}>Book Name</th>
          <th style={{ padding: '10px' }}>Requested Date</th>
          <th style={{ padding: '10px' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {notifications.map((notification, index) => (
          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{notification.user_id}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{notification.book_name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{notification.timestamp.split('T')[0]}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <button
                onClick={() => handleApproveRequest(notification.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Approve
              </button>
              <button
            onClick={() => handleRejectRequest(notification.id)}
            style={{
              padding: '6px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              marginLeft:'8px',
            }}
          >
            Reject
          </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


                {/* Borrow & Return Management */}
                {activeTab === 'ReturnManagement' && (
    <div>
        <h2 style={{ color: 'darkblue', marginBottom: '10px' }}>Borrow & Return Management</h2>
        <p style={{ marginBottom: '20px' }}>Track all borrowed books, approve returns, and manage overdue alerts.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
                <tr>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Book ID</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Borrower Type</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Borrower Name</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Borrower ID</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Bero No</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Position</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Row No</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Book Name</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px', textAlign: 'left' }}>Action</th>
                </tr>
            </thead>

            <tbody>
                {borrowedBooks.length > 0 ? (
                    borrowedBooks.map((book) => (
                        <tr key={book.book_id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.book_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.borrower_type}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {book.borrower_name}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {book.borrower_id}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.bero_no}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.position}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.row_no}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.book_name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{book.return_status}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button
                                    onClick={() => handleReturn(book.book_id)}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Return
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="10" style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
                            No borrowed books found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
)}



                
        </div>
        </div>
    );
};

export default LibrarianProfile;
