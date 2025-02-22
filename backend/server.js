import express from "express";
import mysql from "mysql";
import cors from "cors";
import searchRoutes from "./searchRoutes.js";


/*const express = require("express");
const cors = require('cors');
const mysql = require('mysql');*/

const app = express();
app.use(cors());  // Allow requests from React
app.use(express.json());  // Parse JSON bodies
// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_db'  // Your database name
});
app.use("/api", searchRoutes(db));



db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Example route for student registration
app.post('/register-student', (req, res) => {
    const { name, rollnumber, email, contactnumber, academicyear } = req.body;
 
    const query = `INSERT INTO students (name, rollnumber, email, contactnumber, academicyear) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [name, rollnumber, email, contactnumber, academicyear], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Student registered successfully' });
    });
});
app.post('/register-librarian', (req, res) => {
    const { username, password, confirmPassword } = req.body;
 
    const query = `INSERT INTO librarians (username, password, confirmPassword) VALUES (?, ?, ?)`;


    db.query(query, [username, password, confirmPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'librarian registered successfully' });
    });
});
app.post('/register-staff', (req, res) => {
    const { name, staffid, contactnumber } = req.body;
    const query = `INSERT INTO staff (name, staffid,contactnumber) VALUES (?, ?, ?)`;
    


    db.query(query, [name, staffid,contactnumber,], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Student registered successfully' });
    });
});
app.post('/login-student', (req, res) => {
    const { rollnumber } = req.body;
    const query = `SELECT id FROM students WHERE rollnumber = ?`;

    db.query(query, [rollnumber], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Student not found' });
        }
        // Successfully logged in, send the student ID
        res.status(200).json({ success: true, userId: results[0].id });

    });
});
app.post('/login-staff', (req, res) => {
    const { name, staffid } = req.body;

    // Log request body
    console.log("Received request with data:", { name, staffid });

    if (!name || !staffid) {
        console.error("Missing name or staffid");
        return res.status(400).json({ error: 'Name and Staff ID are required' });
    }

    const query = `SELECT staffid, name FROM staff WHERE name = ? AND staffid = ?`;

    // Log query and parameters
    console.log("Executing query:", query, "with values:", [name, staffid]);

    db.query(query, [name, staffid], (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log database error
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            console.warn("No matching staff found");
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log("Query successful. Results:", results);

        // Successfully logged in
        res.status(200).json({
            success: true,
            message: 'Login successful',
            staffid: results[0].staffid,
            name: results[0].name,
        });
    });
});
// Librarian login route
app.post('/login-librarian', (req, res) => {
    console.log("reached librarian backend");
    const { username, password } = req.body;
console.log(req.body);
    // Validate the request body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query to check if librarian exists with provided credentials
    const query = `SELECT id, username FROM librarians WHERE username = ? AND password = ?`;

    // Execute the query
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Successfully logged in
        res.status(200).json({
            success: true,
            message: 'Login successful',
            userId: results[0].id,
            username: results[0].username,
        });
    });
});
app.get('/staffProfile', (req, res) => {
    const { staffid } = req.query;

    if (!staffid) {
        return res.status(400).json({ error: 'Staff ID is required' });
    }

    const staffQuery = `SELECT name, staffid, contactnumber FROM staff WHERE staffid = ?`;
    const booksQuery = `
        SELECT books.name AS bookName, borrow.book_id AS bookId, borrow.borrow_date AS borrowDate, 
               borrow.return_date AS returnDate, borrow.return_status AS returnStatus
        FROM borrow
        JOIN books ON borrow.book_id = books.id
        WHERE borrow.staff_id = ?`;

    db.query(staffQuery, [staffid], (err, staffResults) => {
        if (err || staffResults.length === 0) {
            console.error('Error fetching staff data:', err);
            return res.status(500).json({ error: 'Error fetching staff data' });
        }

        db.query(booksQuery, [staffid], (err, bookResults) => {
            if (err) {
                console.error('Error fetching borrowed books:', err);
                return res.status(500).json({ error: 'Error fetching borrowed books' });
            }

            res.status(200).json({
                staff: staffResults[0],
                books: bookResults
            });
            
            });
        });
    });




// Example backend code to handle profile requests
app.get('/profile', (req, res) => {

    const { userId, borrowerType } = req.query;
    console.log(userId);

    
    const studentQuery = `SELECT name, rollnumber, email, contactnumber, academicyear FROM students WHERE id = ?`;
    const staffQuery = `SELECT name, staffid, contact number FROM staff WHERE id = ?`;

    const booksQuery = `
        SELECT books.name AS bookName, borrow.book_id AS bookId, borrow.borrow_date AS borrowDate, 
               borrow.return_date AS returnDate, borrow.return_status AS returnStatus
        FROM borrow
        JOIN books ON borrow.book_id = books.id
        WHERE borrow.${borrowerType === 'student' ? 'student_id' : 'staff_id'} = ?
          AND borrow.borrower_type = ?`;

    // Fetch profile information based on user type
    const query = borrowerType === 'student' ? studentQuery : staffQuery;
    
    db.query(query, [userId], (err, userResults) => {
        if (err || userResults.length === 0) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Error fetching user data' });
        }

        // Fetch borrowed books
        db.query(booksQuery, [userId, borrowerType], (err, bookResults) => {
            if (err) {
                console.error('Error fetching borrowed books:', err);
                return res.status(500).json({ error: 'Error fetching borrowed books' });
            }

            // Send user data and borrowed books in response
            res.status(200).json({
                user: userResults[0],
                books: bookResults
            });
        });
    });
});
app.get('/librarianProfile', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Query to fetch librarian details (excluding password for security)
    const librarianQuery = `SELECT username FROM librarian WHERE username = ?`;

    db.query(librarianQuery, [username], (err, librarianResults) => {
        if (err || librarianResults.length === 0) {
            console.error('Error fetching librarian data:', err);
            return res.status(500).json({ error: 'Librarian not found' });
        }

        // Respond with librarian details
        res.status(200).json({
            librarian: librarianResults[0]
        });
    });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});