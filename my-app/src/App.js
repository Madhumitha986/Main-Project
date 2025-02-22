import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LibraryHome from './components/LibraryHome';  // Import the LibraryHome component
import LibraryRegistration from './components/LibraryRegistration'; // And a Register component
import LibLogin from './components/LibLogin'; 
import StudentProfile from './components/StudentProfile'; 
import StaffProfile from './components/StaffProfile'; 
import LibrarianProfile from './components/librarian profile';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Router>
      <div>
        {/* Define routes here */}
        <Routes>
          <Route path="/" element={<LibraryHome />} />  {/* Home page */}
          <Route path="/LibraryHome"element={<LibraryHome />} />
          <Route path="/profile" element={<StudentProfile />} /> 
          <Route path="/staffProfile" element={<StaffProfile />} />
          <Route path="/Liblogin"element={<LibLogin />} />
          <Route path="/librarianProfile"element={<LibrarianProfile />} />
          <Route path="/search-results" element={<SearchResults />} />

          <Route path="/LibraryRegistration" element={<LibraryRegistration />} />  {/* Register page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
