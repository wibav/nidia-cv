"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';

export function ObjectiveSection() {
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

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

    if (loading) {
        return (
            <section id="about" className="px-6 py-16 max-w-5xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="px-6 py-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: theme.titleColor }}>Objetivo Profesional</h2>
            <p className="leading-relaxed text-center" style={{ color: theme?.textColor || '#1f2937' }}>
                {personalInfo?.objective || 'Información no disponible. Complete su perfil en el panel de administración.'}
            </p>
        </section>
    );
}