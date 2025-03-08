import React, { useState } from 'react';
import { toast } from 'react-toastify'; 
import { KeychainSDK, KeychainKeyTypes } from 'keychain-sdk'; 
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate(); 

  const handleHiveKeyChainLogin = async () => {
    if (!window.hive_keychain) {
      toast.error('Please install Hive Keychain extension!');
      return;
    }
    if (!username) {
      toast.error('Enter your Hive Username!');
      return;
    }

    setIsLoggingIn(true);

    try {
      const keychain = new KeychainSDK(window);
      const loginParams = {
        data: {
          username,
          message: 'Login Request',
          method: KeychainKeyTypes.posting,
          title: 'Login',
        },
      };

      const login = await keychain.login(loginParams.data);
      if (login.success) {
        toast.success('Login successful!');
        console.log('Login successful:', { login });

        localStorage.setItem('username', username);
        localStorage.setItem('publicKey', login.data.key);

        navigate('/home');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error while Hive Keychain Login:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          <svg style={styles.logo} viewBox="0 0 100 100">
            <path 
              d="M50 10 L80 50 L50 90 L20 50 Z" 
              fill="#4A90E2"
            />
            <path 
              d="M35 50 L50 30 L65 50 L50 70 Z" 
              fill="#3CB371"
            />
          </svg>
        </div>
        <h1 style={styles.title}>Travelo</h1>
        <p style={styles.subtitle}>Capture. Share. Explore.</p>
        <input
          style={{
            ...styles.input,
            ...(isLoggingIn ? styles.disabledInput : {})
          }}
          type='text'
          placeholder='Enter Hive Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleHiveKeyChainLogin();
            }
          }}
          disabled={isLoggingIn}
        />
        <button
          onClick={handleHiveKeyChainLogin}
          style={{
            ...styles.button,
            ...(isLoggingIn ? styles.disabledButton : {})
          }}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Connecting...' : 'Login with Hive Keychain'}
        </button>
        {!isLoggingIn && (
          <p style={styles.instructions}>
            New to Travelo? 
            <a 
              href="https://hivekeychain.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.link}
            >
              {' '}Get Started
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #E6F2FF, #CBE2F3)',
    fontFamily: "'Montserrat', sans-serif",
  },
  content: {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '20px',
    backgroundColor: 'white',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '450px',
    border: '1px solid rgba(70, 130, 180, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '80px',
    height: '80px',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },
  title: {
    fontSize: '2.5em',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#2C3E50',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '1em',
    marginBottom: '30px',
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #4A90E2',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    backgroundColor: '#F7FBFF',
    color: '#2C3E50',
  },
  disabledInput: {
    opacity: '0.6',
    cursor: 'not-allowed',
    backgroundColor: '#E9F5FF',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3CB371',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(60, 179, 113, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#7DCEA0',
    cursor: 'not-allowed',
  },
  instructions: {
    fontSize: '0.9em',
    marginTop: '20px',
    color: '#5F6B7A',
  },
  link: {
    color: '#4A90E2',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
};

export default LoginPage;