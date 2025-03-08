import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, User, LogOut, Globe } from 'lucide-react';

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const username = localStorage.getItem('username') || 'User';
  const imageRegex = /\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif))\)/;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('https://api.hive.blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_discussions_by_blog',
          params: [{
            tag: username,
            limit: 5,
          }],
          id: 1,
        }),
      });
      const data = await response.json();
      setUserPosts(data.result);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.title}`, { state: { post } });
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('publicKey');
    navigate('/');
  };

  const styles = {
    pageContainer: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#f4f7f6',
      margin: 0,
      padding: 0,
      width: '100%',
      minHeight: '100vh',
    },
    heroSection: {
      backgroundImage: 'linear-gradient(135deg, #4A90E2, #3CB371)',
      color: 'white',
      padding: '40px 5%',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '2.5em',
      fontWeight: 700,
      marginBottom: '10px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    heroSubtitle: {
      fontSize: '1em',
      opacity: 0.9,
      marginBottom: '20px',
    },
    navigationBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 5%',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: '1.5em',
      color: '#2C3E50',
    },
    navContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      color: '#2C3E50',
      transition: 'color 0.3s ease',
    },
    navItemHover: {
      color: '#4A90E2',
    },
    searchContainer: {
      display: 'flex',
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '50px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    searchInput: {
      flex: 1,
      padding: '15px 25px',
      border: 'none',
      borderRadius: '50px 0 0 50px',
      fontSize: '1em',
      backgroundColor: 'transparent',
    },
    searchButton: {
      backgroundColor: '#3CB371',
      color: 'white',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '0 50px 50px 0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    postsSection: {
      padding: '40px 5%',
    },
    postGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '25px',
    },
    postCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    },
    postCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    postContent: {
      padding: '20px',
    },
    postTitle: {
      fontSize: '1.2em',
      fontWeight: 600,
      marginBottom: '10px',
      color: '#2C3E50',
    },
    postDescription: {
      color: '#7F8C8D',
      marginBottom: '15px',
    },
    postFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #ECF0F1',
      padding: '10px 20px',
    },
    logoutButton: {
      backgroundColor: '#E74C3C',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    logoutButtonHover: {
      backgroundColor: '#C0392B',
    },
  };

  const filteredPosts = userPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{username}'s Travel Journal</h1>
          <p style={styles.heroSubtitle}>
            Explore the stories and adventures you've shared
          </p>
          <div style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search your posts..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={styles.searchButton}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div style={styles.navigationBar}>
        <div style={styles.logo}>
          <Globe size={30} style={{marginRight: '10px'}} /> Travelo
        </div>
        <div style={styles.navContainer}>
          <div 
            style={styles.navItem} 
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => e.currentTarget.style.color = styles.navItemHover.color}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.navItem.color}
          >
            <Home size={20} /> Home
          </div>
          <div 
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor}
          >
            <LogOut size={20} /> Logout
          </div>
        </div>
      </div>

      <section style={styles.postsSection}>
        {filteredPosts.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            color: '#7F8C8D', 
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
          }}>
            No posts found. Try a different search term.
          </div>
        ) : (
          <div style={styles.postGrid}>
            {filteredPosts.map((post, index) => {
              const imageUrl = imageRegex.exec(post.body);
              return (
                <div 
                  key={index} 
                  style={{
                    ...styles.postCard,
                    ':hover': styles.postCardHover
                  }}
                  onClick={() => handlePostClick(post)}
                >
                  {imageUrl && (
                    <img 
                      src={imageUrl[1]} 
                      alt="Post Thumbnail" 
                      style={styles.postImage}
                    />
                  )}
                  <div style={styles.postContent}>
                    <h3 style={styles.postTitle}>{post.title}</h3>
                    <p style={styles.postDescription}>
                      {post.body.substring(0, 150)}...
                    </p>
                  </div>
                  <div style={styles.postFooter}>
                    <span>{new Date(post.created).toLocaleDateString()}</span>
                    <span style={{color: '#4A90E2'}}>Read more</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;