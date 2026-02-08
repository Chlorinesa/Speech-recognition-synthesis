import React, { useState } from 'react';
import { Card, Button, Tooltip, Typography } from 'antd';
import { FileTextOutlined, ClockCircleOutlined, CopyOutlined, CheckOutlined, DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const ResultPanel = ({ result, themeMode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!result?.text) return;
    
    navigator.clipboard.writeText(result.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Ошибка копирования:', err);
      });
  };

  const downloadTextAsTXT = () => {
    if (!result?.text) return;
    
    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
          
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            <span>Результат распознавания</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: themeMode === 'dark' ? '#2a2a2a' : '#f0f9ff',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${themeMode === 'dark' ? '#434343' : '#91d5ff'}`,
              fontSize: '12px',
              color: themeMode === 'dark' ? '#8c8c8c' : '#1890ff',
            }}>
              <ClockCircleOutlined style={{ fontSize: '12px' }} />
              <Text style={{ fontSize: '12px', color: 'inherit' }}>
                {`Время распознавания ${result.processingTime}` }
              </Text>
            </div>
            
            <Tooltip title={copied ? "Скопировано!" : "Копировать текст"}>
              <Button 
                type="text"
                icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                onClick={copyToClipboard}
                size="middle"
                style={{ 
                  width: '36px', 
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`,
                }}
              />
            </Tooltip>

            <Tooltip title="Скачать в TXT">
              <Button 
                type="text"
                icon={<DownloadOutlined />}
                onClick={downloadTextAsTXT}
                size="middle"
                style={{ 
                  width: '36px', 
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`,
                }}
              />
            </Tooltip>
          </div>
        </div>
      }
      style={{
        background: themeMode === 'dark' ? '#2a2a2a' : '#fafafa',
        borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9',
      }}
    >
      <div style={{
        padding: '16px',
        background: themeMode === 'dark' ? '#141414' : '#fff',
        border: `1px solid ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`,
        borderRadius: '6px',
        minHeight: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: '1.6',
        color: themeMode === 'dark' ? '#fff' : '#141414',
        fontSize: '15px',
      }}>
        {result.text}
      </div>
    </Card>
  );
};
