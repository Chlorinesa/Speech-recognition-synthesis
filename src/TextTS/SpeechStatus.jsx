import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const SpeechStatus = ({ 
  isSpeaking, 
  isPaused, 
  currentSentenceIndex, 
  totalSentences,
  themeMode 
}) => {
  const getStatusText = () => {
    if (isSpeaking) return 'Идет озвучка';
    if (isPaused) return 'На паузе';
    return 'Введите текст для озвучки';
  };

  const getStatusColor = () => {
    if (isSpeaking) return '#52c41a';
    if (isPaused) return '#faad14';
    return themeMode === 'dark' ? '#434343' : '#d9d9d9';
  };

  return (
    <div style={{ 
      padding: '12px 16px', 
      background: themeMode === 'dark' ? '#2a2a2a' : '#f8f9fa',
      borderRadius: '6px',
      marginBottom: '20px',
      border: `1px solid ${themeMode === 'dark' ? '#434343' : '#e9ecef'}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: getStatusColor(),
          animation: isSpeaking ? 'pulse 1.5s infinite ease-in-out' : 'none',
        }} />
        <Text strong style={{ fontSize: '14px' }}>
          {getStatusText()}
        </Text>
      </div>
      
      {isSpeaking && totalSentences > 0 && (
        <div style={{ 
          marginTop: '8px',
          fontSize: '12px',
          color: themeMode === 'dark' ? '#8c8c8c' : '#666',
        }}>
          Предложение {currentSentenceIndex + 1} из {totalSentences}
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              box-shadow: 0 0 5px ${getStatusColor()};
            }
            50% { 
              opacity: 0.6; 
              box-shadow: 0 0 10px ${getStatusColor()};
            }
          }
        `}
      </style>
    </div>
  );
};