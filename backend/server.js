console.log("Server script is running...");

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import searchRoutes from "./searchRoutes.js";
import dotenv from 'dotenv';

dotenv.config();


import http from "http";
import { Server } from "socket.io";

const pendingRequests = []; // Store missed requests

// Export array for access in routes


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend to connect
        methods: ["GET", "POST"]
    }

});
export default (io);

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allow DELETE requests
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,  // Your database name
});
app.use("/api", searchRoutes(db,io));
app.use((req, res, next) => {
    req.io = io;
    next();
});






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
    const checkQuery = 'SELECT * FROM students WHERE rollnumber = ?';

    db.query(checkQuery, [rollnumber], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length > 0) {
            return res.status(400).json({ message: 'You are already registered' });
        }
    const query = 'INSERT INTO students (name, rollnumber, email, contactnumber, academicyear) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [name, rollnumber, email, contactnumber, academicyear], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Student registered successfully' });
    });
});
});
app.post('/register-librarian', (req, res) => {
    const { username, password, confirmPassword } = req.body;
 
    const query = 'INSERT INTO librarians (username, password, confirmPassword) VALUES (?, ?, ?)';


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
    const checkQuery = 'SELECT * FROM staff WHERE staffid = ?';

    db.query(checkQuery, [staffid], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length > 0) {
            return res.status(400).json({ message: 'You are already registered' });
        }
    const insertQuery = 'INSERT INTO staff (name, staffid,contactnumber) VALUES (?, ?, ?)';
    


    db.query(insertQuery, [name, staffid,contactnumber,], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Staff registered successfully' });
    });
});
});
app.post('/login-student', (req, res) => {
    const { rollnumber } = req.body;
    console.log("roll number from request:",rollnumber);
    const query =' SELECT * FROM students WHERE rollnumber = ?';

    db.query(query, [rollnumber], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Student not found' });
        }
        // Successfully logged in, send the student ID
        res.status(200).json({ success: true, userId: results[0].rollnumber });

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

    const query =' SELECT staffid, name FROM staff WHERE name = ? AND staffid = ?';

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
    const query ='SELECT id, username FROM librarians WHERE username = ? AND password = ?';

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
    console.log("Fetching borrow details for staffid:", staffid);

    if (!staffid) {
        return res.status(400).json({ error: 'Staff ID is required' });
    }

    const staffQuery = 'SELECT name, staffid, contactnumber FROM staff WHERE staffid = ?';
    const booksQuery = `
        SELECT 
            books.name AS bookName, 
            books.author AS authorName, 
            borrow.book_id AS bookId, 
            DATE_FORMAT(borrow.approved_date, '%Y-%m-%d') AS borrowDate, 
            DATE_FORMAT(borrow.return_date, '%Y-%m-%d') AS returnDate, 
            borrow.return_status AS returnStatus
        FROM borrow
        JOIN books ON borrow.book_id = books.book_id
        WHERE borrow.staff_id = ?`;

    db.query(staffQuery, [staffid], (err, staffResults) => {
        if (err || staffResults.length === 0) {
            console.error('Error fetching staff data:', err);
            return res.status(500).json({ error: 'Error fetching staff data' });
        }
        console.log("Staff Query Result:", staffResults);

        db.query(booksQuery, [staffid], (err, bookResults) => {
            if (err) {
                
                console.error('Error fetching borrowed books:', err);
                return res.status(500).json({ error: 'Error fetching borrowed books' });
            }
            console.log("Book Results:", bookResults); // Log here for debugging

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

    if (!userId || !borrowerType) {
        console.error('Missing userId or borrowerType in query parameters');
        return res.status(400).json({ error: 'Missing userId or borrowerType in query parameters' });
    }

    const studentQuery = 'SELECT id, name, rollnumber, email, contactnumber, academicyear FROM students WHERE rollnumber = ?';

    // Fetch profile information
    db.query(studentQuery, [userId], (err, userResults) => {
        if (err || userResults.length === 0) {
            console.error('Error fetching user data:', err);
            return res.status(404).json({ error: 'No user found with the provided ID' });
        }

        const rollnumber = userResults[0].rollnumber; // Extract roll number
        console.log('Fetched Roll Number:', rollnumber);

        const booksQuery = `
            SELECT books.name AS bookName,books.author AS authorName, borrow.book_id AS bookId,
             DATE_FORMAT(borrow.approved_date, '%Y-%m-%d') AS borrowDate, 
            DATE_FORMAT(borrow.return_date, '%Y-%m-%d') AS returnDate,  borrow.return_status AS returnStatus
            FROM borrow
            JOIN books ON borrow.book_id = books.book_id
            WHERE borrow.student_id = ?
              AND borrow.borrower_type = 'student'`;

        // Fetch borrowed books using roll number
        db.query(booksQuery, [rollnumber], (err, bookResults) => {
            if (err) {
                console.error('Error fetching borrowed books:', err);
                return res.status(500).json({ error: 'Error fetching borrowed books' });
            }

            res.status(200).json({
                user: userResults[0],
                books: bookResults
                
            });
           // console.log(books);
        });
    });
});

app.get('/librarianProfile', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Query to fetch librarian details (excluding password for security)
    const librarianQuery ='SELECT username FROM librarians WHERE username = ?';

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


// WebSocket connection
// Define the route globally
app.get('/pending-requests', (req, res) => {
    const fetchPendingRequestsQuery = `
        SELECT * FROM pending_requests WHERE status = 'pending'
    `;

    db.query(fetchPendingRequestsQuery, (err, results) => {
        if (err) {
            console.error("Error fetching pending requests:", err);
            res.status(500).send("Server Error");
            return;
        }
        res.status(200).json(results);
    });
});

/*{// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("librarianLogin", () => {
        socket.join("librarianRoom");
        console.log("Librarian joined the room");
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});}*/

// Start the server
const PORT = 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});