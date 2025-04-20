import express from "express";

import ExcelJS from 'exceljs';


//import App from "../my-app/src/App";

export default function searchRoutes(db) { // Receive io instance
    const router = express.Router();


    router.post("/approve-request", (req, res) => { 
    const { requestId } = req.body;  // ✅ Extract `requestId` from the body

    const transferQuery = `
    INSERT INTO borrow (
        student_id, 
        staff_id, 
        book_id, 
        book_name, 
        borrower_type, 
        approved_date, 
        return_date, 
        bero_no, 
        position, 
        row_no
    )
    SELECT 
        CASE WHEN pr.borrower_type = 'student' THEN pr.user_id ELSE NULL END,
        CASE WHEN pr.borrower_type = 'staff' THEN pr.user_id ELSE NULL END,
        pr.book_id, 
        pr.book_name, 
        pr.borrower_type, 
        NOW(), 
        DATE_ADD(NOW(), INTERVAL 3 MONTH), 
        b.bero_no, 
        b.position, 
        b.row_no
    FROM 
        pending_requests pr
    JOIN 
        books b ON pr.book_id = b.book_id
    WHERE 
        pr.id = ?
`;

const deleteQuery = `DELETE FROM pending_requests WHERE id = ?`;
const updateAvailabilityQuery = `UPDATE books SET availability = 'Not Available' WHERE book_id = (SELECT book_id FROM pending_requests WHERE id = ?)`;
const checkAvailabilityQuery = `SELECT availability FROM books WHERE book_id = (SELECT book_id FROM pending_requests WHERE id = ?)`;

db.query(checkAvailabilityQuery, [requestId], (err, result) => {
    if (err) {
        console.error("Error checking book availability:", err);
        return res.status(500).json({ error: "Failed to check book availability." });
    }

    if (!result.length || result[0].availability !== "Available") {
        return res.status(400).json({ message: "Book is already borrowed by someone else." });
    }

db.query(transferQuery, [requestId], (err) => {
    if (err) {
        console.error("Error transferring data:", err);
        return res.status(500).json({ error: "Failed to approve request." });
    }
    db.query(updateAvailabilityQuery, [requestId], (err) => {
        if (err) {
            console.error("Error updating book availability:", err);
            return res.status(500).json({ error: "Failed to update book availability." });
        }   

    db.query(deleteQuery, [requestId], (err) => {
        if (err) {
            console.error("Error deleting pending request:", err);
            return res.status(500).json({ error: "Failed to remove request from pending_requests." });
        }

        res.status(200).json({ message: "Request approved successfully!" });
    });
}); 
});
});
});
router.post("/reject-request", async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ error: "Request ID is required." });
    }

    const deleteQuery = `DELETE FROM pending_requests WHERE id = ?`;
    
    db.query(deleteQuery, [requestId], (err) => {
        if (err) {
            console.error("Error deleting pending request:", err);
            return res.status(500).json({ error: "Failed to reject request." });
        }
        res.status(200).json({ message: "Request rejected successfully!" });
    });
});

    // Search books endpoint
    router.get("/search-books", (req, res) => {
        let { query } = req.query;
    
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
    
        query = query.toLowerCase();
    
        const searchQuery = `
            SELECT 
                book_id,
                name,
                author,
                availability
            FROM books
            WHERE MATCH(name, author) 
            AGAINST (CONCAT('+', ?, '*') IN BOOLEAN MODE);
        `;
    
        db.query(searchQuery, [query], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json(results);
        });
    });
    

    router.get("/profile-search", (req, res) => {
        let { query } = req.query;
    
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
    
        query = query.toLowerCase();
    
        const searchQuery = `
            SELECT 
                b.book_id,
                b.name,
                b.author,
                b.row_no,
                b.bero_no,
                b.position,
                b.availability,
                br.borrower_type,
                CASE 
                    WHEN br.borrower_type = 'student' THEN s.name
                    WHEN br.borrower_type = 'staff' THEN st.name
                    ELSE NULL
                END AS borrowed_by
            FROM books b
            LEFT JOIN borrow br 
                ON b.book_id = br.book_id AND br.return_status = 'pending'
            LEFT JOIN students s 
                ON br.student_id = s.rollnumber AND br.borrower_type = 'student'
            LEFT JOIN staff st 
                ON br.staff_id = st.staffid AND br.borrower_type = 'staff'
            WHERE MATCH(b.name, b.author) 
            AGAINST (CONCAT('+', ?, '*') IN BOOLEAN MODE)
            GROUP BY b.book_id;
        `;
    
        db.query(searchQuery, [query], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json(results);
        });
    });
    

    router.post('/borrowRequest', (req, res) => {
    console.log("Borrow request endpoint hit!");
    console.log("Full Request Body:", req.body); // Log the full request body

    const { userId, bookId, bookName, borrowerType } = req.body;

    if (!userId || !bookId || !borrowerType) {
        return res.status(400).json({ error: "Missing required fields", received: req.body });
    }

    const requestData = {
        userId,
        bookId,
        bookName,
        borrowerType,
        timestamp: new Date().toLocaleString()
    };

    console.log("Processed Request Data:", requestData);
    

    
    const insertQuery = `
    INSERT INTO pending_requests 
    (user_id, book_id, book_name, borrower_type) 
    VALUES (?, ?, ?, ?)
`;

db.query(insertQuery, [userId, bookId, bookName, borrowerType], (err) => {
    if (err) {
        console.error("Error saving pending request:", err);
        return res.status(500).json({ error: "Failed to save request." });
    }

    console.log("Request saved to pending_requests table.");
    res.status(200).json({ message: "Borrow request saved successfully." });
});

});
router.get('/searchstudent/:rollnumber', (req, res) => {
    const { rollnumber } = req.params;
  
    const query = `
      SELECT s.name, s.rollnumber, s.email, s.contactnumber, s.academicyear,
             b.book_name, b.book_id, b.approved_date, b.return_date, b.return_status,
             b.bero_no, b.position, b.row_no
      FROM students s
      LEFT JOIN borrow b ON s.rollnumber = b.student_id
      WHERE s.rollnumber = ?
    `;
  
    db.query(query, [rollnumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).send({ message: 'Student not found or no borrow records' });
      }
  
      const studentInfo = {
        name: result[0].name,
        rollnumber: result[0].rollnumber,
        email: result[0].email,
        contactnumber: result[0].contactnumber,
        academicyear: result[0].academicyear,
        borrowDetails: result.map(row => ({
          book_name: row.book_name,
          book_id: row.book_id,
          approved_date: row.approved_date,
          return_date: row.return_date,
          return_status: row.return_status,
          bero_no: row.bero_no,
          position: row.position,
          row_no: row.row_no
        }))
      };
  
      res.send(studentInfo);
    });
  });
  router.get('/searchstaff/:staffid', (req, res) => {
    const { staffid } = req.params;
  
    const query = `
      SELECT st.name, st.staffid, st.contactnumber,
             b.book_name, b.book_id, b.approved_date, b.return_date, b.return_status,
             b.bero_no, b.position, b.row_no
      FROM staff st
      LEFT JOIN borrow b ON st.staffid = b.staff_id
      WHERE st.staffid = ?
    `;
  
    db.query(query, [staffid], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }
  
      if (result.length === 0) {
        return res.status(404).send({ message: 'Staff not found or no borrow records' });
      }
  
      const staffInfo = {
        name: result[0].name,
        staffid: result[0].staffid,
        contactnumber: result[0].contactnumber,
        borrowDetails: result.map(row => ({
          book_name: row.book_name,
          book_id: row.book_id,
          approved_date: row.approved_date,
          return_date: row.return_date,
          return_status: row.return_status,
          bero_no: row.bero_no,
          position: row.position,
          row_no: row.row_no
        }))
      };
  
      res.send(staffInfo);
    });
  });
  
  
router.get('/stats', (req, res) => {
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM borrow) AS total_borrowed,
            (SELECT COUNT(*) FROM borrow WHERE return_status = 'borrowed' AND return_date < CURDATE()) AS overdue_books,

            (SELECT COUNT(*) FROM books) - (SELECT COUNT(*) FROM borrow WHERE return_status = 'borrowed') AS total_available,
            (SELECT COUNT(*) FROM pending_requests) AS pending_requests
    `;

    db.query(statsQuery, (err, results) => {
        if (err) {
            console.error("Error fetching librarian stats:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results[0]);  // Send the first row of the results
    });
});
router.get('/borrowed-books', (req, res) => {

    const query = `
        SELECT 
    b.book_id, 
    b.borrower_type, 
    CASE 
        WHEN b.borrower_type = 'student' THEN s.rollnumber 
        WHEN b.borrower_type = 'staff' THEN st.staffid 
        ELSE NULL 
    END AS borrower_id,
    CASE 
        WHEN b.borrower_type = 'student' THEN s.name 
        WHEN b.borrower_type = 'staff' THEN st.name 
        ELSE NULL 
    END AS borrower_name,
    b.bero_no,
    b.position,
    b.row_no,
    bk.name AS book_name,
    b.return_status
FROM borrow b
LEFT JOIN books bk ON b.book_id = bk.book_id
LEFT JOIN students s ON b.student_id = s.rollnumber
LEFT JOIN staff st ON b.staff_id = st.staffid;
 `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books:', err);
            return res.status(500).json({ error: 'Failed to fetch borrowed books' });
        }
        res.json(results);
        console.log(results);
    });
});

// API to return a book (delete entry from 'borrow' table)
router.delete('/return-book/:bookId', (req, res) => {
    const { bookId } = req.params;

    const deleteQuery = `DELETE FROM borrow WHERE book_id = ?`;
    const updateBookQuery = `UPDATE books SET availability = 'Available' WHERE book_id = ?`;


    db.query(deleteQuery, [bookId], (err, result) => {
        if (err) {
            console.error(`Error returning book with ID ${bookId}:`, err);
            return res.status(500).json({ error: 'Failed to return the book' });
        }
        db.query(updateBookQuery, [bookId], (err, result) => {
            if (err) {
                console.error("Error updating book availability:", err);
                return res.status(500).json({ error: "Failed to update book availability." });
            }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found in borrow records' });
        }

        res.json({ message: `Book ID ${bookId} returned successfully!` });
    });
});
      
});

// Fetch Student Borrow Details
router.get('/student-borrow-details', (req, res) => {
    const query = `
       SELECT 
    students.rollnumber, 
    students.name, 
    books.book_id, 
    books.name AS book_name, 
    IFNULL(borrow.approved_date, 'N/A') AS approved_date, 
    IFNULL(borrow.return_date, 'N/A') AS return_date, 
    borrow.return_status
FROM 
    students
INNER JOIN borrow ON borrow.student_id = students.rollnumber
INNER JOIN books ON books.book_id = borrow.book_id
WHERE 
    borrow.borrower_type = 'student';

    `;

    db.query(query, (err, results) =>{
        if (err) {
            console.error('Error fetching student borrow details:', err);
            return res.status(500).json({ error: 'Error fetching student borrow details' });
        }
        res.status(200).json(results);
    });
});

// Fetch Staff Borrow Details
router.get('/staff-borrow-details', (req, res) => {
    const query = `
        SELECT 
    staff.staffid, 
    staff.name, 
    books.book_id, 
    books.name AS book_name, 
    IFNULL(borrow.approved_date, 'N/A') AS approved_date, 
    IFNULL(borrow.return_date, 'N/A') AS return_date, 
    borrow.return_status
FROM 
    staff
INNER JOIN borrow ON borrow.staff_id = staff.staffid
INNER JOIN books ON books.book_id = borrow.book_id
WHERE 
    borrow.borrower_type = 'staff';

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching staff borrow details:', err);
            return res.status(500).json({ error: 'Error fetching staff borrow details' });
        }
        res.status(200).json(results);
    });
});
router.get('/download-books', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Books');

    // ✅ Define the column headers based on your DB
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Book Name', key: 'name', width: 30 },
        { header: 'Author', key: 'author', width: 25 },
        { header: 'Bero No', key: 'bero_no', width: 12 },
        { header: 'Position', key: 'position', width: 15 },
        { header: 'Row No', key: 'row_no', width: 10 },
        { header: 'Book ID', key: 'book_id', width: 20 },
        { header: 'Availability', key: 'availability', width: 15 }
    ];

    // ✅ Query the books table
    db.query('SELECT * FROM books', async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Failed to fetch books');
        }

        // ✅ Add each row to the Excel sheet
        results.forEach(book => {
            worksheet.addRow(book);
        });

        // ✅ Set headers to tell browser it's a file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=books.xlsx'
        );

        // ✅ Send the file
        await workbook.xlsx.write(res);
        res.end();
    });
});
router.post('/add-book', (req, res) => {
    const { book_id, name, author, bero_no, row_no, position } = req.body;

    const sql = `
        INSERT INTO books (book_id, name, author, bero_no, row_no, position, availability)
        VALUES (?, ?, ?, ?, ?, ?, 'available')
    `;

    db.query(sql, [book_id, name, author, bero_no, row_no, position], (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            return res.status(500).json({ error: 'Failed to add book' });
        }
        return res.status(200).json({ message: 'Book added successfully' });
    });
});
router.get('/borrower-details/:bookId', (req, res) => {
    const bookId = req.params.bookId;

    const sql = `
        SELECT 
            COALESCE(s.name, st.name) AS name,
            b.borrower_type,
            DATE_FORMAT(b.return_date, '%Y-%m-%d') AS return_date
        FROM borrow b
        LEFT JOIN students s ON b.student_id = s.rollnumber
        LEFT JOIN staff st ON b.staff_id = st.staffid
        WHERE b.book_id = ?
        ORDER BY b.approved_date DESC
        LIMIT 1
    `;

    db.query(sql, [bookId], (err, results) => {
        if (err) {
            console.error("Error fetching borrower details:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No borrower data found for this book." });
        }

        res.json(results[0]);
    });
});


return router;
}