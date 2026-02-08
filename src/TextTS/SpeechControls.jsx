import React from 'react';
import { Button, Space } from 'antd';
import { PauseOutlined, CaretRightOutlined, StopOutlined } from '@ant-design/icons';

export const SpeechControls = ({ 
  onSpeak, 
  onPause, 
  onResume, 
  onStop, 
  isSpeaking, 
  isPaused, 
  disabled 
}) => {
  return (
    <Space wrap>
      <Button
        type="primary"
        icon={<CaretRightOutlined />}
        onClick={onSpeak}
        disabled={disabled || isSpeaking}
        size="large"
      >
        Озвучить
      </Button>
      
      {isSpeaking && (
        <>
          {isPaused ? (
            <Button
              icon={<CaretRightOutlined />}
              onClick={onResume}
              size="large"
            >
              Возобновить
            </Button>
          ) : (
            <Button
              icon={<PauseOutlined />}
              onClick={onPause}
              size="large"
            >
              Пауза
            </Button>
          )}
          <Button
            icon={<StopOutlined />}
            onClick={onStop}
            danger
            size="large"
          >
            Остановить
          </Button>
        </>
      )}
    </Space>
  );
};