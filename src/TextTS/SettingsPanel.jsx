

import React from 'react';
import { Card, Select, Slider, ColorPicker, Form, Divider, Space, Button,Tag } from 'antd';
import { SettingOutlined} from '@ant-design/icons';

const { Option } = Select;
const colorOptions = [
  { name: 'Розовый', bgColor: '#e69fd9', textColor: '#FFFFFF'},
  { name: 'Зеленый', bgColor: 'rgb(144, 200, 196)', textColor: '#000000'},
  { name: 'Красный', bgColor: 'rgb(236, 115, 126)', textColor: '#FFFFFF'},
  { name: 'Голубой', bgColor: 'rgb(176, 217, 230)', textColor: '#000000'}
];

export const SettingsPanel = ({
  settings,
  availableVoices,
  onSettingsChange,
  onColorPreset,
  onResetSettings,
  isSpeaking,
  themeMode,
  currentUser
}) => {
  const saveToServer = async (newSettings) => {
    try {
      if(!currentUser) return;
      const response = await fetch('/php/save_settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ settings: newSettings })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Ошибка сохранения настроек:', data.error);
        return;
      }
      await fetch('/php/add_history.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'settings' })
      });
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  const handleColorPresetClick = async (bgColor, textColor) => {
    if (onColorPreset) {
      onColorPreset(bgColor, textColor);
    } else {
      // Fallback для обратной совместимости
      const newSettings = {
        ...settings,
        highlightColor: bgColor,
        highlightTextColor: textColor
      };
      onSettingsChange('highlightColor', bgColor);
      onSettingsChange('highlightTextColor', textColor);
      
      // сохраняем на сервер если пользователь авторизован
      if (currentUser) {
        await saveToServer(newSettings);
      }
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined />
          <span>Настройки озвучки</span>
        </div>
      }
      style={{
        background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
        borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9',
      }}
      extra={
        <Space>
          <Button 
            type="text" 
            onClick={onResetSettings}
            size="small"
          >
            Сброс
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" size="small">
        <Form.Item label="Голос">
          <Select
            value={settings.voice}
            onChange={(value) => {
              const newSettings = { ...settings, voice: value };
              onSettingsChange('voice', value);
              
              // автосохранение в БД если пользователь авторизован
              if (currentUser) {
                saveToServer(newSettings);
              }
            }}
            style={{ width: '100%', height: '30px' }}
          >
            {/* <Option value="default">По умолчанию</Option> */}
            {availableVoices.map((voice, i) => (
              <Option key={i} value={voice.name}>
                {voice.name} ({voice.lang})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />

        <Form.Item label={`Скорость: ${settings.rate.toFixed(1)}x`}>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={settings.rate}
            onChange={(value) => {
              const newSettings = { ...settings, rate: value };
              onSettingsChange('rate', value);
              if (currentUser) saveToServer(newSettings);
            }}
          />
        </Form.Item>

        <Form.Item label={`Высота тона: ${settings.pitch.toFixed(1)}`}>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={settings.pitch}
            onChange={(value) => {
              const newSettings = { ...settings, pitch: value };
              onSettingsChange('pitch', value);
              if (currentUser) saveToServer(newSettings);
            }}
          />
        </Form.Item>

        <Form.Item label={`Громкость: ${Math.round(settings.volume * 100)}%`}>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={settings.volume}
            onChange={(value) => {
              const newSettings = { ...settings, volume: value };
              onSettingsChange('volume', value);
              if (currentUser) saveToServer(newSettings);
            }}
          />
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />
        {/* <Tag style={{ margin: '0 0 12px 0' }}>Готовые стили подсветки: </Tag> */}
        <Form.Item >
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {colorOptions.map((option, index) => {
              const isActive = settings.highlightColor === option.bgColor && settings.highlightTextColor === option.textColor;
              return (
                <button
                  key={index}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: option.bgColor,
                    color: option.textColor,
                    border: `2px solid ${isActive ? '#606060' : 'transparent'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1 1 auto',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    maxWidth: '79px',
                    maxHeight: '24px',
                    transition: 'border 0.2s',
                    boxShadow: isActive ? '0 0 0 1px rgba(24, 144, 255, 0.2)' : 'none'
                  }}
                  onClick={() => handleColorPresetClick(option.bgColor, option.textColor)}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
        </Form.Item>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
  {/* <Tag>Настройте свои цвета подсветки:</Tag> */}
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <Form.Item>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span>Цвет подсветки</span>
        <ColorPicker
          value={settings.highlightColor}
          onChange={(color) => {
            const newSettings = {...settings, highlightColor: color.toHexString()};
            onSettingsChange('highlightColor', color.toHexString());
            if (currentUser) saveToServer(newSettings);
          }}
          size="small"
        />
      </div>
    </Form.Item>
    <Form.Item>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>Цвет текста</span>
        <ColorPicker
          value={settings.highlightTextColor}
          onChange={(color) => {
            const newSettings = {...settings, highlightTextColor: color.toHexString()};
            onSettingsChange('highlightTextColor', color.toHexString());
            if (currentUser) saveToServer(newSettings);
          }}
          size="small"
        />
      </div>
    </Form.Item>
  </div>
</div>

        
        {isSpeaking && (
          <div style={{ 
            // padding: '2px',
            borderRadius: '4px',
            // border: `1px solid ${themeMode === 'dark' ? '#434343' : '#91d5ff'}`,
            fontSize: '12px',
            color: themeMode === 'dark' ? '#8c8c8c' : '#1890ff'
          }}>
            ⓘ Настройки применятся к следующей озвучке
          </div>
        )}
      </Form>
    </Card>
  );
};