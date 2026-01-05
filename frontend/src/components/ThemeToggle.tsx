import { useEffect, useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`theme-toggle ${theme}`}
    >
      <span className="icon" key={theme}>
        {theme === "light" ? "🌞" : "🌙"}
      </span>
      <span className="label">
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
