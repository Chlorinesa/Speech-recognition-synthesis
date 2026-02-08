import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const InfoPanel = ({ themeMode }) => {
  return (
    <div style={{ 
      color: themeMode === 'dark' ? '#8c8c8c' : '#666',
      fontSize: '14px',
      lineHeight: '1.6'
    }}>
      <p><strong>Как это работает:</strong></p>
      <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li>Загрузите аудиофайл</li>
        <li>Нажмите "Извлечь текст"</li>
        <li>Получите результат</li>
      </ol>
      
      <p><strong>Поддерживаемые форматы:</strong></p>
      <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li>MP3, WAV, FLAC и другие аудиоформаты</li>
      </ul>
    </div>
  );
};