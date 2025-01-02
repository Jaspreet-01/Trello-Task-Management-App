import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Import the backend
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import TaskBoard from './TaskBoard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}> {/* Wrap the app with DndProvider */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/task-board"
            element={
              <PrivateRoute>
                <TaskBoard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </DndProvider>
    </Router>
  );
}

export default App;