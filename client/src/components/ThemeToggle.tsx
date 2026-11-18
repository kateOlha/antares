import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, toggleTheme, type Theme } from "../theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = getStoredTheme();
    applyTheme(current);
    setTheme(current);
  }, []);

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === "light" ? "Тёмная" : "Светлая"}
    </button>
  );
}
