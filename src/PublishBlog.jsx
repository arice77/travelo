import React, { useState, useEffect } from 'react';
import { publishBlogPostOnHive } from './Publish';

// Markdown parser for preview (You'll need to install this: npm install marked)
import { marked } from 'marked';

const BlogPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [tagArray, setTagArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [category, setCategory] = useState('travel');
  
  const MAX_CONTENT_LENGTH = 64000; // Hive's limit
  const MAX_EXCERPT_LENGTH = 160; // Common SEO recommendation

  const categories = [
    'travel', 'photography', 'food', 'lifestyle', 
    'technology', 'crypto', 'finance', 'health', 
    'education', 'art', 'music', 'gaming', 'sports'
  ];
  
  useEffect(() => {
    // Parse tags whenever the tags input changes
    const parsed = tags.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag !== '');
    setTagArray(parsed);
    
    // Update character count
    setCharCount(content.length);
  }, [tags, content]);

  // For handling image uploads
  const handleImageUpload = (e) => {
    // In a real application, you would upload to IPFS or a similar service
    // For this example, we'll just use a placeholder
    setFeaturedImage('/api/placeholder/800/400');
  };
  
  const handleExternalImage = () => {
    if (imageUrl) {
      setFeaturedImage(imageUrl);
      setImageUrl('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (content.length > MAX_CONTENT_LENGTH) {
      setMessage('Error publishing blog post: Content exceeds maximum length');
      setLoading(false);
      return;
    }
    
    const blogDetails = {
      title,
      content,
      tags: tagArray,
      featuredImage,
      excerpt: excerpt || title,
      category,
      isDraft: saveAsDraft
    };
    
    try {
      // If it's a draft, we would save differently
      if (saveAsDraft) {
        // Mock function - in a real app, this would save to local storage or a database
        localStorage.setItem('hiveBlogDraft', JSON.stringify(blogDetails));
        setMessage('Draft saved successfully!');
      } else {
        await publishBlogPostOnHive(blogDetails);
        setMessage('Blog post successfully published on the blockchain!');
        setTitle('');
        setContent('');
        setTags('');
        setFeaturedImage('');
        setExcerpt('');
        setSaveAsDraft(false);
      }
    } catch (error) {
      setMessage('Error publishing blog post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // Create HTML from markdown for preview
  const createMarkup = () => {
    return {__html: marked(content)};
  };
  
  const getCharCountClass = (count, max) => {
    const percentage = (count / max) * 100;
    if (percentage > 90) return {...styles.charCount, ...styles.charCountDanger};
    if (percentage > 75) return {...styles.charCount, ...styles.charCountWarning};
    return styles.charCount;
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('hiveBlogDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setContent(draft.content || '');
      setTags(draft.tags ? draft.tags.join(', ') : '');
      setFeaturedImage(draft.featuredImage || '');
      setExcerpt(draft.excerpt || '');
      setCategory(draft.category || 'travel');
      setMessage('Draft loaded successfully!');
    } else {
      setMessage('No saved drafts found.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src="/api/placeholder/80/80" alt="Hive Blog" style={styles.logo} />
      </div>
      
      <h2 style={styles.title}>Create a New Blog Post</h2>
      
      <div style={styles.toolbar}>
        <button 
          onClick={togglePreview} 
          style={isPreview ? {...styles.toolbarButton, ...styles.activeButton} : styles.toolbarButton}
        >
          {isPreview ? 'Edit Mode' : 'Preview'}
        </button>
        <button 
          onClick={loadDraft} 
          style={styles.toolbarButton}
        >
          Load Draft
        </button>
      </div>
      
      {!isPreview ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter an engaging title for your blog post"
              style={styles.input}
              maxLength={255}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Featured Image</label>
            <div style={styles.imageUploadContainer}>
              <div style={styles.imageInputContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                />
                <button type="button" style={styles.uploadButton}>Upload Image</button>
                <span style={styles.or}>OR</span>
                <div style={styles.urlInputContainer}>
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{...styles.input, ...styles.urlInput}}
                  />
                  <button 
                    type="button" 
                    onClick={handleExternalImage} 
                    style={styles.urlButton}
                  >
                    Use URL
                  </button>
                </div>
              </div>
              {featuredImage && (
                <div style={styles.imagePreviewContainer}>
                  <img src={featuredImage} alt="Featured" style={styles.imagePreview} />
                  <button 
                    type="button" 
                    onClick={() => setFeaturedImage('')}
                    style={styles.removeImageButton}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="excerpt" style={styles.label}>
              Excerpt <span style={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Add a short description for your post (good for SEO)"
              style={{...styles.textarea, ...styles.excerptTextarea}}
              maxLength={MAX_EXCERPT_LENGTH}
            />
            <div style={getCharCountClass(excerpt.length, MAX_EXCERPT_LENGTH)}>
              {excerpt.length} / {MAX_EXCERPT_LENGTH} characters
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="category" style={styles.label}>Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="content" style={styles.label}>Content</label>
            <div style={styles.editorToolbar}>
              <button type="button" onClick={() => setContent(content + '# ')} style={styles.editorButton}>H1</button>
              <button type="button" onClick={() => setContent(content + '## ')} style={styles.editorButton}>H2</button>
              <button type="button" onClick={() => setContent(content + '### ')} style={styles.editorButton}>H3</button>
              <button type="button" onClick={() => setContent(content + '**Bold**')} style={styles.editorButton}>B</button>
              <button type="button" onClick={() => setContent(content + '*Italic*')} style={styles.editorButton}>I</button>
              <button type="button" onClick={() => setContent(content + '[Link](https://example.com)')} style={styles.editorButton}>Link</button>
              <button type="button" onClick={() => setContent(content + '![Alt text](image-url)')} style={styles.editorButton}>Image</button>
              <button type="button" onClick={() => setContent(content + '\n- List item\n- List item\n')} style={styles.editorButton}>List</button>
              <button type="button" onClick={() => setContent(content + '\n> Blockquote\n')} style={styles.editorButton}>Quote</button>
              <button type="button" onClick={() => setContent(content + '\n```\ncode block\n```\n')} style={styles.editorButton}>Code</button>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write about your travel journey here...\n\nYou can use Markdown formatting for your content."
              style={styles.textarea}
            />
            <div style={getCharCountClass(charCount, MAX_CONTENT_LENGTH)}>
              {charCount} / {MAX_CONTENT_LENGTH} characters
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="tags" style={styles.label}>Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="travel, photography, adventure, nature"
              style={styles.input}
            />
            
            {tagArray.length > 0 && (
              <div style={styles.tagPreview}>
                {tagArray.map((tag, index) => (
                  <span key={index} style={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.publishOptions}>
            <label style={{...styles.label, ...styles.checkboxLabel}}>
              <input
                type="checkbox"
                checked={saveAsDraft}
                onChange={(e) => setSaveAsDraft(e.target.checked)}
                style={styles.checkbox}
              />
              Save as draft
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || (!title && !saveAsDraft) || (!content && !saveAsDraft)} 
            style={loading ? {...styles.button, ...styles.disabledButton} : styles.button}
          >
            {loading ? 'Publishing...' : saveAsDraft ? 'Save Draft' : 'Publish Blog Post'}
          </button>
        </form>
      ) : (
        <div style={styles.previewContainer}>
          <div style={styles.previewHeader}>
            <h1 style={styles.previewTitle}>{title || 'Untitled Post'}</h1>
            {featuredImage && (
              <div style={styles.previewFeaturedImage}>
                <img src={featuredImage} alt="Featured" style={styles.previewImage} />
              </div>
            )}
            {excerpt && <p style={styles.previewExcerpt}>{excerpt}</p>}
            <div style={styles.previewMeta}>
              <span style={styles.previewCategory}>{category.toUpperCase()}</span>
              <span style={styles.previewDate}>{new Date().toLocaleDateString()}</span>
            </div>
            {tagArray.length > 0 && (
              <div style={styles.previewTags}>
                {tagArray.map((tag, index) => (
                  <span key={index} style={styles.previewTag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div 
            style={styles.previewContent}
            dangerouslySetInnerHTML={createMarkup()}
          />
        </div>
      )}
      
      {message && <div style={message.includes('Error') ? 
        {...styles.message, ...styles.errorMessage} : 
        {...styles.message, ...styles.successMessage}
      }>
        {message}
      </div>}
    </div>
  );
};
// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    width: '100%', // Changed from maxWidth: '900px'
    margin: '0 auto',
    fontFamily: "'Montserrat', sans-serif",
    background: 'linear-gradient(135deg, #E6F2FF, #CBE2F3)',
    minHeight: '100vh',
    color: '#2C3E50',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    width: '100%', // Added for full width
  },
  logo: {
    width: '80px',
    height: '80px',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },
  title: {
    fontSize: '2.2em',
    fontWeight: '700',
    marginBottom: '25px',
    color: '#2C3E50',
    textAlign: 'center',
    letterSpacing: '-0.5px',
    width: '100%', // Added for full width
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '20px',
  },
  toolbarButton: {
    padding: '10px 15px',
    backgroundColor: '#F7FBFF',
    color: '#4A90E2',
    border: '1px solid #4A90E2',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '0.9em',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
    color: 'white',
  },
  form: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    width: '100%', // Already set to 100%
    border: '1px solid rgba(70, 130, 180, 0.1)',
    position: 'relative',
  },
  formGroup: {
    marginBottom: '25px',
    width: '100%', // Added for full width
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4A5568',
    fontSize: '1.05em',
    width: '100%', // Added for full width
  },
  optional: {
    fontWeight: 'normal',
    fontSize: '0.85em',
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  input: {
    width: '100%', // Already set to 100%
    padding: '12px 15px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #4A90E2',
    transition: 'all 0.3s ease',
    backgroundColor: '#F7FBFF',
    color: '#2C3E50',
    fontFamily: "'Montserrat', sans-serif",
  },
  textarea: {
    width: '100%', // Already set to 100%
    minHeight: '250px',
    padding: '15px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #4A90E2',
    transition: 'all 0.3s ease',
    backgroundColor: '#F7FBFF',
    color: '#2C3E50',
    resize: 'vertical',
    fontFamily: "'Montserrat', sans-serif",
  },
  excerptTextarea: {
    minHeight: '80px',
  },
  select: {
    width: '100%', // Already set to 100%
    padding: '12px 15px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #4A90E2',
    backgroundColor: '#F7FBFF',
    color: '#2C3E50',
    fontFamily: "'Montserrat', sans-serif",
    appearance: 'none',
    backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%234A90E2\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px top 50%',
    backgroundSize: '12px',
  },
  editorToolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#F7FBFF',
    borderRadius: '8px',
    border: '1px solid #E0E7FF',
    width: '100%', // Added for full width
  },
  editorButton: {
    padding: '6px 12px',
    backgroundColor: 'white',
    border: '1px solid #CBD5E0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85em',
    color: '#4A5568',
  },
  button: {
    width: '100%', // Already set to 100%
    padding: '14px',
    fontSize: '1.05em',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3CB371',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(60, 179, 113, 0.3)',
    fontFamily: "'Montserrat', sans-serif",
  },
  disabledButton: {
    backgroundColor: '#7DCEA0',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.85em',
    color: '#7F8C8D',
    marginTop: '5px',
    width: '100%', // Added for full width
  },
  charCountWarning: {
    color: '#E67E22',
  },
  charCountDanger: {
    color: '#E74C3C',
  },
  tagPreview: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
    width: '100%', // Added for full width
  },
  tag: {
    backgroundColor: '#EBF5FF',
    color: '#4A90E2',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '500',
  },
  message: {
    marginTop: '25px',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500',
    width: '100%', // Already set to 100%
    animation: 'fadeIn 0.5s ease-in-out',
  },
  successMessage: {
    backgroundColor: '#E8F5E9',
    borderLeft: '4px solid #3CB371',
    color: '#2E8B57',
  },
  errorMessage: {
    backgroundColor: '#FFEBEE',
    borderLeft: '4px solid #E57373',
    color: '#C62828',
  },
  // Image upload styles
  imageUploadContainer: {
    marginTop: '10px',
    width: '100%', // Added for full width
  },
  imageInputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    width: '100%', // Added for full width
  },
  fileInput: {
    position: 'absolute',
    left: '-9999px',
  },
  uploadButton: {
    padding: '10px 15px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  or: {
    margin: '0 10px',
    color: '#7F8C8D',
  },
  urlInputContainer: {
    display: 'flex',
    flex: '1',
    width: '100%', // Added for full width
  },
  urlInput: {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    width: '100%', // Added to ensure full width of container
  },
  urlButton: {
    padding: '12px 15px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: '15px',
    position: 'relative',
    width: '100%', // Added for full width
  },
  imagePreview: {
    width: '100%', // Already set to 100%
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  removeImageButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#E74C3C',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  // Preview styles
  previewContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    width: '100%', // Already set to 100%
    border: '1px solid rgba(70, 130, 180, 0.1)',
  },
  previewHeader: {
    marginBottom: '30px',
    width: '100%', // Added for full width
  },
  previewTitle: {
    fontSize: '2.5em',
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: '20px',
    width: '100%', // Added for full width
  },
  previewFeaturedImage: {
    marginBottom: '20px',
    width: '100%', // Added for full width
  },
  previewImage: {
    width: '100%', // Already set to 100%
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  previewExcerpt: {
    fontSize: '1.2em',
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: '15px',
    borderLeft: '4px solid #E0E7FF',
    paddingLeft: '15px',
    width: '100%', // Added for full width
  },
  previewMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    fontSize: '0.9em',
    color: '#7F8C8D',
    width: '100%', // Added for full width
  },
  previewCategory: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  previewDate: {
    
  },
  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
    width: '100%', // Added for full width
  },
  previewTag: {
    backgroundColor: '#EBF5FF',
    color: '#4A90E2',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '500',
  },
  previewContent: {
    lineHeight: '1.6',
    fontSize: '1.1em',
    color: '#2C3E50',
    width: '100%', // Added for full width
  },
  publishOptions: {
    marginBottom: '20px',
    width: '100%', // Added for full width
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    width: '100%', // Added for full width
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
};

export default BlogPostPage; 