import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeychainSDK } from 'keychain-sdk';
import { Heart, Send, Clock, Share2, User, Calendar, MapPin, Camera } from 'lucide-react';
import { 
  calculateReadingTime, 
  extractTags, 
  processBlogContent, 
  formatDate, 
  generateAvatar, 
  getOptimizedImageSources 
} from './utils/blogUtils';
import './BlogPost.css';

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || { post: {} };

  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('HIVE');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const articleRef = useRef(null);
  const imageObserver = useRef(null);

  const username = localStorage.getItem('username');

  // Set up scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const totalHeight = articleRef.current.scrollHeight - articleRef.current.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set up image loading with Intersection Observer
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      imageObserver.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.classList.remove('image-hidden');
              img.classList.add('image-visible');
              imageObserver.current.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });
    }

    return () => {
      if (imageObserver.current) {
        imageObserver.current.disconnect();
      }
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E6F2FF, #CBE2F3)',
      fontFamily: "'Montserrat', sans-serif",
      padding: '20px 0',
    },
    article: {
      maxWidth: '100%',
      width: '100%',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '0',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      border: 'none',
    },
    header: {
      padding: '40px 5%',
      borderBottom: '1px solid rgba(70, 130, 180, 0.1)',
      background: 'linear-gradient(to right, #ffffff, #f7fafc)',
    },
    title: {
      fontSize: '2.5em',
      fontWeight: '700',
      color: '#2C3E50',
      marginBottom: '15px',
      letterSpacing: '-0.5px',
      lineHeight: '1.3',
    },
    metaBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      flexWrap: 'wrap',
      gap: '10px',
    },
    authorLine: {
      display: 'flex',
      alignItems: 'center',
      color: '#7F8C8D',
      fontSize: '0.95em',
      flexWrap: 'wrap',
      gap: '15px',
    },
    authorInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    authorAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#4A90E2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontWeight: '600',
      marginRight: '10px',
    },
    content: {
      padding: '40px 5%',
      color: '#34495E',
      fontSize: '1.05em',
      lineHeight: '1.7',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    paragraph: {
      marginBottom: '24px',
      fontSize: '1.05em',
      lineHeight: '1.8',
    },
    heading: {
      fontSize: '1.8em',
      fontWeight: '700',
      color: '#2C3E50',
      margin: '40px 0 20px',
      letterSpacing: '-0.3px',
    },
    imageContainer: {
      margin: '30px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      maxWidth: '100%',
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      margin: '30px 0',
    },
    image: {
      width: '100%',
      height: 'auto',
      display: 'block',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    },
    imageCaption: {
      fontSize: '0.9em',
      color: '#7F8C8D',
      textAlign: 'center',
      padding: '10px 15px',
      backgroundColor: '#f8f9fa',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      borderTop: '1px solid #eaecef',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '15px',
    },
    tag: {
      backgroundColor: '#F0F7FF',
      color: '#4A90E2',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.85em',
      fontWeight: '500',
    },
    actionBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '25px 5%',
      borderTop: '1px solid rgba(70, 130, 180, 0.1)',
      backgroundColor: '#F7FBFF',
      flexWrap: 'wrap',
      gap: '15px',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
    },
    upvoteButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isUpvoted ? '#28A745' : '#3CB371',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '30px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(60, 179, 113, 0.3)',
    },
    shareButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#4A90E2',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '30px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
    },
    transferContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    input: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #4A90E2',
      fontSize: '0.95em',
      width: '120px',
      backgroundColor: '#F7FBFF',
      transition: 'all 0.3s ease',
    },
    select: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #4A90E2',
      fontSize: '0.95em',
      backgroundColor: '#F7FBFF',
      color: '#2C3E50',
    },
    transferButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#F39C12',
      color: 'white',
      padding: '12px 22px',
      borderRadius: '30px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(243, 156, 18, 0.3)',
    },
    disabledButton: {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
    disabledInput: {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
    icon: {
      marginRight: '10px',
      fontSize: '1.1em',
    },
    footer: {
      padding: '30px 5%',
      borderTop: '1px solid rgba(70, 130, 180, 0.1)',
      textAlign: 'center',
      color: '#7F8C8D',
      fontSize: '0.9em',
      backgroundColor: '#f8f9fa',
    },
    htmlContent: {
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: '4px solid #4A90E2',
    },
    contentSection: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      lineHeight: '1.8',
    },
    heading1: {
      fontSize: '2.5em',
      fontWeight: '700',
      color: '#2C3E50',
      margin: '1.5em 0 0.8em',
    },
    heading2: {
      fontSize: '2em',
      fontWeight: '600',
      color: '#2C3E50',
      margin: '1.2em 0 0.6em',
    },
    heading3: {
      fontSize: '1.75em',
      fontWeight: '600',
      color: '#2C3E50',
      margin: '1em 0 0.5em',
    },
    divider: {
      margin: '2em 0',
      border: 'none',
      borderTop: '1px solid #E0E0E0',
    },
    imageGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      margin: '2em 0',
    },
    iframeContainer: {
      position: 'relative',
      width: '100%',
      paddingBottom: '56.25%', // 16:9 aspect ratio
      margin: '2em 0',
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
    },
  };

  if (!post || !post.body) {
    return (
      <div className="blog-container">
        <div style={{
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          padding: '40px',
          backgroundColor: 'var(--background-card)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}>
          Post not found
        </div>
      </div>
    );
  }

  const handleUpvote = async () => {
    const storedUsername = localStorage.getItem('username');

    if (!storedUsername || storedUsername.trim() === '') {
      alert('Please log in first to upvote');
      navigate('/');
      return;
    }

    if (!window.hive_keychain) {
      alert('Hive Keychain extension not found. Please install it to proceed.');
      return;
    }

    try {
      const keychain = new KeychainSDK(window);
      const voteWeight = 10000; // 100% upvote
      
      const voteData = {
        username: storedUsername.trim(),
        permlink: post.permlink,
        author: post.author,
        weight: voteWeight,
        remark: 'Blog post vote'
      };

      // First check if post exists and user hasn't already voted
      try {
        const response = await fetch('https://api.hive.blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.get_active_votes',
            params: [post.author, post.permlink],
            id: 1
          }),
        });

        const votesData = await response.json();
        if (votesData.result) {
          const hasVoted = votesData.result.some(vote => vote.voter === storedUsername);
          if (hasVoted) {
            alert('You have already voted on this post!');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      }

      // Proceed with voting
      const vote = await keychain.vote(voteData);
      
      if (vote.success) {
        setIsUpvoted(true);
        alert('Upvote successful!');
      } else {
        if (vote.error && vote.error.message) {
          alert(`Upvote failed: ${vote.error.message}`);
        } else if (vote.message) {
          alert(`Upvote failed: ${vote.message}`);
        } else {
          alert('Upvote failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error while upvoting:', error);
      if (error.message === 'Failed to fetch') {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert(`Error while upvoting: ${error.message}`);
      }
    }
  };

  const handleTransfer = async () => {
    setIsTransferring(true);
    const storedUsername = localStorage.getItem('username');

    try {
      if (!storedUsername || storedUsername.trim() === '') {
        alert('Please log in first to send tips');
        navigate('/');
        return;
      }

      if (!window.hive_keychain) {
        alert('Hive Keychain extension not found. Please install it to proceed.');
        return;
      }

      if (!transferAmount || parseFloat(transferAmount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      const amount = parseFloat(transferAmount).toFixed(3);
      const currency = transferCurrency.toUpperCase();

      // First verify the recipient account exists
      try {
        const response = await fetch('https://api.hive.blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.get_accounts',
            params: [[post.author]],
            id: 1
          }),
        });

        const accountData = await response.json();
        if (!accountData.result || accountData.result.length === 0) {
          throw new Error('Recipient account not found');
        }
      } catch (error) {
        console.error('Error verifying recipient account:', error);
        alert('Unable to verify recipient account. Please try again.');
        return;
      }

      // Proceed with transfer
      window.hive_keychain.requestTransfer(
        storedUsername.trim(),
        post.author,
        amount,
        'Supporting the author',
        currency,
        (response) => {
          if (response.success) {
            alert('Transfer successful! Thank you for supporting the author.');
            setTransferAmount('');
          } else {
            console.error('Transfer error:', response);
            if (response.error && response.error.message) {
              alert(`Transfer failed: ${response.error.message}`);
            } else if (response.message) {
              alert(`Transfer failed: ${response.message}`);
            } else {
              alert('Transfer failed. Please try again.');
            }
          }
          setIsTransferring(false);
        },
        true
      );
    } catch (error) {
      console.error('Error while transferring:', error);
      if (error.message === 'Failed to fetch') {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert(`Error while transferring: ${error.message}`);
      }
      setIsTransferring(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this post by ${post.author}`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  const formattedDate = formatDate(post.created);
  const processedContent = processBlogContent(post.body);
  const avatar = generateAvatar(post.author);
  const tags = extractTags(post.body);
  const readingTime = calculateReadingTime(post.body);

  // Create a reference handler for lazy loading images
  const handleImageRef = (img) => {
    if (img && imageObserver.current) {
      imageObserver.current.observe(img);
    }
  };

  // Image loading state tracker
  const handleImageLoad = (imgId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imgId]: true
    }));
  };

  // Render blog content with improved styling
  const renderContent = (sections) => {
    return sections.map((section, index) => {
      switch (section.type) {
        case 'heading':
          const headingClassName = `blog-heading${section.level}`;
          return (
            <h1 key={index} className={headingClassName}
                dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        case 'paragraph':
          return (
            <p key={index} className="blog-paragraph"
               dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        case 'divider':
          return <hr key={index} className="blog-divider" />;
        case 'imageGroup':
          return (
            <div key={index} className="blog-image-group">
              {section.images.map((img, imgIndex) => {
                const imgId = `img-${index}-${imgIndex}`;
                const isLoaded = imagesLoaded[imgId];
                const imgOptions = getOptimizedImageSources(img.url);
                
                return (
                  <div key={imgIndex} className="blog-image-container">
                    {!isLoaded && (
                      <div className="blog-image-placeholder image-loading">
                        <Camera size={32} color="#CBD5E0" />
                      </div>
                    )}
                    <img
                      className={`blog-image image-hidden ${isLoaded ? 'image-visible' : ''}`}
                      ref={handleImageRef}
                      data-src={img.url}
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
                      alt={img.alt || "Blog image"}
                      onLoad={() => handleImageLoad(imgId)}
                      {...imgOptions}
                    />
                    {img.alt && (
                      <div className="blog-image-caption">
                        {img.alt}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        case 'iframe':
          return (
            <div key={index} className="blog-iframe-container"
                 dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="blog-container">
      {/* Reading progress indicator */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>
      
      <article ref={articleRef} className="blog-article">
        <header className="blog-header">
          <h1 className="blog-title">{post.title}</h1>
          
          <div className="blog-meta-bar">
            <div className="blog-author-line">
              <div className="blog-author-info">
                <div className="blog-author-avatar" style={{ backgroundColor: avatar.color }}>
                  {avatar.letter}
                </div>
                <div>
                  <div className="blog-author-name">{post.author}</div>
                  <div className="blog-author-date">{formattedDate}</div>
                </div>
              </div>
              
              <div className="reading-time">
                <Clock size={14} />
                {readingTime} min read
              </div>
            </div>
            
            <div className="blog-tag-container">
              {tags.map(tag => (
                <span key={tag} className="blog-tag">#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="blog-content">
          {renderContent(processedContent)}
        </div>

        <div className="blog-action-bar">
          <div className="blog-action-buttons">
            <button 
              onClick={handleUpvote} 
              className={`blog-upvote-button ${isUpvoted ? 'blog-upvoted' : ''}`}
            >
              <Heart size={18} style={{ marginRight: '8px' }} /> 
              {isUpvoted ? 'Upvoted' : 'Upvote'}
            </button>
            
            <button 
              onClick={handleShare} 
              className="blog-share-button"
            >
              <Share2 size={18} style={{ marginRight: '8px' }} /> 
              Share
            </button>
          </div>

          <div className="blog-transfer-container">
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              disabled={isTransferring}
              className={`blog-input ${isTransferring ? 'blog-disabled' : ''}`}
            />
            <select
              value={transferCurrency}
              onChange={(e) => setTransferCurrency(e.target.value)}
              disabled={isTransferring}
              className={`blog-select ${isTransferring ? 'blog-disabled' : ''}`}
            >
              <option value="HIVE">HIVE</option>
              <option value="HBD">HBD</option>
            </select>
            <button
              onClick={handleTransfer}
              disabled={isTransferring || !transferAmount}
              className={`blog-transfer-button ${isTransferring || !transferAmount ? 'blog-disabled' : ''}`}
            >
              <Send size={18} style={{ marginRight: '8px' }} />
              {isTransferring ? 'Sending...' : 'Send Tip'}
            </button>
          </div>
        </div>
        
        <div className="blog-footer">
          Thanks for reading! Follow {post.author} for more content.
        </div>
      </article>
    </div>
  );
};

export default BlogPost;