import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components & Pages (Tetap sama)
import EarthSplashScreen from "./components/splashscreen/EarthSplashScreen";
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
import KomunitasPage from './pages/KomunitasPage';
import MarketPage from './pages/MarketPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // 1. Cek status di LocalStorage
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
      // Jika sudah pernah melihat, langsung bypass splash
      setShowSplash(false);
      setIsAppReady(true);
    } else {
      // Jika belum, pastikan body tidak bisa scroll selama splash
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleSplashComplete = () => {
    // 2. Tandai di LocalStorage agar tidak muncul lagi
    localStorage.setItem('hasSeenSplash', 'true');
    
    // 3. Update state untuk transisi UI
    setShowSplash(false);
    setIsAppReady(true);
    
    // 4. Kembalikan fungsi scroll
    document.body.style.overflow = 'auto';
  };

  const handleDebugReset = () => {
    localStorage.removeItem('hasSeenSplash');
    window.location.reload();
  };

  return (
    <>
      {/* Splash Screen hanya dirender jika showSplash true */}
      {showSplash && (
        <EarthSplashScreen onComplete={handleSplashComplete} />
      )}

      <main
        style={{
          width: '100vw',
          minHeight: '100vh',
          opacity: showSplash ? 0 : 1,
          // Menggunakan 'display' lebih aman daripada 'visibility' 
          // untuk mencegah interaksi elemen di belakang splash
          display: isAppReady ? 'block' : 'none',
          transition: 'opacity 0.8s ease-in-out',
          position: 'relative',
          backgroundColor: '#fff'
        }}
      >
        {isAppReady && (
          <Router>
            <Routes>
              {/* Public Routes via MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="donasi" element={<DonasiPage />} />
                <Route path="donasi/detail/:id" element={<DonasiDetailPage />} />
                <Route path="tentang-kami" element={<TentangKamiPage />} />
                <Route path="komunitas" element={<KomunitasPage />} />
                <Route path="market" element={<MarketPage />} />
              </Route>

              {/* Guest Routes */}
              <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="reset-password" element={<GuestRoute><ResetPassPage /></GuestRoute>} />
              <Route path="verification/reset-password/:tokenReset" element={<GuestRoute><VerifyResetPassPage /></GuestRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        )}
      </main>

      {/* Debug Tool: Hanya muncul di mode development */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleDebugReset}
          style={{
            position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999,
            padding: '8px 12px', background: '#ff4444', color: '#fff', 
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
          }}
        >
          Reset Splash (Dev Only)
        </button>
      )}
    </>
  );
}