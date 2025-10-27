'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function EducationAdminPage() {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            const educationQuery = query(collection(db, 'education'), orderBy('startDate', 'desc'));
            const snapshot = await getDocs(educationQuery);
            const educationData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEducation(educationData);
        } catch (error) {
            console.error('Error obteniendo educación:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta formación académica?')) {
            return;
        }

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'education', id));
            setEducation(education.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error eliminando educación:', error);
            alert('Error al eliminar la formación académica');
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
                    <h1 className="text-4xl font-bold mb-2">Educación & Formación</h1>
                    <p className="text-gray-400">
                        {education.length} formación{education.length !== 1 ? 'es' : ''} académica{education.length !== 1 ? 's' : ''} registrada{education.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/admin/education/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    ➕ Nueva Formación
                </Link>
            </div>

            {education.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-xl font-semibold mb-2">No hay formación académica</h3>
                    <p className="text-gray-400 mb-6">
                        Agrega tu primera formación académica para comenzar
                    </p>
                    <Link href="/admin/education/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Agregar Primera Formación
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Institución
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Especialidad
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
                                {education.map((edu) => (
                                    <tr key={edu.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">
                                                {edu.degree}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {edu.field}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {edu.institution}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {edu.field}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatPeriod(edu.startDate, edu.endDate, edu.current)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {edu.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/education/edit?id=${edu.id}`}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(edu.id)}
                                                    disabled={deleting === edu.id}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                                >
                                                    {deleting === edu.id ? '⏳' : '🗑️'}
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