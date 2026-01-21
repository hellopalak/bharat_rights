import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Search, Menu, Heart, FileText, Briefcase, MessageSquare } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeSelector } from '../common/ThemeSelector';

export const Navbar = () => {
    const { t } = useLanguage();
    const { profile } = useProfile();
    const { user, signOut } = useAuth();
    const [showNotifications, setShowNotifications] = React.useState(false);

    // Ref for the notification container to detect outside clicks
    const notificationRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-background border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">B</span>
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-700">
                                BharatRights
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">


                        {/* Language button removed */}


                        <ThemeSelector />

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-slate-600 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>

                            {showNotifications && <NotificationsDropdown />}
                        </div>

                        <Link to="/saved" className="p-2 text-slate-600 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors" title={t('nav.saved')}>
                            <Heart className="w-5 h-5" />
                        </Link>

                        <Link to="/applications" className="p-2 text-slate-600 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors" title={t('nav.track')}>
                            <FileText className="w-5 h-5" />
                        </Link>

                        <Link to="/community" className="p-2 text-slate-600 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors" title={t('nav.community')}>
                            <MessageSquare className="w-5 h-5" />
                        </Link>

                        {user ? (
                            <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group relative">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                    <span className="text-sm font-medium text-slate-600">
                                        {(user.email?.[0] || 'U').toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                    {t('nav.profile')}
                                </span>
                                {/* Simple hover dropdown for logout */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block">
                                    <button
                                        onClick={signOut}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                                    >
                                        {t('nav.signout')}
                                    </button>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-sm font-medium text-sm">
                                <User className="w-4 h-4" />
                                <span>{t('nav.signin')}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
