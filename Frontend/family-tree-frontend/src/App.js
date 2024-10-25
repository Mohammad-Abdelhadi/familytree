// src/App.js
import React from 'react';
import FamilyMembers from './components/FamilyMembers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddFamilyMember from './components/AddFamilyMember';
import AddRelationship from './components/AddRelationship';
import "./App.css"
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">شجرة العائلة</Link></li>
            <li><Link to="/add-member">إضافة فرد</Link></li>
            <li><Link to="/add-relationship">إضافة علاقة</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<FamilyMembers />} />
          <Route path="/add-member" element={<AddFamilyMember />} />
          <Route path="/add-relationship" element={<AddRelationship />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;