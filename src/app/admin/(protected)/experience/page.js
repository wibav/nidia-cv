'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function ExperienceAdminPage() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const experiencesQuery = query(collection(db, 'experiences'), orderBy('startDate', 'desc'));
            const snapshot = await getDocs(experiencesQuery);
            const experiencesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExperiences(experiencesData);
        } catch (error) {
            console.error('Error obteniendo experiencias:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia profesional?')) {
            return;
        }

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'experiences', id));
            setExperiences(experiences.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error eliminando experiencia:', error);
            alert('Error al eliminar la experiencia profesional');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short'
        });
    };

    const formatPeriod = (startDate, endDate, current) => {
        const start = formatDate(startDate);
        if (current) {
            return `${start} - Presente`;
        }
        const end = formatDate(endDate);
        return end ? `${start} - ${end}` : start;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Experiencia Profesional</h1>
                    <p className="text-gray-400">
                        {experiences.length} experiencia{experiences.length !== 1 ? 's' : ''} profesional{experiences.length !== 1 ? 'es' : ''} registrada{experiences.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/admin/experience/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    ➕ Nueva Experiencia
                </Link>
            </div>

            {experiences.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold mb-2">No hay experiencias profesionales</h3>
                    <p className="text-gray-400 mb-6">
                        Agrega tu primera experiencia profesional para comenzar
                    </p>
                    <Link href="/admin/experience/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Agregar Primera Experiencia
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Rol Arquitectónico
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Estudio/Empresa
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Período
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Ubicación
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {experiences.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">
                                                {exp.position}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {exp.description?.substring(0, 60)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {exp.company}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {exp.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/experience/edit?id=${exp.id}`}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
                                                    disabled={deleting === exp.id}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                                >
                                                    {deleting === exp.id ? '⏳' : '🗑️'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
