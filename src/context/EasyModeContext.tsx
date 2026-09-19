import React, { createContext, useContext, useState, useEffect } from 'react';

interface EasyModeContextType {
  isEasyMode: boolean;
  toggleEasyMode: () => void;
  setEasyMode: (enabled: boolean) => void;
}

const EasyModeContext = createContext<EasyModeContextType>({
  isEasyMode: false,
  toggleEasyMode: () => {},
  setEasyMode: () => {},
});

export const EasyModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEasyMode, setIsEasyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('trustchain_easy_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleEasyMode = () => {
    setIsEasyMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('trustchain_easy_mode', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setEasyMode = (enabled: boolean) => {
    setIsEasyMode(enabled);
    try {
      localStorage.setItem('trustchain_easy_mode', String(enabled));
    } catch {
      // ignore
    }
  };

  return (
    <EasyModeContext.Provider value={{ isEasyMode, toggleEasyMode, setEasyMode }}>
      {children}
    </EasyModeContext.Provider>
  );
};

export const useEasyMode = () => useContext(EasyModeContext);
