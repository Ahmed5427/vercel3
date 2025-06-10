import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <Navbar />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <main className="container" style={{ marginTop: '100px', minHeight: 'calc(100vh - 100px)' }}>
        {children}
      </main>
    </>
  );
}