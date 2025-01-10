import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header/Header.tsx';
import Footer from './components/Footer/Footer.tsx';

import CanvasPage from './pages/canvas/CanvasPage.tsx';
import GalleryPage from './pages/Gallery/GalleryPage.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
import SignupPage from './pages/Signup/SignupPage.tsx';
import FamilyPage from './pages/Family/FamilyPage.tsx';
import DisplayPage from './pages/Display/DisplayPage.tsx';

function AppContent() {
  const location = useLocation(); 
  const fullBrowserRoutes = ['/canvas', '/gallery']; 
  const isFullBrowserRoutes = fullBrowserRoutes.some(route => 
      location.pathname === route || 
      (route.endsWith('*') && location.pathname.startsWith(route.slice(0, -1)))
  );

  const isNoScrollRoute = /^\/gallery\/\d+$/.test(location.pathname);

  return (
    <div className="container">
      {!isFullBrowserRoutes && <div className="header"><Header /></div>}
      <div className={`main-content ${isNoScrollRoute ? 'no-scroll' : ''}`}>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/canvas' element={<CanvasPage />} />
          <Route path='/gallery' element={<GalleryPage/>} />
          <Route path='/family' element={<FamilyPage />} />
          <Route path="/gallery/:id" element={<DisplayPage />} />
        </Routes>
      </div>
      {!isFullBrowserRoutes && <div className="footer"><Footer /></div>}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
