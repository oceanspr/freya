import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function AdminDashboard() {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChange = (e) => {
    const updatedTheme = { ...theme, [e.target.name]: e.target.value };
    setTheme(updatedTheme);
    localStorage.setItem("theme", JSON.stringify(updatedTheme));
  };

  return (
    <div>
      <h2>Theme Settings</h2>
      {Object.keys(theme).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input
            type="color"
            name={key}
            value={theme[key]}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
}
