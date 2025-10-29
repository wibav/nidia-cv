"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export function ExperienceSection() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const q = query(collection(db, 'experiences'), orderBy('startDate', 'desc'));
            const querySnapshot = await getDocs(q);
            const experiencesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExperiences(experiencesData);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const parts = String(dateString).split('-');
            if (parts.length >= 2 && /^\d{4}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1])) {
                const year = parts[0];
                const month = parseInt(parts[1]);
                const months = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                return `${months[month - 1]} ${year}`;
            }
        } catch {
            return '';
        }
        return '';
    }; if (loading) {
        return (
            <section id="experience" className="px-6 py-10 bg-gray-800">
                <div className="max-w-5xl mx-auto">
                    <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2 mb-1"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="px-6 py-10 bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">Experiencia Profesional</h2>

                {experiences.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No hay experiencias registradas aún.</p>
                        <p className="text-gray-500 text-sm mt-2">Agregue experiencias desde el panel de administración.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="border-l-4 border-purple-400 pl-6">
                                <h3 className="text-xl font-semibold text-purple-300">{exp.position}</h3>
                                <p className="text-purple-200 font-medium">{exp.company}</p>
                                <p className="text-gray-400 text-sm">
                                    {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}
                                    {exp.location && ` • ${exp.location}`}
                                </p>
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <p className="text-gray-300 mt-2 mb-2">
                                        <strong>Software:</strong> {exp.technologies.join(', ')}
                                    </p>
                                )}
                                {exp.description && (
                                    <div className="text-gray-300 mt-3 text-sm leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: exp.description.replace(/\n/g, '<br>') }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}