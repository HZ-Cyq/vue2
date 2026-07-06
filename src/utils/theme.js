import { themes } from "../const/theme";
const THEME_KEY = 'app-theme';
export const ThemeUtil = {
    init() {
        const sacedTheme = localStorage.getItem(THEME_KEY) || 'default';
        this.applyTheme(sacedTheme);
    },

    applyTheme(themeName) {
        const themeConfig = themes[themeName];
        if(!themeConfig) return;

        document.body.classList.remove();
        document.body.classList.add(`theme-${themeName}`);

        Object.entries(themeConfig).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        localStorage.setItem(THEME_KEY, themeName);
    },

    getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || 'default';
    }
    
}