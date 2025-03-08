import React from 'react';
import { X, DollarSign } from 'lucide-react';

const TipModal = ({ onClose, selectedPosts, tipAmount, onTipAmountChange, tipCurrency, onTipCurrencyChange, onSubmit }) => {
  const uniqueAuthors = [...new Set(selectedPosts.map(post => post.author))];

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
        maxWidth: '500px',
        width: '100%',
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
          Tip Authors
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '1.1em',
            fontWeight: '500',
            marginBottom: '12px',
            color: '#4A5568'
          }}>
            Selected Authors ({uniqueAuthors.length})
          </h3>
          <div style={{
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '8px'
          }}>
            {uniqueAuthors.map((author, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  backgroundColor: index % 2 === 0 ? '#F7FAFC' : 'white',
                  borderRadius: '4px'
                }}
              >
                @{author}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2D3748'
            }}>
              Amount per Author
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={tipAmount}
                onChange={onTipAmountChange}
                required
                style={{
                  flex: 1,
                  padding: '12px 15px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  fontSize: '1em'
                }}
              />
              <select
                value={tipCurrency}
                onChange={onTipCurrencyChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: 'white',
                  fontSize: '1em',
                  cursor: 'pointer'
                }}
              >
                <option value="HIVE">HIVE</option>
                <option value="HBD">HBD</option>
              </select>
            </div>
          </div>

          <div style={{
            backgroundColor: '#F7FAFC',
            padding: '16px',
            borderRadius: '6px',
            marginTop: '12px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              color: '#4A5568'
            }}>
              <span>Amount per author:</span>
              <span>{tipAmount} {tipCurrency}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '600',
              color: '#2D3748',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '8px'
            }}>
              <span>Total amount:</span>
              <span>{(parseFloat(tipAmount) * uniqueAuthors.length).toFixed(3)} {tipCurrency}</span>
            </div>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '1em'
            }}
          >
            <DollarSign size={20} />
            Send Tips
          </button>
        </form>
      </div>
    </div>
  );
};

export default TipModal; 