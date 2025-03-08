import React from 'react';
import { X, Upload, DollarSign } from 'lucide-react';

const AdModal = ({ onClose, adPlans, selectedPlan, onPlanSelect, adFormData, onInputChange, onImageUpload, imagePreview, imageError, onSubmit, images, removeImage }) => {
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
        maxWidth: '900px',
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
          fontSize: '1.5em',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#2C3E50'
        }}>
          Advertise with Us
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {adPlans.map((plan) => (
            <div
              key={plan.name}
              onClick={() => onPlanSelect(plan)}
              style={{
                border: selectedPlan?.name === plan.name ? '2px solid #3B82F6' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedPlan?.name === plan.name ? '#F0F7FF' : 'white'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '16px',
                background: plan.color
              }}>
                <DollarSign size={24} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {plan.name}
              </h3>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                {plan.price} HIVE
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#4B5563',
                      marginBottom: '8px'
                    }}
                  >
                    <span style={{ marginRight: '8px', color: '#10B981' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={adFormData.companyName}
                  onChange={onInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={adFormData.websiteUrl}
                  onChange={onInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                name="description"
                value={adFormData.description}
                onChange={onInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={adFormData.targetAudience}
                onChange={onInputChange}
                placeholder="e.g., Travel enthusiasts, Adventure seekers"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Upload Image
              </label>
              {selectedPlan.name === 'Basic' ? (
                <div style={{
                  border: '2px dashed #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  color: '#64748b'
                }}>
                  <p>Image upload is not available in Basic plan.</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Upgrade to Premium or Enterprise for image support.</p>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => document.getElementById('adImage').click()}
                    style={{
                      border: '2px dashed #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={24} style={{ marginBottom: '8px', color: '#64748b' }} />
                    <p style={{ color: '#64748b', marginBottom: '4px' }}>Click to upload image</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    id="adImage"
                    accept="image/*"
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                    multiple={selectedPlan.name === 'Enterprise'}
                  />
                  {imageError && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>
                      {imageError}
                    </p>
                  )}
                  {(selectedPlan.name === 'Enterprise' ? images : imagePreview) && (
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginTop: '10px'
                    }}>
                      {selectedPlan.name === 'Enterprise' ? (
                        images.map((image, index) => (
                          <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
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
                                color: '#ef4444'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        imagePreview && (
                          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(0)}
                              style={{
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
                                color: '#ef4444'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#3CB371',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                fontSize: '1em',
                marginBottom: '10px'
              }}
            >
              Place Advertisement
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const expiryTime = parseInt(adFormData.duration) * 60 * 60 * 1000;
                const newAd = {
                  ...adFormData,
                  plan: selectedPlan.name,
                  expiresAt: new Date(Date.now() + expiryTime)
                };
                
                localStorage.setItem('currentAd', JSON.stringify(newAd));
                onClose();
                alert('Test ad has been placed successfully!');
              }}
              style={{
                backgroundColor: '#64748b',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                fontSize: '1em'
              }}
            >
              Test Ad Placement (No Payment)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdModal; 