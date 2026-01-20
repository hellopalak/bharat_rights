import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}

const translations: Translations = {
    'nav.home': { en: 'Home', hi: 'होम' },
    'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
    'nav.schemes': { en: 'Schemes', hi: 'योजनाएं' },
    'nav.signin': { en: 'Sign In', hi: 'साइन इन' },
    'nav.signout': { en: 'Sign Out', hi: 'साइन आउट' },
    'nav.search': { en: 'Search schemes...', hi: 'योजनाएं खोजें...' },
    'nav.saved': { en: 'Saved Schemes', hi: 'सहेजी गई योजनाएं' },
    'nav.track': { en: 'Track Applications', hi: 'आवेदन ट्रैक करें' },
    'nav.community': { en: 'Community', hi: 'समुदाय' },
    'hero.title': { en: 'Know Your Rights, Claim Your Benefits', hi: 'अपने अधिकार जानें, अपने लाभ का दावा करें' },
    'hero.subtitle': { en: 'BharatRights helps you automatically discover government schemes you are eligible for.', hi: 'BharatRights आपको उन सरकारी योजनाओं को स्वचालित रूप से खोजने में मदद करता है जिनके लिए आप पात्र हैं।' },
    'hero.cta': { en: 'Get Started', hi: 'शुरू करें' },
    'hero.browse': { en: 'Browse All Schemes', hi: 'सभी योजनाएं देखें' },
    'explore.title': { en: 'Explore Schemes', hi: 'योजनाएं खोजें' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        const translation = translations[key];
        if (!translation) return key;
        return translation[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
