import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ src, alt, style, placeholderColor = '#e0e0e0' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  const styles = {
    container: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: placeholderColor,
      ...style,
    },
    image: {
      ...style,
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
    },
    placeholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: placeholderColor,
    },
    errorMessage: {
      color: '#666',
      fontSize: '0.9em',
      textAlign: 'center',
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          <p style={styles.errorMessage}>Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!isLoaded && (
        <div style={styles.placeholder}>
          <div style={{
            width: '30px',
            height: '30px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={styles.image}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage; 