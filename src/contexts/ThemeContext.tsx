import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange';

interface ThemeContextType {
    themeMode: ThemeMode;
    colorScheme: ColorScheme;
    setThemeMode: (mode: ThemeMode) => void;
    setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        return (localStorage.getItem('themeMode') as ThemeMode) || 'system';
    });

    const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
        return (localStorage.getItem('colorScheme') as ColorScheme) || 'blue';
    });

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        localStorage.setItem('themeMode', mode);
    };

    const setColorScheme = (scheme: ColorScheme) => {
        setColorSchemeState(scheme);
        localStorage.setItem('colorScheme', scheme);
    };

    // Apply dark mode class to html element
    useEffect(() => {
        const root = window.document.documentElement;

        const applyDark = (isDark: boolean) => {
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (themeMode === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyDark(systemPrefersDark);

            const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        } else {
            applyDark(themeMode === 'dark');
        }
    }, [themeMode]);

    // Apply color scheme as data attribute for CSS variable switching
    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', colorScheme);
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={{ themeMode, colorScheme, setThemeMode, setColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
