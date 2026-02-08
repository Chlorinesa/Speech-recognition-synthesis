import { useState, useCallback } from 'react';

export const useSttService = (setError) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const extractText = useCallback(async (file) => {
    if (!file) {
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio_file', file);

      const response = await fetch('http://172.31.1.1:5002/asr-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      
      setResult({
        text: data.text || 'Текст не распознан',
        processingTime: data.processing_time || 0,
      });
      await recordHistory('stt', `Файл: ${file.name}, символов: ${data.text?.length || 0}`);

    } catch (error) {
      setError('Не удалось подключиться к серверу. Проверьте адрес: 172.31.1.1:5002');
    } finally {
      setIsLoading(false);
    }
  }, [setError]);

  const cancelRequest = useCallback(() => {
    if (isLoading) {
      setIsLoading(false);
      setError(null);
    }
  }, [isLoading, setError]);

 const recordHistory = async (actionType, details = '') => {
  try {
    await fetch('/php/add_history.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        action: actionType,
        details: details.substring(0, 100)
      })
    });
  } catch (error) {
    console.error('Ошибка записи истории:', error);
  }
};
  return {
    isLoading,
    result,
    extractText,
    cancelRequest,
  };
};