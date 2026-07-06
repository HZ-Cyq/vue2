import { themes } from "../const/theme";
const THEME_KEY = 'app-theme';
const THEME_CLASSES = ['theme-default', 'theme-dark', 'theme-blue'];

export const ThemeUtil = {
    init() {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'default';
        this.applyTheme(savedTheme);
    },

    applyTheme(themeName) {
        const themeConfig = themes[themeName];
        if(!themeConfig) return;

        // Remove all theme classes first
        document.body.classList.remove(...THEME_CLASSES);
        // Add the new theme class
        document.body.classList.add(`theme-${themeName}`);

        // Apply CSS variables to both html and body for better inheritance
        Object.entries(themeConfig).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
            document.body.style.setProperty(key, value);
        });

        localStorage.setItem(THEME_KEY, themeName);
    },

    getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || 'default';
    }
    
}
