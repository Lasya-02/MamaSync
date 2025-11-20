import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './pages/Layout';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Reminder from './pages/Reminder';
import Guide from './pages/Guide';
import Community from './pages/CommunityForum';
import ForumDetail from './pages/ForumDetail';
import Hospitals from './pages/NearbyHospitals';
import Profile from './pages/AccountProfile';
import SOS from './pages/Sos';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard layout with nested pages */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/community" element={<Community />} />
          <Route path="/forum/:id" element={<ForumDetail />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sos" element={<SOS />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
