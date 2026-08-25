import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({});

  useEffect(() => {
    fetch("/theme.json")
      .then(res => res.json())
      .then(data => {
        setTheme(data);
        applyTheme(data);
      });
  }, []);

  const applyTheme = (theme) => {
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
