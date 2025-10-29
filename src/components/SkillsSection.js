"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';

export function SkillsSection() {
    const [skills, setSkills] = useState([]);
    const [education, setEducation] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            // Fetch skills
            const skillsQuery = query(collection(db, 'skills'), orderBy('order', 'asc'));
            const skillsSnapshot = await getDocs(skillsQuery);
            const skillsData = skillsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSkills(skillsData);

            // Fetch education
            const educationQuery = query(collection(db, 'education'), orderBy('startDate', 'desc'));
            const educationSnapshot = await getDocs(educationQuery);
            const educationData = educationSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEducation(educationData);

            // Fetch certifications
            const certificationsQuery = query(collection(db, 'certifications'), orderBy('issuedDate', 'desc'));
            const certificationsSnapshot = await getDocs(certificationsQuery);
            const certificationsData = certificationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCertifications(certificationsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        let year, month;

        // Manejar Firestore Timestamp
        if (typeof dateString === 'object' && dateString && dateString.seconds) {
            const date = new Date(dateString.seconds * 1000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
        } else if (typeof dateString === 'string') {
            // Manejar string en formato YYYY-MM
            try {
                const parts = String(dateString).split('-');
                if (parts.length >= 2 && /^\d{4}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1])) {
                    year = parts[0];
                    month = parts[1];
                } else {
                    return '';
                }
            } catch {
                return '';
            }
        } else {
            return '';
        }

        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${months[parseInt(month) - 1]} ${year}`;
    };

    const getProficiencyStars = (level) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= level ? 'text-yellow-400' : 'text-gray-600'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <section id="education" className="px-6 py-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-1"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                        </div>
                    </div>
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
                        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-2 bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="education" className="px-6 py-16">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-8 text-center" style={{ color: theme.titleColor }}>Formación y Habilidades</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Educación */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: theme.titleColor }}>Educación</h3>
                        {education.length === 0 ? (
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <p className="text-gray-400">No hay educación registrada aún.</p>
                                <p className="text-gray-500 text-sm mt-2">Agregue educación desde el panel de administración.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id} className="bg-gray-800 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-purple-200">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-gray-300">{edu.institution}</p>
                                        <p className="text-gray-400 text-sm">
                                            {formatDate(edu.startDate)} - {edu.current ? 'Presente' : formatDate(edu.endDate)}
                                        </p>
                                        {edu.field && (
                                            <p className="text-purple-300 text-sm mt-1">
                                                Especialidad: {edu.field}
                                            </p>
                                        )}
                                        {edu.description && (
                                            <div className="text-gray-300 text-sm mt-3">
                                                <div dangerouslySetInnerHTML={{ __html: edu.description.replace(/\n/g, '<br>') }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Habilidades Técnicas */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: theme.titleColor }}>Habilidades Técnicas</h3>
                        {skills.length === 0 ? (
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <p className="text-gray-400">No hay habilidades registradas aún.</p>
                                <p className="text-gray-500 text-sm mt-2">Agregue habilidades desde el panel de administración.</p>
                            </div>
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg">
                                {/* Agrupar skills por categoría */}
                                {['BIM Software', 'CAD Software', 'Modelado 3D', 'Render & Visualización', 'Gestión de Proyectos', 'Urbanismo y Paisajismo', 'Software de Oficina'].map(category => {
                                    const categorySkills = skills.filter(skill => skill.category === category);
                                    if (categorySkills.length === 0) return null;

                                    return (
                                        <div key={category} className="mb-6">
                                            <h4 className="text-purple-200 font-medium mb-3">{category}</h4>
                                            <div className="space-y-3">
                                                {categorySkills.map((skill) => (
                                                    <div key={skill.id}>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-gray-300 text-sm">{skill.name}</span>
                                                            <div className="flex">
                                                                {getProficiencyStars(skill.proficiency || 1)}
                                                            </div>
                                                        </div>
                                                        {skill.yearsOfExperience && (
                                                            <p className="text-gray-400 text-xs">
                                                                {skill.yearsOfExperience} años de experiencia
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}