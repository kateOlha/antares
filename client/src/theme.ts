export type Theme = "dark" | "light";

const STORAGE_KEY = "antares-theme";

export function getStoredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initTheme() {
  applyTheme(getStoredTheme());
}

export function toggleTheme(): Theme {
  const next: Theme = getStoredTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
}
