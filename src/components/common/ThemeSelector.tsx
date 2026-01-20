import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

export const ThemeSelector = () => {
    const { themeMode, colorScheme, setThemeMode, setColorScheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Inline hook to fix build resolution issue
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const modes = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'system', icon: Monitor, label: 'System' },
    ] as const;

    const colors = [
        { id: 'blue', color: 'bg-blue-500', label: 'Blue' },
        { id: 'green', color: 'bg-green-500', label: 'Green' },
        { id: 'purple', color: 'bg-purple-500', label: 'Purple' },
        { id: 'orange', color: 'bg-orange-500', label: 'Orange' },
    ] as const;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                title="Change Theme"
            >
                <Palette size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-4 z-50 animate-fade-in">
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Appearance</h3>
                        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                            {modes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setThemeMode(mode.id)}
                                    className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${themeMode === mode.id
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <mode.icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Accent Color</h3>
                        <div className="flex gap-3 justify-between">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setColorScheme(color.id)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${colorScheme === color.id ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-slate-800' : ''
                                        }`}
                                    title={color.label}
                                >
                                    <span className={`w-full h-full rounded-full ${color.color}`}></span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
