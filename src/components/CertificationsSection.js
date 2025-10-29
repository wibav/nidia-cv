"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';

export function CertificationsSection() {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const q = query(collection(db, 'certifications'), orderBy('issuedDate', 'desc'));
            const querySnapshot = await getDocs(q);
            const certificationsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCertifications(certificationsData);
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="certifications" className="px-6 py-16 bg-gray-800">
                <div className="max-w-5xl mx-auto">
                    <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-gray-700 p-4 rounded-lg">
                                <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-600 rounded w-1/2 mb-1"></div>
                                <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (certifications.length === 0) {
        return null; // No mostrar sección si no hay certificaciones
    }

    return (
        <section id="certifications" className="px-6 py-16 bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: theme.titleColor }}>Certificaciones</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold" style={{ color: theme.titleColor }}>{cert.name}</h3>
                            <p className="text-gray-300 text-sm">{cert.institution}</p>
                            <p className="text-gray-400 text-sm">
                                Emitida: {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('es-ES') : 'Fecha no especificada'}
                            </p>
                            {cert.certificateNumber && (
                                <p className="text-gray-400 text-xs">N°: {cert.certificateNumber}</p>
                            )}
                            {cert.description && (
                                <div className="text-gray-300 text-sm mt-2">
                                    <div dangerouslySetInnerHTML={{ __html: cert.description.replace(/\n/g, '<br>') }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}