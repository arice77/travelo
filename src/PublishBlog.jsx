import React, { useState, useEffect } from 'react';
import { publishBlogPostOnHive } from './Publish';
import { marked } from 'marked';
import { Globe, Image, Upload, Check, AlertTriangle, X, Edit, Eye, FileText, Tag, Save, Send, Camera, AlignLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
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
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('Error: Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleExternalImage = () => {
    if (!imageUrl) {
      setMessage('Error: Please enter an image URL');
      return;
    }
    
    if (!imageUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
      setMessage('Error: URL does not point to a valid image format');
      return;
    }
    
    setFeaturedImage(imageUrl);
    setImageUrl('');
    setMessage('');
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (content.length > MAX_CONTENT_LENGTH) {
      setMessage('Error: Content exceeds maximum length');
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
        setIsPreview(false);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
      // Scroll to the message to make it visible
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  const togglePreview = () => {
    setIsPreview(!isPreview);
    // Scroll to top when switching views
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Create HTML from markdown for preview
  const createMarkup = () => {
    return {__html: marked(content || '*No content yet. Switch to Edit Mode to add content.*')};
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
      setIsPreview(false); // Switch to edit mode
    } else {
      setMessage('Error: No saved drafts found.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Enhanced Navigation Bar */}
      <div style={styles.navigationBar}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <Globe size={30} style={{marginRight: '10px'}} /> Travelo
        </div>
        <div style={styles.navLinks}>
          <div style={styles.navLink} onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Home</span>
          </div>
          <div style={styles.navLink} onClick={() => navigate('/profile')}>
            <img 
              src={localStorage.getItem('profilePic') || 'https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff'} 
              alt="Profile" 
              style={styles.profilePic} 
            />
            <span>{localStorage.getItem('username') || 'User'}</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Share Your Travel Experience</h1>
          <p style={styles.heroSubtitle}>
            Create and publish your travel stories to inspire adventurers around the world
          </p>
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <Camera size={24} />
              <span>Showcase Travel Photos</span>
            </div>
            <div style={styles.statItem}>
              <AlignLeft size={24} />
              <span>Tell Your Story</span>
            </div>
            <div style={styles.statItem}>
              <Globe size={24} />
              <span>Reach Global Audience</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={styles.contentWrapper}>
        <div style={styles.publishContainer}>
          <div style={styles.actionToolbar}>
            <button 
              onClick={togglePreview} 
              style={isPreview ? {...styles.actionButton, ...styles.activeButton} : styles.actionButton}
            >
              {isPreview ? <Edit size={18} /> : <Eye size={18} />}
              {isPreview ? 'Edit Mode' : 'Preview'}
            </button>
            <button 
              onClick={loadDraft} 
              style={styles.actionButton}
            >
              <FileText size={18} />
              Load Draft
            </button>
          </div>
          
          {/* Form or Preview based on state */}
          {!isPreview ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.sectionTitle}>Blog Details</div>
              
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
              
              <div style={styles.formGrid}>
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
                  
                  <div style={styles.formGroup}>
                    <label htmlFor="tags" style={{...styles.label, marginTop: '20px'}}>Tags (comma separated)</label>
                    <div style={styles.tagInputContainer}>
                      <Tag size={18} style={styles.tagIcon} />
                      <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="travel, photography, adventure, nature"
                        style={styles.tagInput}
                      />
                    </div>
                    
                    {tagArray.length > 0 && (
                      <div style={styles.tagPreview}>
                        {tagArray.map((tag, index) => (
                          <span key={index} style={styles.tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={styles.sectionTitle}>Featured Image</div>
              
              <div style={styles.formGroup}>
                <div style={styles.imageUploadContainer}>
                  {!featuredImage ? (
                    <div style={styles.imageDropzone} onClick={() => document.getElementById('file-upload').click()}>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={styles.fileInput}
                      />
                      <Image size={32} style={{color: '#4A90E2', marginBottom: '10px'}} />
                      <p style={styles.dropzoneText}>Drag & drop an image here or click to browse</p>
                      <p style={styles.dropzoneSubtext}>Supports: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                  ) : (
                    <div style={styles.imagePreviewContainer}>
                      <img src={featuredImage} alt="Featured" style={styles.imagePreview} />
                      <button 
                        type="button" 
                        onClick={() => setFeaturedImage('')}
                        style={styles.removeImageButton}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  <div style={styles.imageUrlContainer}>
                    <p style={styles.orText}>
                      <span style={{width: '80px', height: '1px', backgroundColor: '#CBD5E0'}}></span>
                      OR
                      <span style={{width: '80px', height: '1px', backgroundColor: '#CBD5E0'}}></span>
                    </p>
                    <div style={styles.urlInputContainer}>
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{...styles.input, borderTopRightRadius: 0, borderBottomRightRadius: 0}}
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
                </div>
              </div>
              
              <div style={styles.sectionTitle}>Blog Content</div>
              
              <div style={styles.formGroup}>
                <label htmlFor="content" style={styles.label}>Content</label>
                <div style={styles.editorToolbar}>
                  <button type="button" onClick={() => setContent(content + '# ')} style={styles.editorButton}>H1</button>
                  <button type="button" onClick={() => setContent(content + '## ')} style={styles.editorButton}>H2</button>
                  <button type="button" onClick={() => setContent(content + '### ')} style={styles.editorButton}>H3</button>
                  <button type="button" onClick={() => setContent(content + '**Bold**')} style={styles.editorButton}><strong>B</strong></button>
                  <button type="button" onClick={() => setContent(content + '*Italic*')} style={styles.editorButton}><em>I</em></button>
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
                  placeholder="Share your travel story — describe the sights, sounds, and experiences that made this journey special..."
                  style={styles.textarea}
                />
                <div style={getCharCountClass(charCount, MAX_CONTENT_LENGTH)}>
                  {charCount} / {MAX_CONTENT_LENGTH} characters
                </div>
              </div>
              
              <div style={styles.publishOptions}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={saveAsDraft}
                    onChange={(e) => setSaveAsDraft(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span>Save as draft for later</span>
                </label>
              </div>
              
              <div style={styles.buttonContainer}>
                <button 
                  type="submit" 
                  disabled={loading || (!title && !saveAsDraft) || (!content && !saveAsDraft)} 
                  style={loading ? {...styles.button, ...styles.disabledButton} : styles.button}
                >
                  {loading ? (
                    <>Publishing...</>
                  ) : saveAsDraft ? (
                    <><Save size={18} /> Save Draft</>
                  ) : (
                    <><Send size={18} /> Publish Blog Post</>
                  )}
                </button>
              </div>
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
                  <span style={styles.previewAuthor}>By {localStorage.getItem('username') || 'Anonymous'}</span>
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
              
              <div style={styles.buttonContainer}>
                <button 
                  onClick={togglePreview}
                  style={{...styles.button, ...styles.secondaryButton}}
                >
                  <Edit size={18} /> Edit Content
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !title || !content} 
                  style={loading ? {...styles.button, ...styles.disabledButton} : styles.button}
                >
                  {loading ? 'Publishing...' : <><Send size={18} /> Publish Blog Post</>}
                </button>
              </div>
            </div>
          )}
          
          {/* Message display */}
          {message && <div style={message.includes('Error') ? 
            {...styles.message, ...styles.errorMessage} : 
            {...styles.message, ...styles.successMessage}
          }>
            {message.includes('Error') ? <AlertTriangle size={20} /> : <Check size={20} />}
            {message}
          </div>}
        </div>
      </div>
    </div>
  );
};
// Inline styles
const styles = {
  pageContainer: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f4f7f6',
    margin: 0,
    padding: 0,
    width: '100%',
    minHeight: '100vh',
  },
  navigationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 5%',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.5em',
    color: '#2C3E50',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#4A5568',
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  profilePic: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  heroSection: {
    backgroundImage: 'linear-gradient(135deg, #4A90E2, #3CB371), url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4)',
    backgroundBlendMode: 'overlay',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: 'fadeIn 1s ease-out',
    color: 'white',
    padding: '80px 5%',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '900px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5em',
    fontWeight: 800,
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    fontFamily: "'Montserrat', sans-serif",
  },
  heroSubtitle: {
    fontSize: '1.3em',
    opacity: 0.9,
    marginBottom: '40px',
    lineHeight: 1.6,
    maxWidth: '700px',
    margin: '0 auto 40px auto',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginTop: '30px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 60px',
  },
  publishContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  actionToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '15px 20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #edf2f7',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#4A5568',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9em',
    marginLeft: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    color: 'white',
  },
  form: {
    padding: '30px',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2D3748',
    fontSize: '0.95em',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F7FAFC',
    color: '#2D3748',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  textarea: {
    width: '100%',
    minHeight: '250px',
    padding: '16px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F7FAFC',
    color: '#2D3748',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
    lineHeight: '1.6',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  excerptTextarea: {
    minHeight: '80px',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F7FAFC',
    color: '#2D3748',
    appearance: 'none',
    backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%232D3748\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px top 50%',
    backgroundSize: '12px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  editorToolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  },
  editorButton: {
    padding: '8px 12px',
    backgroundColor: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85em',
    color: '#4A5568',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    fontSize: '1.05em',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#3CB371',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(60, 179, 113, 0.3)',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    backgroundColor: '#4A90E2',
    boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
    marginBottom: '15px',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
    cursor: 'not-allowed',
    boxShadow: 'none',
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: '30px',
  },
  optional: {
    fontWeight: 'normal',
    fontSize: '0.85em',
    color: '#718096',
    fontStyle: 'italic',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.85em',
    color: '#718096',
    marginTop: '5px',
  },
  charCountWarning: {
    color: '#ED8936',
  },
  charCountDanger: {
    color: '#E53E3E',
  },
  tagInputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#F7FAFC',
    padding: '0 12px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
  },
  tagIcon: {
    color: '#4A5568',
    marginRight: '8px',
  },
  tagInput: {
    flex: 1,
    padding: '14px 0',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '1em',
    color: '#2D3748',
    outline: 'none',
  },
  tagPreview: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#F7FAFC',
    borderRadius: '8px',
    animation: 'fadeIn 0.3s ease',
  },
  tag: {
    backgroundColor: '#EBF8FF',
    color: '#4299E1',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9em',
    fontWeight: '500',
    boxShadow: '0 1px 2px rgba(66, 153, 225, 0.15)',
    transition: 'all 0.2s ease',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '25px 30px',
    padding: '16px 20px',
    borderRadius: '10px',
    fontWeight: '500',
    animation: 'fadeIn 0.5s ease-in-out',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  successMessage: {
    backgroundColor: '#F0FFF4',
    borderLeft: '4px solid #48BB78',
    color: '#2F855A',
  },
  errorMessage: {
    backgroundColor: '#FFF5F5',
    borderLeft: '4px solid #F56565',
    color: '#C53030',
  },
  imageUploadContainer: {
    marginTop: '10px',
  },
  imageDropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    border: '2px dashed #CBD5E0',
    borderRadius: '12px',
    backgroundColor: '#F7FAFC',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundImage: 'radial-gradient(circle, #f9f9f9 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  dropzoneText: {
    fontSize: '1em',
    color: '#4A5568',
    marginBottom: '5px',
    fontWeight: '500',
  },
  dropzoneSubtext: {
    fontSize: '0.85em',
    color: '#718096',
  },
  fileInput: {
    display: 'none',
  },
  imageUrlContainer: {
    marginTop: '15px',
  },
  orText: {
    textAlign: 'center',
    color: '#718096',
    margin: '15px 0',
    position: 'relative',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  urlInputContainer: {
    display: 'flex',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  urlButton: {
    padding: '14px 20px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s ease',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: '20px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  imagePreview: {
    width: '100%',
    objectFit: 'cover',
    maxHeight: '400px',
    display: 'block',
    transition: 'transform 0.3s ease',
  },
  removeImageButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  previewContainer: {
    padding: '30px',
  },
  previewHeader: {
    marginBottom: '30px',
    animation: 'fadeIn 0.5s ease',
  },
  previewTitle: {
    fontSize: '2.5em',
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: '25px',
    fontFamily: "'Montserrat', sans-serif",
    lineHeight: '1.2',
  },
  previewFeaturedImage: {
    marginBottom: '30px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
  previewImage: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
  },
  previewExcerpt: {
    fontSize: '1.25em',
    color: '#4A5568',
    fontStyle: 'italic',
    marginBottom: '25px',
    borderLeft: '4px solid #4A90E2',
    paddingLeft: '20px',
    fontFamily: "'Merriweather', serif",
    lineHeight: '1.7',
    background: 'linear-gradient(to right, rgba(74, 144, 226, 0.1), transparent)',
    padding: '15px 20px',
    borderRadius: '0 8px 8px 0',
  },
  previewMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
    fontSize: '0.95em',
    color: '#718096',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  previewCategory: {
    color: '#4A90E2',
    fontWeight: '700',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: '5px 12px',
    borderRadius: '20px',
  },
  previewDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  previewAuthor: {
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  previewTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '35px',
  },
  previewTag: {
    backgroundColor: '#EBF8FF',
    color: '#4299E1',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  previewContent: {
    lineHeight: '1.9',
    color: '#2D3748',
    fontFamily: "'Merriweather', serif",
    fontSize: '1.1em',
    '& h1, & h2, & h3': {
      fontFamily: "'Montserrat', sans-serif",
      color: '#1A202C',
      marginTop: '1.6em',
      marginBottom: '0.6em',
      fontWeight: '700',
    },
    '& h1': {
      fontSize: '2.2em',
      borderBottom: '1px solid #EDF2F7',
      paddingBottom: '0.3em',
    },
    '& h2': {
      fontSize: '1.6em',
    },
    '& h3': {
      fontSize: '1.35em',
    },
    '& p': {
      marginBottom: '1.6em',
    },
    '& img': {
      maxWidth: '100%',
      borderRadius: '10px',
      marginTop: '1.5em',
      marginBottom: '1.5em',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    },
    '& blockquote': {
      borderLeft: '4px solid #4A90E2',
      paddingLeft: '1.2em',
      fontStyle: 'italic',
      color: '#4A5568',
      margin: '1.5em 0',
      backgroundColor: 'rgba(74, 144, 226, 0.05)',
      padding: '1em',
      borderRadius: '0 8px 8px 0',
    },
    '& code': {
      fontFamily: "'Source Code Pro', monospace",
      backgroundColor: '#EDF2F7',
      padding: '0.2em 0.4em',
      borderRadius: '3px',
      fontSize: '0.9em',
    },
    '& pre': {
      backgroundColor: '#2D3748',
      color: '#E2E8F0',
      padding: '1.2em',
      borderRadius: '8px',
      overflow: 'auto',
      marginBottom: '1.5em',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
    },
    '& a': {
      color: '#4A90E2',
      textDecoration: 'underline',
      transition: 'color 0.2s ease',
    },
    '& ul, & ol': {
      marginBottom: '1.5em',
      paddingLeft: '1.5em',
    },
    '& li': {
      marginBottom: '0.5em',
    },
    animation: 'fadeIn 0.5s ease',
  },
  publishOptions: {
    marginBottom: '25px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#4A5568',
    backgroundColor: '#F7FAFC',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#3CB371',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  '@media (hover: hover)': {
    actionButton: {
      '&:hover': {
        backgroundColor: '#F7FAFC',
        transform: 'translateY(-1px)',
        boxShadow: '0 3px 5px rgba(0,0,0,0.08)',
      }
    },
    activeButton: {
      '&:hover': {
        backgroundColor: '#3A80D2',
      }
    },
    input: {
      '&:hover': {
        borderColor: '#CBD5E0',
      },
      '&:focus': {
        borderColor: '#4A90E2',
        boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.15)',
        outline: 'none',
      }
    },
    textarea: {
      '&:hover': {
        borderColor: '#CBD5E0',
      },
      '&:focus': {
        borderColor: '#4A90E2',
        boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.15)',
        outline: 'none',
      }
    },
    select: {
      '&:hover': {
        borderColor: '#CBD5E0',
      },
      '&:focus': {
        borderColor: '#4A90E2',
        boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.15)',
        outline: 'none',
      }
    },
    editorButton: {
      '&:hover': {
        backgroundColor: '#EDF2F7',
        transform: 'translateY(-1px)',
      }
    },
    button: {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(60, 179, 113, 0.3)',
        backgroundColor: '#34A065',
      }
    },
    secondaryButton: {
      '&:hover': {
        backgroundColor: '#3A80D2',
        boxShadow: '0 6px 12px rgba(74, 144, 226, 0.3)',
      }
    },
    logo: {
      '&:hover': {
        transform: 'scale(1.05)',
      }
    },
    navLink: {
      '&:hover': {
        backgroundColor: '#F7FAFC',
        color: '#4A90E2',
      }
    },
    imageDropzone: {
      '&:hover': {
        borderColor: '#4A90E2',
        backgroundColor: '#F0F7FF',
      }
    },
    removeImageButton: {
      '&:hover': {
        backgroundColor: 'rgba(229, 62, 62, 0.8)',
        transform: 'scale(1.1)',
      }
    },
    previewImage: {
      '&:hover': {
        transform: 'scale(1.02)',
      }
    },
    urlButton: {
      '&:hover': {
        backgroundColor: '#3A80D2',
      }
    },
    checkboxLabel: {
      '&:hover': {
        backgroundColor: '#EDF2F7',
        borderColor: '#CBD5E0',
      }
    },
    previewTag: {
      '&:hover': {
        backgroundColor: '#BEE3F8',
        transform: 'translateY(-1px)',
      }
    },
    tag: {
      '&:hover': {
        backgroundColor: '#BEE3F8',
        transform: 'translateY(-1px)',
      }
    },
  },
  '@media (max-width: 768px)': {
    heroTitle: {
      fontSize: '2.5em',
    },
    heroSubtitle: {
      fontSize: '1.1em',
    },
    heroStats: {
      gap: '20px',
    },
    contentWrapper: {
      padding: '20px 15px',
    },
    form: {
      padding: '20px',
    },
    previewContainer: {
      padding: '20px',
    },
    actionToolbar: {
      flexWrap: 'wrap',
      gap: '10px',
    },
    editorToolbar: {
      overflowX: 'auto',
      flexWrap: 'nowrap',
      paddingBottom: '10px',
    },
    editorButton: {
      flex: 'none',
    },
    previewTitle: {
      fontSize: '2em',
    },
    previewMeta: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '10px',
    },
    navLinks: {
      gap: '10px',
    },
    formGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
  },
  '@media (max-width: 480px)': {
    heroTitle: {
      fontSize: '2em',
    },
    heroSubtitle: {
      fontSize: '1em',
    },
    heroStats: {
      flexDirection: 'column',
      gap: '15px',
    },
    navLink: {
      '& span': {
        display: 'none',
      },
      padding: '8px',
    },
    actionButton: {
      padding: '8px 12px',
      fontSize: '0.8em',
    },
    previewTitle: {
      fontSize: '1.7em',
    },
  },
  sectionTitle: {
    fontSize: '1.2em',
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #EDF2F7',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px',
  },
};

export default BlogPostPage; 