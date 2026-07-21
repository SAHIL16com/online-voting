import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/mainPage/LandingPage/LandingPage';
import LoginPage from './pages/mainPage/LoginPage/LoginPage';
import RegisterPage from './pages/mainPage/RegisterPage/RegisterPage';
import AdminLayout from './pages/admin/AdminLayout/AdminLayout';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import ElectionsPage from './pages/admin/Elections/ElectionsPage';
import CandidatesPage from './pages/admin/Candidates/CandidatesPage';
import VotersPage from './pages/admin/Voters/VotersPage';
import ResultsPage from './pages/admin/Results/ResultsPage';
import ReportsPage from './pages/admin/Reports/ReportsPage';
import ProfilePage from './pages/admin/Profile/ProfilePage';
import SettingsPage from './pages/admin/Settings/SettingsPage';
import VoterLayout from './pages/voter/VoterLayout/VoterLayout';
import VoterDashboard from './pages/voter/VoterDashboard/VoterDashboard';
import ActiveElectionsPage from './pages/voter/ActiveElections/ActiveElectionsPage';
import VotePage from './pages/voter/Vote/VotePage';
import VotingStatusPage from './pages/voter/VotingStatus/VotingStatusPage';
import ElectionHistoryPage from './pages/voter/ElectionHistory/ElectionHistoryPage';
import VoterNotificationsPage from './pages/voter/Notifications/VoterNotificationsPage';
import VoterProfilePage from './pages/voter/Profile/VoterProfilePage';

import { AuthProvider } from './context/AuthContext';
import { ElectionsProvider } from './context/ElectionsContext';
import { CandidatesProvider } from './context/CandidatesContext';
import { VotersProvider } from './context/VotersContext';

const PublicLayout = () => (
  <div className="app-wrapper">
    <div className="bg-ambient" />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <ElectionsProvider>
        <CandidatesProvider>
          <VotersProvider>
            <Router>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="elections" element={<ElectionsPage />} />
                  <Route path="candidates" element={<CandidatesPage />} />
                  <Route path="voters" element={<VotersPage />} />
                  <Route path="results" element={<ResultsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="/voter" element={<VoterLayout />}>
                  <Route index element={<Navigate to="/voter/dashboard" replace />} />
                  <Route path="dashboard" element={<VoterDashboard />} />
                  <Route path="active-elections" element={<ActiveElectionsPage />} />
                  <Route path="vote" element={<VotePage />} />
                  <Route path="status" element={<VotingStatusPage />} />
                  <Route path="history" element={<ElectionHistoryPage />} />
                  <Route path="notifications" element={<VoterNotificationsPage />} />
                  <Route path="profile" element={<VoterProfilePage />} />
                </Route>
              </Routes>
            </Router>
          </VotersProvider>
        </CandidatesProvider>
      </ElectionsProvider>
    </AuthProvider>
  );
};

export default App;