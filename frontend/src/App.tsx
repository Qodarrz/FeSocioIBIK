import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components & Pages
import TransparansiDonasiPage from "./pages/TransparansiDonasiPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPassPage from "./pages/ResetPassPage";
import VerifyResetPassPage from "./pages/VerifyResetPassPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/fraction/ProtectedRoute";
import GuestRoute from "./components/fraction/GuestRoute";
import DonasiPage from "./pages/DonasiPage";
import DonasiDetailPage from "./pages/DonasiDetailPage";
import TentangKamiPage from "./pages/TentangKamiPage";
import KomunitasPage from "./pages/KomunitasPage";
import SplashScreen from "./pages/SplashScreen";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  // State untuk mengontrol tampilan splash
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1. Cek apakah user sudah pernah melewati splash screen
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      // Jika belum pernah lihat, jalankan timer untuk set token secara otomatis
      // Sesuaikan durasi (6400ms) dengan total durasi animasi di SplashScreen.tsx
      const timer = setTimeout(() => {
        handleSplashComplete();
      }, 6400);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <main
      style={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      {/* 2. Render SplashScreen secara kondisional */}
      {showSplash && <SplashScreen />}

      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="donasi" element={<DonasiPage />} />
            <Route path="donasi/detail/:id" element={<DonasiDetailPage />} />
            <Route
              path="transparansi-donasi/:id"
              element={<TransparansiDonasiPage />}
            />
            <Route path="tentang-kami" element={<TentangKamiPage />} />
            <Route path="komunitas" element={<KomunitasPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Guest & Protected Routes tetap sama */}
          <Route
            path="login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </main>
  );
}
