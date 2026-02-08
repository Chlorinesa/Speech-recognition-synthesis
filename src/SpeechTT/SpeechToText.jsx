import React, { useState } from 'react';
import { Card, Row, Col, Alert } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

import { FileUploader } from './FileUploader.jsx';
import { SpeechControls } from './SpeechControls.jsx';
import { ResultPanel } from './ResultPanel.jsx';
import { InfoPanel } from './InfoPanel.jsx';
import { useSttService } from '../hooks/useSttService.js';

const SpeechToText = ({ themeMode }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  
  const {
    isLoading,
    result,
    extractText,
    cancelRequest
  } = useSttService(setError); 

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setError(null);
  };

  const handleExtract = () => {
    if (file) {
      setError(null);
      extractText(file);
    }
  };

  const handleCancel = () => {
    cancelRequest();
    setError(null);
  };

  return (
    <div style={{
      minHeight:'100vh',
      padding: '20px',
      overflow: 'hidden !important',
      boxSizing: 'border-box'
      }}>
      <Row gutter={24} style={{marginBottom: '24px' }}>
      <Col xs={24} lg={16} xl={18} xxl={18} >
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AudioOutlined />
              <span>Распознавание речи из аудиофайла</span>
            </div>
          }
          styles={{
            body: {
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
          style={{
            background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
            borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9',
            height: '100%'
          }}
        >
              <FileUploader
                file={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                themeMode={themeMode}
              />

            {error && (
              <Alert
                message="Ошибка подключения"
                description="Не удалось подключиться к серверу. Проверьте, запущен ли сервер по адресу 172.31.1.1:5002"
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: '16px' }}
              />
            )}
            <div style={{ marginTop: '16px'}}>
              <SpeechControls
                  onExtract={handleExtract}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  disabled={!file}
                  themeMode={themeMode}
                />
            </div>
              
        </Card>
        
      </Col>
        <Col xs={24} lg={8} xl={6} xxl={6}>
          <InfoPanel themeMode={themeMode} />
        </Col>
      </Row>
      {result && (
                <Row>
                  <Col xs={24}>
                  <ResultPanel
                    result={result}
                    themeMode={themeMode}
                  />
                  </Col>
                </Row>
              )}
            </div>
        
    
  );
};

export default SpeechToText;