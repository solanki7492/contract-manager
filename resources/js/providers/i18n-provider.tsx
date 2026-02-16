import { createContext, useContext, ReactNode } from 'react';

export interface Language {
    code: string;
    label: string;
    flag: string;
    direction: 'ltr' | 'rtl';
    messages?: Record<string, string>;
}

interface I18nContextType {
    currenLanguage: Language;
    changeLanguage: (language: Language) => void;
    isRTL: () => boolean;
}

export const I18N_LANGUAGES: Language[] = [
    {
        code: 'en',
        label: 'English',
        flag: '/media/flags/united-states.svg',
        direction: 'ltr',
    },
    {
        code: 'es',
        label: 'Spanish',
        flag: '/media/flags/spain.svg',
        direction: 'ltr',
    },
    {
        code: 'fr',
        label: 'French',
        flag: '/media/flags/france.svg',
        direction: 'ltr',
    },
    {
        code: 'de',
        label: 'German',
        flag: '/media/flags/germany.svg',
        direction: 'ltr',
    },
];

const I18nContext = createContext<I18nContextType>({
    currenLanguage: I18N_LANGUAGES[0],
    changeLanguage: () => { },
    isRTL: () => false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
    const currenLanguage = I18N_LANGUAGES[0]; // Default to English

    const changeLanguage = (language: Language) => {
        // In a real app, you would persist this to localStorage or cookies
        console.log('Changing language to:', language);
    };

    const isRTL = () => {
        return currenLanguage.direction === 'rtl';
    };

    return (
        <I18nContext.Provider value={{ currenLanguage, changeLanguage, isRTL }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useLanguage() {
    return useContext(I18nContext);
}
