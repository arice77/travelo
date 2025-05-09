import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import HomePage from './HomePage';
import BlogPost from './BlogPost';
import Profile from './Profile';
import BlogPostPage from './PublishBlog';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow container mx-auto px-4">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:permlink" element={<BlogPost />} />
            <Route path="/publish" element={<BlogPostPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;