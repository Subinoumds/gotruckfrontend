import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupStep1Page from './pages/SignupStep1Page'
import SignupStep2Page from './pages/SignupStep2Page'
import SignupStep3Page from './pages/SignupStep3Page'
import SignupProPage from './pages/SignupProPage'
import HomePage from './pages/HomePage'
import ComingSoonPage from './pages/ComingSoonPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/step1" element={<SignupStep1Page />} />
          <Route path="/signup/step2" element={<SignupStep2Page />} />
          <Route path="/signup/step3" element={<SignupStep3Page />} />
          <Route path="/signup/pro" element={<SignupProPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
