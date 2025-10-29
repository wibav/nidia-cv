"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function ObjectiveSection() {
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <section id="about" className="px-6 py-10 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="px-6 py-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">Objetivo Profesional</h2>
            <p className="text-gray-300 leading-relaxed">
                {personalInfo?.objective || 'Información no disponible. Complete su perfil en el panel de administración.'}
            </p>
        </section>
    );
}