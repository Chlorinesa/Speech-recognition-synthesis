import React, { useRef } from 'react';
import { Input, Tag } from 'antd';

export const TextAreaWithHighlight = ({ 
  text, 
  highlightedRange, 
  onChange, 
  disabled, 
  themeMode,
  highlightColor,
  highlightTextColor
}) => {
  const textAreaRef = useRef(null);
  
  // убирает автоперемещение курсора в конец
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%'
    }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 16px',
          pointerEvents: 'none',
          fontSize: '15px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'hidden',
          color: themeMode === 'dark' ? '#fff' : '#141414',
          backgroundColor: 'transparent',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          zIndex: 1,
          border: 'none',
          borderRadius: '8px',
        }}
      >
        {text.substring(0, highlightedRange.start)}
        {highlightedRange.start < highlightedRange.end && (
          <mark style={{ 
            backgroundColor: highlightColor, 
            color: highlightTextColor,
            padding: '1px 0',
            borderRadius: '4px',
            lineHeight: 'inherit',
            border: '1px solid #000000'
        }}>
            {text.substring(highlightedRange.start , highlightedRange.end)}
        </mark>
        
          // <Tag 
          //   color="blue"
          //   style={{ fontSize: '15px'}} 
          // >
          //   {text.substring(highlightedRange.start, highlightedRange.end)}
          // </Tag>
        )}
        {text.substring(highlightedRange.end)}
      </div>
      
      <Input.TextArea
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        placeholder="Введите текст для озвучки..."
        disabled={disabled}
        rows={15}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1px solid ${themeMode === 'dark' ? '#434343' : '#d9d9d9'}`,
          borderRadius: '8px',
          background: 'transparent',
          color: 'transparent',
          caretColor: themeMode === 'dark' ? '#fff' : '#141414', 
          resize: 'vertical',
          fontSize: '15px',
          lineHeight: '1.5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          position: 'relative',
          zIndex: 2,
          userSelect: 'auto',
          WebkitUserSelect: 'auto',
          MozUserSelect: 'auto',
          msUserSelect: 'auto',
          outline: 'none',
          boxShadow: 'none',
        }}
      />
    </div>
  );
};