import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, PlusCircle, Globe, Search, MapPin, DollarSign, X, Image, Target, Clock, Award, BookOpen, Loader } from 'lucide-react';
import OptimizedImage from './components/OptimizedImage';

// Lazy load modals
const AdModal = React.lazy(() => import('./components/AdModal'));
const TipModal = React.lazy(() => import('./components/TipModal'));
const GuidesModal = React.lazy(() => import('./components/GuidesModal'));

const POSTS_PER_PAGE = 9;

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [username, setUsername] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [adFormData, setAdFormData] = useState({
    companyName: '',
    description: '',
    websiteUrl: '',
    adBudget: 10,
    image: null,
    targetAudience: '',
    duration: '24',
    category: '',
  });
  const [currentAd, setCurrentAd] = useState(null);
  const imageRegex = /\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif))\)/;
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('1.000');
  const [tipCurrency, setTipCurrency] = useState('HIVE');
  const [showGuidesModal, setShowGuidesModal] = useState(false);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Define advertising plans
  const adPlans = [
    {
      name: 'Basic',
      price: 10,
      features: [
        'Basic ad placement',
        '24-hour duration',
        'Text-only ad',
        'Basic analytics'
      ],
      color: 'bg-blue-500'
    },
    {
      name: 'Premium',
      price: 25,
      features: [
        'Premium placement',
        '72-hour duration',
        'Image support',
        'Advanced analytics',
        'Target audience selection'
      ],
      color: 'bg-purple-500'
    },
    {
      name: 'Enterprise',
      price: 50,
      features: [
        'Top placement',
        '7-day duration',
        'Multiple images',
        'Full analytics suite',
        'Priority support',
        'Custom targeting',
        'Category selection'
      ],
      color: 'bg-green-500'
    }
  ];

  // Update visible posts when page changes
  useEffect(() => {
    const filtered = recentPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVisiblePosts(filtered.slice(0, page * POSTS_PER_PAGE));
  }, [page, searchTerm, recentPosts]);

  // Initial data fetch
  useEffect(() => {
    const cachedPosts = localStorage.getItem('cachedPosts');
    const cachedTime = localStorage.getItem('lastFetchTime');
    
    if (cachedPosts && cachedTime) {
      const timeSinceLastFetch = Date.now() - parseInt(cachedTime);
      if (timeSinceLastFetch < CACHE_DURATION) {
        setRecentPosts(JSON.parse(cachedPosts));
        setIsLoading(false);
        setLastFetchTime(parseInt(cachedTime));
        return;
      }
    }
    
    fetchRecentPosts();
    fetchUsername();
  }, []); // Empty dependency array since this should only run once on mount

  // Check for existing ad on load
  useEffect(() => {
    const savedAd = localStorage.getItem('currentAd');
    if (savedAd) {
      const parsedAd = JSON.parse(savedAd);
      const expiryDate = new Date(parsedAd.expiresAt);
      
      // Only set the ad if it hasn't expired
      if (expiryDate > new Date()) {
        setCurrentAd(parsedAd);
      } else {
        localStorage.removeItem('currentAd');
      }
    }
  }, []); // Empty dependency array since this should only run once on mount

  // Add intersection observer for infinite scroll
  const observerTarget = useCallback(node => {
    if (!node || isLoadingMore) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && recentPosts.length > visiblePosts.length) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(node);
    return () => observer.disconnect();
  }, [recentPosts.length, visiblePosts.length, isLoadingMore]);

  const filteredPosts = recentPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchRecentPosts = async () => {
    // If we recently fetched posts, don't fetch again
    if (lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.hive.blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_discussions_by_created',
          params: [{ tag: 'travel', limit: 20 }],
          id: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error fetching posts');
      }

      if (data.result) {
        const posts = data.result.filter(post => {
          try {
            if (!post.json_metadata) return false;
            const metadata = typeof post.json_metadata === 'string' 
              ? JSON.parse(post.json_metadata)
              : post.json_metadata;
            
            return metadata.image && metadata.image.length > 0;
          } catch (e) {
            console.log('Error parsing metadata for post:', post.title);
            return false;
          }
        });

        // Cache the posts and timestamp
        localStorage.setItem('cachedPosts', JSON.stringify(posts));
        localStorage.setItem('lastFetchTime', Date.now().toString());
        setLastFetchTime(Date.now());
        setRecentPosts(posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
      
      // If error occurs, try to load from cache if available
      const cachedPosts = localStorage.getItem('cachedPosts');
      if (cachedPosts) {
        setRecentPosts(JSON.parse(cachedPosts));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername || ""); 
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.permlink}`, { 
      state: { 
        post: {
          ...post,
          json_metadata: typeof post.json_metadata === 'string' 
            ? post.json_metadata 
            : JSON.stringify(post.json_metadata)
        } 
      }
    });
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setAdFormData(prev => ({
      ...prev,
      adBudget: plan.price,
      duration: plan.name === 'Basic' ? '24' : plan.name === 'Premium' ? '72' : '168'
    }));
  };

  const handleImageUpload = (e) => {
    if (selectedPlan?.name === 'Basic') {
      setImageError('Image upload is not available in Basic plan');
      return;
    }

    const files = Array.from(e.target.files);
    setImageError('');

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setImageError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (selectedPlan?.name === 'Enterprise') {
          setImages(prev => [...prev, reader.result]);
        } else {
          setImagePreview(reader.result);
          setAdFormData(prev => ({
            ...prev,
            image: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    if (selectedPlan?.name === 'Enterprise') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImagePreview(null);
      setAdFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      alert('Please select an advertising plan');
      return;
    }

    if (!username) {
      alert('Please log in first to place an advertisement');
      return;
    }

    try {
      if (!window.hive_keychain) {
        alert('Hive Keychain extension not found. Please install it to proceed with payment.');
        return;
      }

      const formattedAmount = parseFloat(adFormData.adBudget).toFixed(3);
      
      // Validate username before proceeding
      if (!username || username.trim() === '') {
        alert('Please log in again. Your session might have expired.');
        // Optionally redirect to login page
        navigate('/');
        return;
      }
      
      window.hive_keychain.requestTransfer(
        username.trim(), // Ensure username has no whitespace
        'abinsaji4',
        formattedAmount,
        `Ad payment for: ${adFormData.companyName} - ${selectedPlan.name} Plan`,
        'HIVE',
        response => {
          if (response.success) {
            const expiryTime = parseInt(adFormData.duration) * 60 * 60 * 1000;
            const newAd = {
              ...adFormData,
              plan: selectedPlan.name,
              expiresAt: new Date(Date.now() + expiryTime)
            };
            
            setCurrentAd(newAd);
            localStorage.setItem('currentAd', JSON.stringify(newAd));
            
            setShowAdModal(false);
            setAdFormData({
              companyName: '',
              description: '',
              websiteUrl: '',
              adBudget: 10,
              image: null,
              targetAudience: '',
              duration: '24',
              category: ''
            });
            setSelectedPlan(null);
            
            alert('Your ad has been successfully placed!');
          } else {
            console.error('Keychain error:', response);
            if (response.error === 'incomplete' || response.message?.includes('username')) {
              alert('Error: Please make sure you are logged in and try again.');
            } else {
              alert('Payment failed. Please try again.');
            }
          }
        }
      );
    } catch (error) {
      console.error('Error processing ad payment:', error);
      alert('There was an error processing your payment. Please try again.');
    }
  };

  const handleAdInputChange = (e) => {
    const { name, value } = e.target;
    setAdFormData(prev => ({
      ...prev,
      [name]: name === 'adBudget' ? parseFloat(value) : value
    }));
  };

  const handleBatchTip = async (e) => {
    e.preventDefault();
    
    if (!username) {
      alert('Please log in first to send tips');
      return;
    }

    if (!window.hive_keychain) {
      alert('Hive Keychain extension not found. Please install it to proceed with tipping.');
      return;
    }

    const uniqueAuthors = [...new Set(selectedPosts.map(post => post.author))];
    let successCount = 0;

    for (const author of uniqueAuthors) {
      try {
        const formattedAmount = parseFloat(tipAmount).toFixed(3);
        
        await new Promise((resolve, reject) => {
          window.hive_keychain.requestTransfer(
            username.trim(),
            author,
            formattedAmount,
            'Thank you for your content!',
            tipCurrency,
            response => {
              if (response.success) {
                successCount++;
                resolve();
              } else {
                reject(new Error(response.message));
              }
            }
          );
        });
      } catch (error) {
        console.error(`Error sending tip to ${author}:`, error);
      }
    }

    if (successCount > 0) {
      alert(`Successfully sent tips to ${successCount} author${successCount > 1 ? 's' : ''}!`);
      setSelectedPosts([]);
      setShowTipModal(false);
    } else {
      alert('Failed to send tips. Please try again.');
    }
  };

  const handleGuidePurchase = async (guide) => {
    if (!username) {
      alert('Please log in first to purchase guides');
      return;
    }

    if (!window.hive_keychain) {
      alert('Hive Keychain extension not found. Please install it to proceed with purchase.');
      return;
    }

    try {
      const formattedAmount = parseFloat(guide.price).toFixed(3);
      
      window.hive_keychain.requestTransfer(
        username.trim(),
        guide.author,
        formattedAmount,
        `Purchase of guide: ${guide.title}`,
        'HIVE',
        response => {
          if (response.success) {
            // Store purchased guide access in localStorage
            const purchasedGuides = JSON.parse(localStorage.getItem('purchasedGuides') || '[]');
            purchasedGuides.push({
              id: guide.id,
              purchaseDate: new Date().toISOString()
            });
            localStorage.setItem('purchasedGuides', JSON.stringify(purchasedGuides));
            
            alert('Guide purchased successfully! You can now access the full content.');
            setShowGuidesModal(false);
          } else {
            alert('Purchase failed. Please try again.');
          }
        }
      );
    } catch (error) {
      console.error('Error processing guide purchase:', error);
      alert('There was an error processing your purchase. Please try again.');
    }
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
      textDecoration: 'none',
    },
    navItemHover: {
      color: '#4A90E2',
    },
    contentWrapper: {
      maxWidth: '100%',
      padding: '0',
    },
    heroSection: {
      backgroundImage: 'linear-gradient(135deg, #4A90E2, #3CB371), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)',
      backgroundBlendMode: 'overlay',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: 'fadeIn 1s ease-out',
      color: 'white',
      padding: '60px 5%',
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
      background: 'rgba(0,0,0,0.1)',
      zIndex: 1,
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '3em',
      fontWeight: 700,
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    heroSubtitle: {
      fontSize: '1.2em',
      opacity: 0.9,
      marginBottom: '30px',
    },
    searchContainer: {
      display: 'flex',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '50px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:focus-within': {
        transform: 'scale(1.02)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
      }
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
    
    navIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      animation: 'slideUp 0.5s ease-out',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      }
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
    categoryChips: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
      position: 'sticky',
      top: '70px',
      zIndex: 90,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      padding: '15px 0',
      transition: 'all 0.3s ease',
    },
    chip: {
      backgroundColor: 'white',
      padding: '8px 15px',
      borderRadius: '50px',
      fontSize: '0.9em',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }
    },
    activeChip: {
      backgroundColor: '#4A90E2',
      color: 'white',
    },
    // New styles for advertising features
    advertiseButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f39c12',
      color: 'white',
      padding: '8px 15px',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'background-color 0.3s',
      border: 'none',
      outline: 'none',
    },
    adBanner: {
      width: '100%',
      backgroundColor: '#fff8e1',
      padding: '15px',
      borderBottom: '1px solid #ffe082',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    adContent: {
      flex: 1,
    },
    adTitle: {
      fontWeight: 600,
      color: '#2C3E50',
      marginBottom: '5px',
    },
    adDescription: {
      fontSize: '0.9em',
      color: '#7F8C8D',
    },
    adLink: {
      marginLeft: '20px',
      padding: '8px 15px',
      backgroundColor: '#4A90E2',
      color: 'white',
      borderRadius: '4px',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.9em',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '16px',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '85vh',
      overflowY: 'auto',
      padding: '24px',
      position: 'relative',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    modalClose: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      cursor: 'pointer',
      color: '#7F8C8D',
    },
    modalTitle: {
      fontSize: '1.5em',
      fontWeight: 600,
      marginBottom: '20px',
      color: '#2C3E50',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500,
      color: '#2C3E50',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1em',
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1em',
      minHeight: '100px',
      resize: 'vertical',
    },
    submitButton: {
      backgroundColor: '#3CB371',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '4px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      fontSize: '1em',
      marginBottom: '10px',
    },
    testButton: {
      backgroundColor: '#64748b',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '4px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      fontSize: '1em',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    planCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
    selectedPlan: {
      border: '2px solid #3B82F6',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    planIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      marginBottom: '16px',
    },
    planTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    planPrice: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: '#4B5563',
      marginBottom: '8px',
    },
    checkmark: {
      marginRight: '8px',
      color: '#10B981',
    },
    adForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
    },
    select: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1em',
      backgroundColor: 'white',
    },
    fileInput: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1em',
    },
    imageUploadContainer: {
      border: '2px dashed #ddd',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '10px',
    },
    imagePreviewContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    imagePreview: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    imagePreviewWrapper: {
      position: 'relative',
      width: '100px',
      height: '100px',
    },
    removeImageButton: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#ef4444',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    imageError: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '4px',
    },
    uploadIcon: {
      marginBottom: '8px',
      color: '#64748b',
    },
    uploadText: {
      color: '#64748b',
      marginBottom: '4px',
    },
    uploadSubText: {
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite, fadeIn 0.5s ease-out',
      marginBottom: '20px',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '40px',
    },
    errorText: {
      color: '#ef4444',
      marginBottom: '20px',
    },
    retryButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
    refreshContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 20px',
      marginBottom: '20px',
    },
    refreshButton: {
      backgroundColor: '#4A90E2',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9em',
      fontWeight: '500',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      }
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    '@keyframes slideUp': {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 }
    },
    '@keyframes pulse': {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' }
    },
  };

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Adventure', 'Culture', 'Nature', 'Food'];

  // Add loading skeleton
  const PostSkeleton = () => (
    <div style={{
      ...styles.postCard,
      animation: 'pulse 1.5s infinite',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
    }}>
      <div style={{ height: '200px', backgroundColor: '#e0e0e0' }} />
      <div style={styles.postContent}>
        <div style={{ height: '24px', width: '80%', backgroundColor: '#e0e0e0', marginBottom: '10px' }} />
        <div style={{ height: '60px', width: '100%', backgroundColor: '#e0e0e0' }} />
      </div>
    </div>
  );

  const renderPosts = () => {
    if (isLoading && recentPosts.length === 0) {
      return (
        <div style={styles.postGrid}>
          {Array(6).fill(null).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error && recentPosts.length === 0) {
      return (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button 
            onClick={() => {
              localStorage.removeItem('cachedPosts');
              localStorage.removeItem('lastFetchTime');
              setLastFetchTime(null);
              fetchRecentPosts();
            }}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (recentPosts.length === 0) {
      return (
        <div style={styles.emptyContainer}>
          <p>No posts found. Check back later for amazing travel stories!</p>
        </div>
      );
    }

    return (
      <>
        {selectedPosts.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4A90E2',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 100,
            cursor: 'pointer'
          }} onClick={() => setShowTipModal(true)}>
            <DollarSign size={20} />
            Tip {selectedPosts.length} Selected Authors
          </div>
        )}
        <div style={styles.refreshContainer}>
          <button 
            onClick={() => {
              localStorage.removeItem('cachedPosts');
              localStorage.removeItem('lastFetchTime');
              setLastFetchTime(null);
              fetchRecentPosts();
            }}
            style={styles.refreshButton}
          >
            Refresh Posts
          </button>
        </div>
        <div style={styles.postGrid}>
          {visiblePosts.map((post, index) => {
            let imageUrl = '';
            try {
              const metadata = JSON.parse(post.json_metadata);
              imageUrl = metadata.image && metadata.image[0];
            } catch (e) {
              console.error('Error parsing post metadata:', e);
            }

            const isSelected = selectedPosts.find(p => p.author === post.author);

            return (
              <div 
                key={index} 
                style={{
                  ...styles.postCard,
                  border: isSelected ? '2px solid #4A90E2' : 'none'
                }}
                onClick={() => handlePostClick(post)}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 10
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedPosts.find(p => p.author === post.author)) {
                        setSelectedPosts(selectedPosts.filter(p => p.author !== post.author));
                      } else {
                        setSelectedPosts([...selectedPosts, post]);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? '#4A90E2' : 'white',
                      color: isSelected ? 'white' : '#4A90E2',
                      border: '2px solid #4A90E2',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isSelected ? '✓' : '+'}
                  </button>
                </div>
                {imageUrl && (
                  <OptimizedImage 
                    src={imageUrl} 
                    alt={post.title} 
                    style={styles.postImage}
                  />
                )}
                <div style={styles.postContent}>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postDescription}>
                    {post.body.replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 150)}...
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
        {visiblePosts.length < filteredPosts.length && (
          <div ref={observerTarget} style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '20px' 
          }}>
            <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
      </>
    );
  };

  // Add scroll to top button
  const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return isVisible ? (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          backgroundColor: '#4A90E2',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          zIndex: 99,
          animation: 'fadeIn 0.3s ease-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          }
        }}
      >
        ↑
      </button>
    ) : null;
  };

  return (
    <div style={styles.pageContainer}>
      {/* Add ScrollToTop component */}
      <ScrollToTop />
      {/* Display Ad Banner if there's a current ad */}
      {currentAd && (
        <div style={{
          ...styles.adBanner,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '20px 5%',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {(currentAd.image || (currentAd.images && currentAd.images.length > 0)) && (
            <div style={{
              flexShrink: 0,
              width: '120px',
              height: '120px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <OptimizedImage 
                src={currentAd.image || currentAd.images[0]} 
                alt={currentAd.companyName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          <div style={styles.adContent}>
            <div style={{
              ...styles.adTitle,
              fontSize: '1.2em',
              marginBottom: '8px'
            }}>
              {currentAd.companyName} - {currentAd.plan} Plan
            </div>
            <div style={{
              ...styles.adDescription,
              marginBottom: '10px'
            }}>
              {currentAd.description}
            </div>
            {currentAd.targetAudience && (
              <div style={{
                fontSize: '0.9em',
                color: '#666',
                marginBottom: '8px'
              }}>
                Target Audience: {currentAd.targetAudience}
              </div>
            )}
          </div>
          <a 
            href={currentAd.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...styles.adLink,
              whiteSpace: 'nowrap',
              padding: '10px 20px',
              backgroundColor: '#4A90E2',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              ':hover': {
                backgroundColor: '#357ABD',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Learn More
          </a>
        </div>
      )}

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Explore the World</h1>
          <p style={styles.heroSubtitle}>
            Discover incredible travel stories from adventurers around the globe
          </p>
          <div style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search destinations, stories..." 
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
            onClick={() => navigate('/destinations')}
            onMouseEnter={(e) => e.currentTarget.style.color = styles.navItemHover.color}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.navItem.color}
          >
            <MapPin size={20} /> Destinations
          </div>
          <div 
            style={styles.navItem} 
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => e.currentTarget.style.color = styles.navItemHover.color}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.navItem.color}
          >
            <User size={20} /> Profile
          </div>
          <div 
            style={styles.navItem} 
            onClick={() => navigate('/publish')}
            onMouseEnter={(e) => e.currentTarget.style.color = styles.navItemHover.color}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.navItem.color}
          >
            <PlusCircle size={20} /> Publish
          </div>
          <div 
            style={styles.advertiseButton} 
            onClick={() => setShowAdModal(true)}
          >
            <DollarSign size={20} /> Advertise
          </div>
          <div 
            style={{
              ...styles.navItem,
              backgroundColor: '#10B981',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '50px',
              marginLeft: '10px'
            }}
            onClick={() => setShowGuidesModal(true)}
          >
            <BookOpen size={20} /> Travel Guides
          </div>
        </div>
      </div>

      <div style={styles.postsSection}>
        {renderPosts()}
      </div>

      {/* Wrap modals in Suspense */}
      <Suspense fallback={
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Loader size={24} className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }>
        {showTipModal && (
          <TipModal 
            onClose={() => setShowTipModal(false)}
            selectedPosts={selectedPosts}
            tipAmount={tipAmount}
            onTipAmountChange={(e) => setTipAmount(e.target.value)}
            tipCurrency={tipCurrency}
            onTipCurrencyChange={(e) => setTipCurrency(e.target.value)}
            onSubmit={handleBatchTip}
          />
        )}
        {showAdModal && (
          <AdModal 
            onClose={() => {
              setShowAdModal(false);
              // Check if a new ad was placed via test button
              const savedAd = localStorage.getItem('currentAd');
              if (savedAd) {
                const parsedAd = JSON.parse(savedAd);
                setCurrentAd(parsedAd);
              }
            }}
            adPlans={adPlans}
            selectedPlan={selectedPlan}
            onPlanSelect={handlePlanSelect}
            adFormData={adFormData}
            onInputChange={handleAdInputChange}
            onImageUpload={handleImageUpload}
            imagePreview={imagePreview}
            imageError={imageError}
            onSubmit={handleAdSubmit}
            images={images}
            removeImage={removeImage}
          />
        )}
        {showGuidesModal && (
          <GuidesModal 
            onClose={() => setShowGuidesModal(false)}
            guides={guides}
            onPurchase={handleGuidePurchase}
          />
        )}
      </Suspense>
    </div>
  );
};

export default HomePage;