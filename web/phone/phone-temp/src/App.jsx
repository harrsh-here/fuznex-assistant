import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import HomeScreen from './features/Home/HomeScreen';
import TasksScreen from './features/Tasks/TasksScreen';
import FitnessScreen from './features/Fitness/FitnessScreen';
import HistoryScreen from './features/History/HistoryScreen';
import ProfileScreen from './features/Profile/ProfileScreen';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AppShell activePath={location.pathname} onNavigate={navigate}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/tasks" element={<TasksScreen />} />
        <Route path="/fitness" element={<FitnessScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </AppShell>
  );
}