
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AppInterface from './pages/AppInterface';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { Page, Language, User } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentPage(Page.APP);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.HOME);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home setPage={setCurrentPage} language={language} />;
      case Page.APP:
        return <AppInterface language={language} user={user} />;
      case Page.ABOUT:
        return <About language={language} />;
      case Page.PRICING:
        return <Pricing setPage={setCurrentPage} language={language} />;
      case Page.LOGIN:
        return <Login onLogin={handleLogin} setPage={setCurrentPage} language={language} />;
      case Page.PROFILE:
        return <Profile user={user} language={language} />;
      default:
        return <Home setPage={setCurrentPage} language={language} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        language={language}
        setLanguage={setLanguage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="animate-fade-in">
        {renderPage()}
      </main>
      <Footer language={language} />
    </div>
  );
};

export default App;
