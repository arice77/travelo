import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Home, User, Edit, BookOpen } from 'lucide-react';
import LoginPage from './Login';
import HomePage from './HomePage';
import BlogPost from './BlogPost';
import Profile from './Profile';
import BlogPostPage from './PublishBlog';

function Navigation() {
  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/publish", icon: Edit, label: "Publish" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around py-3 max-w-xl mx-auto">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `
              flex flex-col items-center justify-center 
              ${isActive ? 'text-blue-600' : 'text-gray-500'}
              hover:text-blue-700 transition-colors duration-300
            `}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow container mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:permlink" element={<BlogPost />} />
            <Route path="/publish" element={<BlogPostPage />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;