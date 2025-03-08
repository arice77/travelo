import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { KeychainSDK } from 'keychain-sdk';
import { Heart, Send, ChevronDown, User, Calendar, MapPin, Camera, Share2 } from 'lucide-react';

const BlogPost = () => {
  const location = useLocation();
  const { post } = location.state || { post: {} };

  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('HIVE');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const username = localStorage.getItem('username');

  // Blog content processing - improved to handle various formats
  const processBlogContent = (content) => {
    if (!content) return [];
    
    const sections = [];
    const lines = content.split('\n');
    let currentParagraph = '';
    let imageGroup = [];
    
    const processMarkdown = (text) => {
      // Handle bold text
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Handle italic text
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Handle links
      text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      return text;
    };

    const addParagraph = (text) => {
      if (text.trim()) {
        sections.push({
          type: 'paragraph',
          content: processMarkdown(text.trim())
        });
      }
    };

    const addImageGroup = () => {
      if (imageGroup.length > 0) {
        sections.push({
          type: 'imageGroup',
          images: imageGroup
        });
        imageGroup = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle horizontal rules
      if (line.match(/^-{3,}$/) || line.match(/^\*{3,}$/)) {
        addParagraph(currentParagraph);
        currentParagraph = '';
        addImageGroup();
        sections.push({ type: 'divider' });
        continue;
      }

      // Handle headers
      if (line.startsWith('#')) {
        addParagraph(currentParagraph);
        currentParagraph = '';
        addImageGroup();
        const level = line.match(/^#+/)[0].length;
        const title = line.replace(/^#+\s*/, '');
        sections.push({
          type: 'heading',
          level,
          content: processMarkdown(title)
        });
        continue;
      }

      // Handle images
      const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        addParagraph(currentParagraph);
        currentParagraph = '';
        imageGroup.push({
          alt: imageMatch[1],
          url: imageMatch[2]
        });
        continue;
      }

      // Handle iframes (YouTube videos)
      if (line.startsWith('<iframe')) {
        addParagraph(currentParagraph);
        currentParagraph = '';
        addImageGroup();
        sections.push({
          type: 'iframe',
          content: line
        });
        continue;
      }

      // Accumulate paragraph text
      if (line !== '') {
        currentParagraph += (currentParagraph ? ' ' : '') + line;
      } else if (currentParagraph) {
        addParagraph(currentParagraph);
        currentParagraph = '';
      }
    }

    // Add any remaining content
    addParagraph(currentParagraph);
    addImageGroup();

    return sections;
  };

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
      <div style={{
        ...styles.container,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#7F8C8D',
          fontSize: '1.2em',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
        }}>
          Post not found
        </div>
      </div>
    );
  }

  const handleUpvote = async () => {
    try {
      const keychain = new KeychainSDK(window);
      const voteParams = {
        data: {
          username: username,
          permlink: post.permlink,
          author: post.author,
          weight: 10000,
        },
      };
      const vote = await keychain.vote(voteParams.data);
      console.log({ vote });
      if (vote.success) {
        setIsUpvoted(true);
        alert('Upvote successful!');
      } else {
        alert('Upvote failed.');
      }
    } catch (error) {
      console.error('Error while upvoting:', error);
    }
  };

  const handleTransfer = () => {
    setIsTransferring(true);
    try {
      if (window.hive_keychain) {
        const amount = parseFloat(transferAmount).toFixed(3);
        const currency = transferCurrency.toUpperCase();
        window.hive_keychain.requestTransfer(
          username,
          post.author,
          amount,
          'Supporting the author',
          currency,
          (response) => {
            console.log(response);
            if (response.success) {
              alert('Transfer successful!');
              setTransferAmount('');
            } else {
              alert('Transfer failed.');
            }
            setIsTransferring(false);
          },
          true
        );
      } else {
        alert('Hive Keychain extension is not installed.');
        setIsTransferring(false);
      }
    } catch (error) {
      console.error('Error while transferring:', error);
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

  const formattedDate = new Date(post.created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const processedContent = processBlogContent(post.body);
  const firstLetter = post.author ? post.author.charAt(0).toUpperCase() : 'A';
  
  // Extract tags from post (mock implementation - replace with actual data)
  const extractTagsFromContent = (content) => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    
    if (matches) {
      return matches.map(tag => tag.substring(1)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
    }
    
    // Default tags if none found
    return ['Hive', 'Blog'];
  };
  
  const tags = extractTagsFromContent(post.body);

  const renderContent = (sections) => {
    return sections.map((section, index) => {
      switch (section.type) {
        case 'heading':
          const HeadingStyle = styles[`heading${section.level}`];
          return (
            <h1 key={index} style={HeadingStyle} 
                dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        case 'paragraph':
          return (
            <p key={index} style={styles.paragraph}
               dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        case 'divider':
          return <hr key={index} style={styles.divider} />;
        case 'imageGroup':
          return (
            <div key={index} style={styles.imageGroup}>
              {section.images.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img.url}
                  alt={img.alt}
                  style={styles.image}
                  loading="lazy"
                />
              ))}
            </div>
          );
        case 'iframe':
          return (
            <div key={index} style={styles.iframeContainer}
                 dangerouslySetInnerHTML={{ __html: section.content }} />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div style={styles.container}>
      <article style={styles.article}>
        <header style={styles.header}>
          <h1 style={styles.title}>{post.title}</h1>
          
          <div style={styles.metaBar}>
            <div style={styles.authorLine}>
              <div style={styles.authorInfo}>
                <div style={styles.authorAvatar}>
                  {firstLetter}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '2px' }}>{post.author}</div>
                  <div style={{ fontSize: '0.9em', color: '#95A5A6' }}>{formattedDate}</div>
                </div>
              </div>
            </div>
            
            <div style={styles.tagContainer}>
              {tags.map(tag => (
                <span key={tag} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {renderContent(processedContent)}
        </div>

        <div style={styles.actionBar}>
          <div style={styles.actionButtons}>
            <button 
              onClick={handleUpvote} 
              style={styles.upvoteButton}
            >
              <Heart size={18} style={styles.icon} /> 
              {isUpvoted ? 'Upvoted' : 'Upvote'}
            </button>
            
            <button 
              onClick={handleShare} 
              style={styles.shareButton}
            >
              <Share2 size={18} style={styles.icon} /> 
              Share
            </button>
          </div>

          <div style={styles.transferContainer}>
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              disabled={isTransferring}
              style={{
                ...styles.input,
                ...(isTransferring && styles.disabledInput)
              }}
            />
            <select
              value={transferCurrency}
              onChange={(e) => setTransferCurrency(e.target.value)}
              disabled={isTransferring}
              style={{
                ...styles.select,
                ...(isTransferring && styles.disabledInput)
              }}
            >
              <option value="HIVE">HIVE</option>
              <option value="HBD">HBD</option>
            </select>
            <button
              onClick={handleTransfer}
              disabled={isTransferring || !transferAmount}
              style={{
                ...styles.transferButton,
                ...((isTransferring || !transferAmount) && styles.disabledButton)
              }}
            >
              <Send size={18} style={styles.icon} />
              {isTransferring ? 'Sending...' : 'Send Tip'}
            </button>
          </div>
        </div>
        
        <div style={styles.footer}>
          Thanks for reading! Follow {post.author} for more content.
        </div>
      </article>
    </div>
  );
};

export default BlogPost;