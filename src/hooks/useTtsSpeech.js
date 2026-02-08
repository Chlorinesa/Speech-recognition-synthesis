import { useRef, useState } from 'react';

export const useTtsSpeech = (settings) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedRange, setHighlightedRange] = useState({ start: 0, end: 0 });
  
  const isStoppedRef = useRef(false);
  const isPausedRef = useRef(false); // ref для синхронного отслеживания паузы
  const currentUtteranceRef = useRef(null); // для контроля текущего utterance
  const sentencesRef = useRef([]);
  const currentIndexRef = useRef(0);

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

  const splitIntoSentences = (text) => {
    if (!text.trim()) return [];
    const regex = /[^.!?]+[.!?]+|\n|[^.!?\n]+$/g;
    return text.match(regex) || [text];
  };

  const createUtterance = (sentence, currentSettings, availableVoices) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = currentSettings.rate;
    utterance.pitch = currentSettings.pitch;
    utterance.volume = currentSettings.volume;
    
    if (currentSettings.voice !== 'default') {
      const voice = availableVoices.find(v => v.name === currentSettings.voice);
      if (voice) utterance.voice = voice;
    }
    
    return utterance;
  };

  const speakSentence = (sentence, startPos, currentSettings, availableVoices) => {
    if (!sentence.trim() || isStoppedRef.current) return Promise.resolve();

    return new Promise((resolve) => {
      const utterance = createUtterance(sentence, currentSettings, availableVoices);
      const endPos = startPos + sentence.length;
      
      setHighlightedRange({ start: startPos, end: endPos });
      currentUtteranceRef.current = utterance;

      utterance.onend = () => {
        currentUtteranceRef.current = null;
        if (!isStoppedRef.current) resolve();
      };
      
      utterance.onerror = () => {
        currentUtteranceRef.current = null;
        if (!isStoppedRef.current) resolve();
      };

      // Проверяем паузу перед началом озвучки
      if (!isPausedRef.current) {
        window.speechSynthesis.speak(utterance);
      } else {
        // ждем снятия паузы
        const checkPauseInterval = setInterval(() => {
          if (!isPausedRef.current && !isStoppedRef.current) {
            clearInterval(checkPauseInterval);
            window.speechSynthesis.speak(utterance);
          } else if (isStoppedRef.current) {
            clearInterval(checkPauseInterval);
            resolve();
          }
        }, 50);
      }
    });
  };

  const startSpeech = async (text, currentSettings, availableVoices) => {
    isStoppedRef.current = false;
    isPausedRef.current = false;
    sentencesRef.current = splitIntoSentences(text);
    currentIndexRef.current = 0;
    setIsSpeaking(true);
    setIsPaused(false);
    if(text.trim()){
      await recordHistory('tts', `Символов: ${text.length}`);

    for (let i = 0; i < sentencesRef.current.length; i++) {
      if (isStoppedRef.current) break;
      
      // ждем, если на паузе
      while (isPausedRef.current && !isStoppedRef.current) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (isStoppedRef.current) break;

      const sentence = sentencesRef.current[i];
      const startPos = text.indexOf(sentence, 
        i > 0 ? text.indexOf(sentencesRef.current[i-1]) + sentencesRef.current[i-1].length : 0
      );

      await speakSentence(sentence, startPos, currentSettings, availableVoices);
      
      if (!isStoppedRef.current) {
        currentIndexRef.current = i + 1;
      }
    }

    if (!isStoppedRef.current) {
      setIsSpeaking(false);
      setIsPaused(false);
      isPausedRef.current = false;
      setHighlightedRange({ start: 0, end: 0 });

      
    }
    }
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !isPausedRef.current) {
      window.speechSynthesis.pause();
      isPausedRef.current = true;
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      setIsPaused(false);
      window.speechSynthesis.resume();
    }
  };

  const stopSpeech = () => {
    isStoppedRef.current = true;
    isPausedRef.current = false;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setHighlightedRange({ start: 0, end: 0 });
    currentIndexRef.current = 0;
  };
  

  return {
    isSpeaking,
    isPaused,
    highlightedRange,
    currentSentenceIndex: currentIndexRef.current,
    totalSentences: sentencesRef.current.length,
    startSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  };
};