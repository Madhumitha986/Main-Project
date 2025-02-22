import express from "express";

export default function searchRoutes(db) {
    const router = express.Router();

    // Search books endpoint
    
    router.get("/search-books", (req, res) => {
    
        const { query } = req.query; // Get search query from request

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
        

        const searchQuery = `
            SELECT b.id, b.name, b.author, 
                   (CASE WHEN br.book_id IS NULL THEN 'Available' ELSE 'Not Available' END) AS availability
            FROM books b
            LEFT JOIN borrow br 
            ON b.id = br.book_id AND br.return_status = 'pending'
            WHERE b.name LIKE ? OR b.author LIKE ?
            GROUP BY b.id`;

        db.query(searchQuery, [`%${query}%`, `%${query}%`], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.status(200).json(results);
            console.log(results)
        });
    });
    // server.js
const http = require('http');
const socketIo = require('socket.io');
const app = require('express')();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Endpoint to handle borrow request from the student
app.post('/borrowRequest', (req, res) => {
    const { userId, bookName } = req.body;
    
    // Logic to save borrow request in the database
    // For example, insert into a borrow request table
    
    // After saving, emit a message to the librarian
    io.emit('newBorrowRequest', { userId, bookName, timestamp: new Date().toLocaleString() });

    res.status(200).json({ message: 'Borrow request sent successfully' });
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});


    return router; // Return the router instance
}
