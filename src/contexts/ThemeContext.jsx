import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 現在の月から季節を判定
const getDefaultSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

export const ThemeProvider = ({ children }) => {
  // localStorageから初期値を取得、なければデフォルト値
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'dark';
  });

  const [season, setSeason] = useState(() => {
    const saved = localStorage.getItem('theme-season');
    return saved || getDefaultSeason();
  });

  // modeが変更されたらlocalStorageに保存し、HTML要素のdata属性を更新
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // seasonが変更されたらlocalStorageに保存し、HTML要素のdata属性を更新
  useEffect(() => {
    localStorage.setItem('theme-season', season);
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    mode,
    season,
    toggleMode,
    setSeason,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
