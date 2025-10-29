"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const FONT_MAP = {
    'system-ui': 'system-ui',
    'serif': 'Georgia, serif',
    'sans-serif-modern': '"Trebuchet MS", sans-serif',
    'monospace': '"Courier New", monospace',
    'cursive': 'cursive',
    'display': 'Impact, Charcoal, sans-serif',
    'comic': '"Comic Sans MS", cursive',
    'garamond': 'Garamond, serif',
};

const getFontFamily = (fontKey) => {
    return FONT_MAP[fontKey] || 'system-ui';
};

export function Header() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const docRef = doc(db, 'personal', 'info');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPersonalInfo(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching personal info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalInfo();
    }, []);

    // Valores por defecto de fallback
    const name = personalInfo?.name || t('name');
    const title = personalInfo?.title || t('title');
    const location = personalInfo?.location || t('location');
    const email = personalInfo?.email || t('email');
    const phone = personalInfo?.phone || '';
    const linkedin = personalInfo?.linkedin || 'https://www.linkedin.com/in/nidia-nahas/';
    const profileImage = personalInfo?.profileImage;

    return (
        <header className="py-10">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Imagen a la izquierda, centrada verticalmente */}
                    <div className="flex-shrink-0">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt={name}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg"
                                style={{ borderColor: theme?.titleColor || '#a78bfa' }}
                            />
                        ) : (
                            <div
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 flex items-center justify-center text-gray-300"
                                style={{ border: `4px solid ${theme?.titleColor || '#a78bfa'}` }}
                            >
                                <span>No Imagen</span>
                            </div>
                        )}
                    </div>

                    {/* Información centrada */}
                    <div className="text-center">
                        <h1
                            className={`text-3xl md:text-4xl font-bold ${theme.titleColorClass || ''}`}
                            style={{ fontFamily: theme.titleFont ? getFontFamily(theme.titleFont) : 'system-ui' }}
                        >
                            {name}
                        </h1>
                        <p
                            className={`mt-2 ${theme.accentColorClass || ''}`}
                            style={{ fontFamily: theme.textFont ? getFontFamily(theme.textFont) : 'system-ui' }}
                        >
                            {title}
                        </p>
                        <div
                            className="mt-4"
                            style={{ fontFamily: theme.textFont ? getFontFamily(theme.textFont) : 'system-ui', color: theme?.textColor || '#d1d5db' }}
                        >
                            <p>{location}</p>
                            <p>{email}</p>
                            {phone && <p>{phone}</p>}
                            <a
                                href={linkedin}
                                className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                                style={{ color: theme?.titleColor || '#a78bfa' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}