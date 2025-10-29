"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        experiences: 0,
        projects: 0,
        education: 0,
        certifications: 0,
        skills: 0,
        personalInfo: false
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Contar experiencias
            const experiencesSnap = await getDocs(collection(db, 'experiences'));
            // Contar proyectos
            const projectsSnap = await getDocs(collection(db, 'projects'));
            // Contar educación
            const educationSnap = await getDocs(collection(db, 'education'));
            // Contar certificaciones
            const certificationsSnap = await getDocs(collection(db, 'certifications'));
            // Contar skills
            const skillsSnap = await getDocs(collection(db, 'skills'));
            // Verificar información personal
            const personalSnap = await getDoc(doc(db, 'personal', 'info'));

            setStats({
                experiences: experiencesSnap.size,
                projects: projectsSnap.size,
                education: educationSnap.size,
                certifications: certificationsSnap.size,
                skills: skillsSnap.size,
                personalInfo: personalSnap.exists()
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
                <p className="text-gray-400">Gestiona todo el contenido de tu portafolio profesional arquitectónico</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Experiencias</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.experiences}</p>
                        </div>
                        <span className="text-4xl">💼</span>
                    </div>
                    <Link href="/admin/experience" className="text-purple-300 hover:text-purple-200 text-sm mt-4 inline-block">
                        Ver →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Proyectos</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.projects}</p>
                        </div>
                        <span className="text-4xl">🏗️</span>
                    </div>
                    <Link href="/admin/projects" className="text-blue-300 hover:text-blue-200 text-sm mt-4 inline-block">
                        Ver →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Educación</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.education}</p>
                        </div>
                        <span className="text-4xl">🎓</span>
                    </div>
                    <Link href="/admin/education" className="text-green-300 hover:text-green-200 text-sm mt-4 inline-block">
                        Ver →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-6 border border-yellow-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Certificaciones</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.certifications}</p>
                        </div>
                        <span className="text-4xl">🏆</span>
                    </div>
                    <Link href="/admin/certifications" className="text-yellow-300 hover:text-yellow-200 text-sm mt-4 inline-block">
                        Ver →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 border border-pink-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Habilidades</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.skills}</p>
                        </div>
                        <span className="text-4xl">🛠️</span>
                    </div>
                    <Link href="/admin/skills" className="text-pink-300 hover:text-pink-200 text-sm mt-4 inline-block">
                        Ver →
                    </Link>
                </div>

                <div className={`bg-gradient-to-br ${stats.personalInfo ? 'from-indigo-900 to-indigo-800 border-indigo-700' : 'from-gray-900 to-gray-800 border-gray-700'} rounded-lg p-6 border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-300 text-sm font-medium">Información Personal</p>
                            <p className={`text-4xl font-bold mt-2 ${stats.personalInfo ? 'text-white' : 'text-gray-500'}`}>
                                {stats.personalInfo ? '✓' : '○'}
                            </p>
                        </div>
                        <span className="text-4xl">👤</span>
                    </div>
                    <Link href="/admin/personal" className={`text-sm mt-4 inline-block ${stats.personalInfo ? 'text-indigo-300 hover:text-indigo-200' : 'text-gray-500'}`}>
                        {stats.personalInfo ? 'Editar →' : 'Crear →'}
                    </Link>
                </div>
            </div>

            {/* Sección de Acciones Rápidas */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">Gestión Rápida</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/personal" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            👤 Información Personal
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {stats.personalInfo ? 'Editar tu perfil profesional' : 'Crear tu perfil profesional'}
                        </p>
                    </Link>

                    <Link href="/admin/experience" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            💼 Experiencias ({stats.experiences})
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Gestiona tu trayectoria profesional arquitectónica
                        </p>
                    </Link>

                    <Link href="/admin/projects" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            �️ Proyectos ({stats.projects})
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Administra tu portafolio de proyectos arquitectónicos
                        </p>
                    </Link>

                    <Link href="/admin/education" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            🎓 Educación ({stats.education})
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Gestiona tu formación académica y especialidades
                        </p>
                    </Link>

                    <Link href="/admin/certifications" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            🏆 Certificaciones ({stats.certifications})
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Administra tus credenciales profesionales
                        </p>
                    </Link>

                    <Link href="/admin/skills" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            🛠️ Habilidades ({stats.skills})
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Gestiona tus competencias en software BIM y arquitectónico
                        </p>
                    </Link>

                    <Link href="/admin/theme" className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200">
                            🎨 Configuración de Tema
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Personaliza los colores de tu portafolio
                        </p>
                    </Link>
                </div>
            </div>

            {/* Sugerencias de Completitud */}
            <div className="mt-12 bg-purple-900 bg-opacity-30 border border-purple-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">📊 Estado de Completitud</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Información Personal</span>
                        <span className={`text-sm font-medium ${stats.personalInfo ? 'text-green-400' : 'text-yellow-400'}`}>
                            {stats.personalInfo ? '✓ Completado' : '○ Pendiente'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Experiencias registradas</span>
                        <span className={`text-sm font-medium ${stats.experiences > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {stats.experiences > 0 ? `✓ ${stats.experiences} registrada${stats.experiences !== 1 ? 's' : ''}` : '○ Sin registrar'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Proyectos en portafolio</span>
                        <span className={`text-sm font-medium ${stats.projects > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {stats.projects > 0 ? `✓ ${stats.projects} proyecto${stats.projects !== 1 ? 's' : ''}` : '○ Sin registrar'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Habilidades técnicas</span>
                        <span className={`text-sm font-medium ${stats.skills > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {stats.skills > 0 ? `✓ ${stats.skills} habilidad${stats.skills !== 1 ? 'es' : ''}` : '○ Sin registrar'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
