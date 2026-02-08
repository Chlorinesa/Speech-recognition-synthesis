import React from 'react';
import { Button, Spin } from 'antd';
import { FileTextOutlined, WarningOutlined } from '@ant-design/icons';

export const SpeechControls = ({ onExtract, onCancel, isLoading, disabled, themeMode }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '16px',
      }}>
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={onExtract}
          disabled={disabled || isLoading}
          size="large"
          style={{ minWidth: '200px' }}
        >
          {isLoading ? 'Извлечение текста...' : 'Извлечь текст'}
        </Button>
        
        {isLoading && (
          <Button
            type="default"
            danger
            onClick={onCancel}
            size="large"
          >
            Отменить
          </Button>
        )}
      </div>

      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          background: themeMode === 'dark' ? '#2a2a2a' : '#fafafa',
          borderRadius: '8px',
          width: '100%',
          border: `1px solid ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`
        }}>
          <Spin size="large" />
          <div style={{ 
            marginTop: '16px',
            marginBottom: '8px',
            color: themeMode === 'dark' ? '#fff' : '#141414',
          }}>
            <strong>Отправка запроса на сервер... </strong>
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            color: themeMode === 'dark' ? '#faad14' : '#d48806',
            fontSize: '12px',
            background: themeMode === 'dark' ? '#2a2a2a' : '#fffbe6',
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${themeMode === 'dark' ? '#434343' : '#ffe58f'}`,
            marginTop: '12px'
          }}>
            <WarningOutlined />
            <div>
              <strong>Внимание:</strong> Если сервер недоступен или запрос не обрабатывается,<br/>
              появится сообщение об ошибке после завершения загрузки
            </div>
          </div>
        </div>
      )}
    </div>
  );
};