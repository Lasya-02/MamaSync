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

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard layout with nested pages */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
          <Route path="/reminder" element={
            <ProtectedRoute>
              <Reminder />
            </ProtectedRoute>} />
          <Route path="/guide" element={
             <ProtectedRoute>
              <Guide />
            </ProtectedRoute>} />
          <Route path="/community" element={
             <ProtectedRoute>
              <Community />
            </ProtectedRoute>} />
          <Route path="/forum/:id" element={
             <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>} />
          <Route path="/hospitals" element={
             <ProtectedRoute>
              <Hospitals />
            </ProtectedRoute>} />
          <Route path="/profile" element={
             <ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
          <Route path="/sos" element={
             <ProtectedRoute>
              <SOS />
            </ProtectedRoute>} />
        </Route>

         <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
    </Router>
  );
}

export default App;
