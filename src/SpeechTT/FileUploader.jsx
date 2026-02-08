import React from 'react';
import { Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Dragger } = Upload;

export const FileUploader = ({ file, onFileSelect, onFileRemove, themeMode }) => {
  const beforeUpload = (file) => {
    const isAudio = file.type.startsWith('audio/');
    if (!isAudio) {
      return false;
    }
    onFileSelect(file);
    return false;
  };
  
  return (
    <div>
      <Dragger
        name="audio_file"
        accept="audio/*"
        beforeUpload={beforeUpload}
        onRemove={onFileRemove}
        maxCount={1}
        showUploadList={true}
        style={{
          background: themeMode === 'dark' ? '#2a2a2a' : '#fafafa',
          border: `2px dashed ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`,
          borderRadius: '8px',
          padding: '20px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ 
          color: themeMode === 'dark' ? '#8c8c8c' : '#666',
          textAlign: 'center'
        }}>
          <UploadOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
          <p style={{ marginBottom: '4px', fontSize: '14px' }}>
            Нажмите или перетащите аудиофайл
          </p>
          <p style={{ fontSize: '12px' }}>
            MP3, WAV, M4A, FLAC
          </p>
        </div>
      </Dragger>
    </div>
  );
};