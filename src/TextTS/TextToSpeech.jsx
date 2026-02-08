import React, { useState, useRef } from 'react';
import { Card, Row, Col } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

import { TextAreaWithHighlight } from './TextAreaWithHighlight.jsx';
import { SpeechControls } from './SpeechControls.jsx';
import { SpeechStatus } from './SpeechStatus.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';
import { useTtsSpeech } from '../hooks/useTtsSpeech.js';
import { useTtsSettings } from '../hooks/useTtsSettings.js';
import { useAuth } from '../hooks/useAuth.js';

const TextToSpeech = ({ themeMode }) => {
  const [text, setText] = useState('');
  const currentSettingsRef = useRef(null);
  const { user } = useAuth();

  const {
    settings,
    availableVoices,
    setSettings,
    resetSettings
  } = useTtsSettings(user);

  const {
    isSpeaking,
    isPaused,
    highlightedRange,
    currentSentenceIndex,
    totalSentences,
    startSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useTtsSpeech(settings);

  const handleSpeak = () => {
    if (!text.trim() || !window.speechSynthesis) return;
    
    // отменена перед началом новой озвучки
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    currentSettingsRef.current = { ...settings };
    startSpeech(text, currentSettingsRef.current, availableVoices);
  };

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    // синхронное обновление настройки
    setSettings(newSettings);
    
    // обновление ref для текущей озвучки
    if (!isSpeaking) {
      currentSettingsRef.current = newSettings;
    }
  };

  const handleColorPreset = (bgColor, textColor) => {
    const newSettings = {
      ...settings,
      highlightColor: bgColor,
      highlightTextColor: textColor
    };
      setSettings(newSettings);
    if (!isSpeaking) {
      currentSettingsRef.current = newSettings;
    }
  };

  const handleTextChange = (newText) => {
    setText(newText);
    if (isSpeaking || isPaused) {
      stopSpeech();
    }
  };

  return (
    <div style={{
      minHeight:'100vh',
      padding: '20px',
      overflow: 'hidden !important',
      boxSizing: 'border-box'
      }}>
        <Row gutter={24} style={{ maxWidth: '2000px', margin: '0 auto' }}>
      <Col xs={24} md={18}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SoundOutlined />
              <span>Синтезатор речи</span>
            </div>
          }
          style={{
            background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
            borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9',
          }}
        >
          <SpeechStatus
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            currentSentenceIndex={currentSentenceIndex}
            totalSentences={totalSentences}
            themeMode={themeMode}
          />

          <TextAreaWithHighlight
            text={text}
            highlightedRange={highlightedRange}
            onChange={handleTextChange} 
            disabled={isSpeaking}
            themeMode={themeMode}
            highlightColor={settings.highlightColor}
            highlightTextColor={settings.highlightTextColor}
          />

          <div style={{ marginTop: '20px' }}>
            <SpeechControls
              onSpeak={handleSpeak}
              onPause={pauseSpeech}
              onResume={resumeSpeech}
              onStop={stopSpeech}
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              disabled={!text.trim()}
            />
          </div>
          
          <div style={{ 
            marginTop: '10px', 
            fontSize: '12px', 
            color: themeMode === 'dark' ? '#8c8c8c' : '#666',
          }}>
            {isSpeaking ? 'Для редактирования текста остановите озвучку' : 'Текст будет подсвечиваться во время озвучки'}
          </div>
        </Card>
      </Col>

      <Col xs={24} md={6}>
        <SettingsPanel
          settings={settings}
          availableVoices={availableVoices}
          onSettingsChange={handleSettingsChange}
          onColorPreset={handleColorPreset}
          onSaveSettings={() => setSettings(settings)}
          onResetSettings={() => {
            const defaultSettings = resetSettings();
            currentSettingsRef.current = defaultSettings;
          }}
          isSpeaking={isSpeaking}
          themeMode={themeMode}
          currentUser={user}
        />
      </Col>
    </Row>
    </div>
    
  );
};

export default TextToSpeech;