import React from 'react';
import './App.css'; // Import the App.css for styling
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Header from './Components/Header'; // Import the Header component
import ThitoToAp from './Components/ThitoToAp'; // Import the Dashboards component
import SageToAp from './Components/SageToAp'
import MainDashboardButtons from './Components/MainDashboardButtons'
import EbsDashboard from './Components/EbsDashboard'

function App() {
  return (
    <Router> {/* Wrapping the entire application with Router */}
      <div>
        <Header /> {/* Render the Header component at the top of the application */}
        <main>
        <Routes>
  <Route path="/" element={<EbsDashboard />} />
  <Route path="/ThitoToAp" element={<ThitoToAp />} />
  <Route path="/SageToAp" element={<SageToAp />} />
  <Route path="/maindashboardbuttons" element={<MainDashboardButtons />} />
  
  {/* Redirect unknown routes to home */}
  <Route path="*" element={<Navigate replace to="/" />} />
</Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;
