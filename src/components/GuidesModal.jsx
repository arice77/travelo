import React, { useState } from 'react';
import { X, MapPin, DollarSign, Clock, Award, Star, Search, Filter, ChevronDown, Heart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const GuidesModal = ({ onClose, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const categories = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const sampleGuides = [
    {
      id: 1,
      title: "Ultimate Tokyo Travel Guide",
      author: "japanlover",
      price: 5,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      preview: "Discover the best of Tokyo with our comprehensive guide covering everything from hidden gems to must-visit attractions.",
      features: [
        "Detailed 7-day itinerary",
        "Local food recommendations",
        "Transportation tips",
        "Cultural insights"
      ],
      category: "Asia",
      popular: true
    },
    {
      id: 2,
      title: "Bali Adventure Guide",
      author: "islandexplorer",
      price: 7,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      preview: "Experience the magic of Bali with insider tips on beaches, temples, and hidden waterfalls.",
      features: [
        "Secret beach locations",
        "Temple etiquette guide",
        "Local cuisine guide",
        "Adventure activities"
      ],
      category: "Asia",
      popular: true
    },
    {
      id: 3,
      title: "Paris Like a Local",
      author: "parisienne",
      price: 8,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      preview: "Skip the tourist traps and experience Paris like a true local with this authentic guide.",
      features: [
        "Hidden cafes and bistros",
        "Local market guide",
        "Off-beaten-path spots",
        "Language essentials"
      ],
      category: "Europe",
      popular: true
    },
    {
      id: 4,
      title: "Barcelona Foodie Explorer",
      author: "tapasking",
      price: 6,
      rating: 4.6,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
      preview: "Dive into Barcelona's culinary scene with this comprehensive food guide to the Catalan capital.",
      features: [
        "Best tapas bars map",
        "Market tour itinerary",
        "Wine tasting recommendations",
        "Cooking class options"
      ],
      category: "Europe"
    },
    {
      id: 5,
      title: "Kyoto Temple & Garden Guide",
      author: "zengarden",
      price: 4.5,
      rating: 4.9,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
      preview: "Explore the spiritual heart of Japan with this detailed guide to Kyoto's temples and gardens.",
      features: [
        "Seasonal viewing guide",
        "Morning meditation spots",
        "Tea ceremony experiences",
        "Photography tips"
      ],
      category: "Asia"
    },
    {
      id: 6,
      title: "New York City Insider",
      author: "bigappleguide",
      price: 8.5,
      rating: 4.8,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      preview: "Navigate NYC like a true New Yorker with insider tips on everything from subway secrets to hidden speakeasies.",
      features: [
        "Neighborhood walking tours",
        "Budget eats and splurges",
        "Subway navigation hacks",
        "Seasonal events calendar"
      ],
      category: "Americas"
    },
    {
      id: 7,
      title: "Safari Adventure: Kenya",
      author: "wildlifeexpert",
      price: 9,
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
      preview: "Plan the perfect Kenyan safari with this expert guide to wildlife spotting, camps, and conservation.",
      features: [
        "Big Five spotting guide",
        "Best season recommendations",
        "Eco-friendly camps list",
        "Photography equipment tips"
      ],
      category: "Africa"
    },
    {
      id: 8,
      title: "Sydney & Beyond",
      author: "aussieadventurer",
      price: 6.5,
      rating: 4.7,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
      preview: "Explore Sydney and the surrounding area with this comprehensive guide to Australia's most iconic city.",
      features: [
        "Coastal walks guide",
        "Hidden beach finder",
        "Blue Mountains day trip",
        "Local food & wine spots"
      ],
      category: "Oceania"
    }
  ];

  const filteredGuides = sampleGuides
    .filter(guide => activeCategory === 'All' || guide.category === activeCategory)
    .filter(guide => guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    guide.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    guide.preview.toLowerCase().includes(searchQuery.toLowerCase()));

  const popularGuides = sampleGuides.filter(guide => guide.popular);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '0',
        position: 'relative'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px 32px',
          borderBottom: '1px solid #e2e8f0',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '2em',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Premium Travel Guides
            </h2>
            
            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                height: '40px',
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              <X size={20} color="#64748b" />
            </button>
          </div>
          
          <p style={{
            color: '#64748b',
            fontSize: '1.1em',
            maxWidth: '600px',
            margin: '0 0 24px 0'
          }}>
            Unlock exclusive insights from seasoned travelers and make your next journey unforgettable
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: '240px'
            }}>
              <Search 
                size={18} 
                color="#94a3b8" 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Search destinations, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1em',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <div style={{
              position: 'relative',
              minWidth: '160px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #e2e8f0',
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}>
                <Filter size={18} color="#64748b" />
                <span style={{ color: '#64748b' }}>
                  Sort by: Popular
                </span>
                <ChevronDown size={16} color="#64748b" />
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            overflow: 'auto',
            paddingBottom: '8px',
            margin: '0 -4px'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '30px',
                  border: 'none',
                  backgroundColor: activeCategory === category ? '#3b82f6' : '#f1f5f9',
                  color: activeCategory === category ? 'white' : '#64748b',
                  fontSize: '0.9em',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {searchQuery === '' && activeCategory === 'All' && (
          <div style={{ padding: '24px 32px' }}>
            <h3 style={{
              fontSize: '1.4em',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#0f172a'
            }}>
              Popular Guides
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {popularGuides.map((guide) => (
                <div
                  key={guide.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ position: 'relative', height: '180px' }}>
                    <OptimizedImage
                      src={guide.image}
                      alt={guide.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: favorites.includes(guide.id) ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => toggleFavorite(guide.id)}
                    >
                      <Heart
                        size={20}
                        color={favorites.includes(guide.id) ? 'white' : '#64748b'}
                        fill={favorites.includes(guide.id) ? 'white' : 'none'}
                      />
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8em',
                      fontWeight: '500'
                    }}>
                      {guide.category}
                    </div>
                  </div>

                  <div style={{ 
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#64748b'
                      }}>
                        <Award size={16} color="#8b5cf6" />
                        <span>@{guide.author}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Star size={16} fill="#facc15" color="#facc15" />
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>{guide.rating}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.9em' }}>({guide.reviews})</span>
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '1.25em',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#0f172a',
                      lineHeight: '1.3'
                    }}>
                      {guide.title}
                    </h3>

                    <p style={{
                      color: '#4b5563',
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      fontSize: '0.95em'
                    }}>
                      {guide.preview}
                    </p>

                    <div style={{
                      marginBottom: '20px',
                      flexGrow: 1
                    }}>
                      <h4 style={{
                        fontSize: '1em',
                        fontWeight: '600',
                        marginBottom: '10px',
                        color: '#0f172a'
                      }}>
                        What's Included:
                      </h4>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '6px'
                      }}>
                        {guide.features.map((feature, index) => (
                          <li
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#4b5563',
                              fontSize: '0.9em'
                            }}
                          >
                            <span style={{ 
                              color: 'white', 
                              backgroundColor: '#10b981',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8em'
                            }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '1.1em'
                      }}>
                        <DollarSign size={20} color="#3b82f6" />
                        <span>{guide.price} HIVE</span>
                      </div>
                      <button
                        onClick={() => onPurchase(guide)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '24px 32px 32px' }}>
          {searchQuery === '' && activeCategory === 'All' ? (
            <h3 style={{
              fontSize: '1.4em',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#0f172a'
            }}>
              All Guides
            </h3>
          ) : (
            <h3 style={{
              fontSize: '1.4em',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#0f172a'
            }}>
              {filteredGuides.length} {activeCategory !== 'All' ? activeCategory : ''} Guides {searchQuery ? `for "${searchQuery}"` : ''}
            </h3>
          )}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <OptimizedImage
                    src={guide.image}
                    alt={guide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: favorites.includes(guide.id) ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => toggleFavorite(guide.id)}
                  >
                    <Heart
                      size={20}
                      color={favorites.includes(guide.id) ? 'white' : '#64748b'}
                      fill={favorites.includes(guide.id) ? 'white' : 'none'}
                    />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: '500'
                  }}>
                    {guide.category}
                  </div>
                </div>

                <div style={{ 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#64748b'
                    }}>
                      <Award size={16} color="#8b5cf6" />
                      <span>@{guide.author}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={16} fill="#facc15" color="#facc15" />
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>{guide.rating}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.9em' }}>({guide.reviews})</span>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.25em',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#0f172a',
                    lineHeight: '1.3'
                  }}>
                    {guide.title}
                  </h3>

                  <p style={{
                    color: '#4b5563',
                    marginBottom: '16px',
                    lineHeight: '1.5',
                    fontSize: '0.95em'
                  }}>
                    {guide.preview}
                  </p>

                  <div style={{
                    marginBottom: '20px',
                    flexGrow: 1
                  }}>
                    <h4 style={{
                      fontSize: '1em',
                      fontWeight: '600',
                      marginBottom: '10px',
                      color: '#0f172a'
                    }}>
                      What's Included:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '6px'
                    }}>
                      {guide.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4b5563',
                            fontSize: '0.9em'
                          }}
                        >
                          <span style={{ 
                            color: 'white', 
                            backgroundColor: '#10b981',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8em'
                          }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0f172a',
                      fontWeight: '700',
                      fontSize: '1.1em'
                    }}>
                      <DollarSign size={20} color="#3b82f6" />
                      <span>{guide.price} HIVE</span>
                    </div>
                    <button
                      onClick={() => onPurchase(guide)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredGuides.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              color: '#64748b'
            }}>
              <div style={{
                fontSize: '3em',
                marginBottom: '16px'
              }}>
                🔍
              </div>
              <h3 style={{
                fontSize: '1.5em',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                No guides found
              </h3>
              <p>
                Try adjusting your search or browse different categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidesModal;