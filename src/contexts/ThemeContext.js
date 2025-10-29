"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ThemeContext = createContext();

const DEFAULT_THEME = {
    backgroundColor: '#111827', // bg-gray-900
    backgroundColorClass: 'bg-gray-900',
    titleColor: '#a78bfa', // purple-400
    titleColorClass: 'text-purple-400',
    accentColor: '#c084fc', // purple-500
    accentColorClass: 'text-purple-500',
    titleFont: 'system-ui',
    textFont: 'system-ui',
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const docRef = doc(db, 'settings', 'theme');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTheme(data);
                } else {
                    setTheme(DEFAULT_THEME);
                }
            } catch (error) {
                console.error('Error fetching theme:', error);
                setTheme(DEFAULT_THEME);
            } finally {
                setLoading(false);
            }
        };

        fetchTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, loading, DEFAULT_THEME }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
