import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CollegeGPA from "./pages/CollegeGPA";
import PractiseTests from "./pages/PractiseTest";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import ContactPage from './pages/Contact';
import PersonalProfile from './pages/PersonalProfile';
import About from './pages/About';
import MyAccount from './pages/MyAccount';
import TestList from './components/TestList';
import TestQuestions from './components/TestQuestions';
import PrivateRoute from './utils/PrivateRoute';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PracticeBySubject from './pages/PracticeBySubject';

// Import pages
const ForgotPassword = React.lazy(() => 
  import('./pages/auth/forgot-password').then(module => ({
    default: module.default,
    Loading: module.Loading || (() => null)
  }))
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<><Header /><About /></>} />
          <Route path="/contact" element={<><Header /><ContactPage /></>} />
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/register" element={<SignUpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route
            path="/Personal-profile"
            element={
              <PrivateRoute>
                <Header />
                <PersonalProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/college-gpa"
            element={
              <>
                <Header />
                <CollegeGPA />
              </>
            }
          />
          <Route
            path="/practice-test"
            element={
              <PrivateRoute>
                <Header />
                <PractiseTests />
              </PrivateRoute>
            }
          />
          <Route
            path="/practice/:subject"
            element={
              <PrivateRoute>
                <Header />
                <PracticeBySubject />
              </PrivateRoute>
            }
          />
          <Route
            path="/practice/:subject/test/:testId"
            element={
              <PrivateRoute>
                <Header />
                <TestQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <PrivateRoute>
                <Header />
                <MyAccount />
              </PrivateRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          {/* Admin Dashboard Route */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;