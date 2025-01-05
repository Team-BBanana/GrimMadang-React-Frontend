import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import Footer from './components/Footer/Footer.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
import SignupPage from './pages/Signup/SignupPage.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

function AppContent() {
  const location = useLocation(); 
  const fullBrowserRoutes = ['/canvas']; 
  const isFullBrowserRoutes = fullBrowserRoutes.some(route => 
      location.pathname === route || 
      (route.endsWith('*') && location.pathname.startsWith(route.slice(0, -1)))
  );

  return (
    <div className="container">
      {!isFullBrowserRoutes && <div className="header"><Header /></div>}
      <div className="main-content">
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
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
