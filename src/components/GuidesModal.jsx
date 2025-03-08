import React from 'react';
import { X, MapPin, DollarSign, Clock, Award } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const GuidesModal = ({ onClose, guides, onPurchase }) => {
  const sampleGuides = [
    {
      id: 1,
      title: "Ultimate Tokyo Travel Guide",
      author: "japanlover",
      price: 5,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      preview: "Discover the best of Tokyo with our comprehensive guide covering everything from hidden gems to must-visit attractions.",
      features: [
        "Detailed 7-day itinerary",
        "Local food recommendations",
        "Transportation tips",
        "Cultural insights"
      ]
    },
    {
      id: 2,
      title: "Bali Adventure Guide",
      author: "islandexplorer",
      price: 7,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      preview: "Experience the magic of Bali with insider tips on beaches, temples, and hidden waterfalls.",
      features: [
        "Secret beach locations",
        "Temple etiquette guide",
        "Local cuisine guide",
        "Adventure activities"
      ]
    },
    {
      id: 3,
      title: "Paris Like a Local",
      author: "parisienne",
      price: 8,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      preview: "Skip the tourist traps and experience Paris like a true local with this authentic guide.",
      features: [
        "Hidden cafes and bistros",
        "Local market guide",
        "Off-beaten-path spots",
        "Language essentials"
      ]
    }
  ];

  return (
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
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} color="#666" />
        </button>

        <h2 style={{
          fontSize: '1.8em',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#2C3E50'
        }}>
          Premium Travel Guides
        </h2>
        
        <p style={{
          color: '#666',
          marginBottom: '24px',
          fontSize: '1.1em'
        }}>
          Discover expert-curated travel guides from experienced travelers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '24px'
        }}>
          {sampleGuides.map((guide) => (
            <div
              key={guide.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
              }}
            >
              <div style={{ position: 'relative', height: '200px' }}>
                <OptimizedImage
                  src={guide.image}
                  alt={guide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '1.3em',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#2D3748'
                }}>
                  {guide.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  color: '#718096'
                }}>
                  <Award size={16} />
                  <span>By @{guide.author}</span>
                </div>

                <p style={{
                  color: '#4A5568',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {guide.preview}
                </p>

                <div style={{
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    fontSize: '1em',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#2D3748'
                  }}>
                    What's Included:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {guide.features.map((feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                          color: '#4A5568'
                        }}
                      >
                        <span style={{ color: '#48BB78' }}>✓</span>
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
                  borderTop: '1px solid #E2E8F0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#2D3748',
                    fontWeight: '600'
                  }}>
                    <DollarSign size={20} />
                    <span>{guide.price} HIVE</span>
                  </div>
                  <button
                    onClick={() => onPurchase(guide)}
                    style={{
                      backgroundColor: '#4A90E2',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Purchase Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidesModal; 