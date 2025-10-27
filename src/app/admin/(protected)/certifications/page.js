'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function CertificationsAdminPage() {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const certificationsQuery = query(collection(db, 'certifications'), orderBy('issuedDate', 'desc'));
            const snapshot = await getDocs(certificationsQuery);
            const certificationsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCertifications(certificationsData);
        } catch (error) {
            console.error('Error obteniendo certificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta certificación?')) {
            return;
        }

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'certifications', id));
            setCertifications(certifications.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error eliminando certificación:', error);
            alert('Error al eliminar la certificación');
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

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
        return expiry < today;
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
                    <h1 className="text-4xl font-bold mb-2">Certificaciones Profesionales</h1>
                    <p className="text-gray-400">
                        {certifications.length} certificación{certifications.length !== 1 ? 'es' : ''} registrada{certifications.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/admin/certifications/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    ➕ Nueva Certificación
                </Link>
            </div>

            {certifications.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold mb-2">No hay certificaciones</h3>
                    <p className="text-gray-400 mb-6">
                        Agrega tu primera certificación profesional para comenzar
                    </p>
                    <Link href="/admin/certifications/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Agregar Primera Certificación
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Certificación
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Institución
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Emitida
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Vence
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {certifications.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">
                                                {cert.name}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {cert.certificateNumber && `N° ${cert.certificateNumber}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {cert.institution}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatDate(cert.issuedDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {cert.expiryDate ? formatDate(cert.expiryDate) : 'Sin vencimiento'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cert.expiryDate ? (
                                                isExpired(cert.expiryDate) ? (
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-900 text-red-300 rounded-full">
                                                        Vencida
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">
                                                        Vigente
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-900 text-blue-300 rounded-full">
                                                    Permanente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/certifications/edit?id=${cert.id}`}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cert.id)}
                                                    disabled={deleting === cert.id}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                                >
                                                    {deleting === cert.id ? '⏳' : '🗑️'}
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