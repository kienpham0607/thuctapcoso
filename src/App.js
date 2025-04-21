import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CollegeGPA from "./pages/CollegeGPA";
import PractiseTests from "./pages/PractiseTest";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import { AuthProvider } from "./contexts/AuthContext";
import ContactPage from './pages/Contact';
import PersonalProfile from './pages/PersonalProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Routes>
            {/* Hide header on login and signup pages */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                </>
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
              path="/contact"
              element={
                <>
                  <Header />
                  <ContactPage />
                </>
              }
            />
            {/* Login and Signup routes without header */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/Personal-profile"
              element={
                <>
                  <Header />
                  <PersonalProfile />
                </>
              }
            />
            <Route
              path="/practice-test"
              element={
                <>
                  <Header />
                  <PractiseTests />
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;