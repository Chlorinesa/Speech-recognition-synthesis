import { useState, useEffect } from 'react';
const DEFAULT_SETTINGS = {
  voice: 'Microsoft Irina', 
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  highlightColor: '#e69fd9',
  highlightTextColor: '#ffffff'
};

export const useTtsSettings = (user) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        const irina = voices.find(v => v.name.includes('Microsoft Irina'));
        loadSavedSettings(irina);
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const loadSavedSettings = async (irinaVoice) => {
    try {
      if (!user) { 
        const saved = localStorage.getItem('tts_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.voice || parsed.voice === 'default') {
            parsed.voice = irinaVoice ? irinaVoice.name : 'Microsoft Irina';
          }
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } else if (irinaVoice) {
          setSettings({...DEFAULT_SETTINGS, voice: irinaVoice.name});
        }
        return;
      }

      setLoading(true);
      const response = await fetch('/php/get_settings.php', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          if (!data.settings.voice || data.settings.voice === 'default') {
            data.settings.voice = irinaVoice ? irinaVoice.name : 'Microsoft Irina';
          }
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      const saved = localStorage.getItem('tts_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.voice || parsed.voice === 'default') {
          parsed.voice = irinaVoice ? irinaVoice.name : 'Microsoft Irina';
        }
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    const settingsToSave = { ...DEFAULT_SETTINGS, ...newSettings };
    
    // сначала синхронно обновляем состояние
    setSettings(settingsToSave);
    // затем асинхронно сохраняем
    localStorage.setItem('tts_settings', JSON.stringify(settingsToSave));
    
    if (user) {
      try {
        await fetch('php/save_settings.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ settings: settingsToSave })
        });
      } catch (error) {
        console.error('Error saving settings to DB:', error);
      }
    }
    
    return settingsToSave;
  };

  const resetSettings = () => {
    const voices = window.speechSynthesis?.getVoices() || [];
    const irina = voices.find(v => v.name.includes('Microsoft Irina'));
    const defaultIrina = { ...DEFAULT_SETTINGS, voice: irina ? irina.name : 'Microsoft Irina' };
    
    setSettings(defaultIrina);
    localStorage.removeItem('tts_settings');
    
    // также удаляем из БД
    if (user) {
      fetch('/php/save_settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ settings: defaultIrina })
      }).catch(error => {
        console.error('Error resetting settings in DB:', error);
      });
    }
    
    return defaultIrina;
  };

  return {
    settings,
    availableVoices,
    loading,
    setSettings: saveSettings,
    resetSettings,
    DEFAULT_SETTINGS
  };
};
