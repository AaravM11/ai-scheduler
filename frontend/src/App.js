import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scheduler from './pages/Scheduler';
import Create from './pages/Create';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Route for Scheduler page */}
          <Route path="/" element={<Scheduler />} />
          
          {/* Route for Create page */}
          <Route path="/create" element={<Create />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
