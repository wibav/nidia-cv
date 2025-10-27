'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function CertificationFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const certificationId = searchParams.get('id');
    const isEditing = !!certificationId;

    const [formData, setFormData] = useState({
        name: '',
        institution: '',
        issuedDate: '',
        expiryDate: '',
        certificateNumber: '',
        verificationUrl: '',
        description: ''
    });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchCertification = async () => {
        try {
            const docRef = doc(db, 'certifications', certificationId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    name: data.name || '',
                    institution: data.institution || '',
                    issuedDate: data.issuedDate ? new Date(data.issuedDate.seconds * 1000).toISOString().split('T')[0] : '',
                    expiryDate: data.expiryDate ? new Date(data.expiryDate.seconds * 1000).toISOString().split('T')[0] : '',
                    certificateNumber: data.certificateNumber || '',
                    verificationUrl: data.verificationUrl || '',
                    description: data.description || ''
                });
            } else {
                alert('Certificación no encontrada');
                router.push('/admin/certifications');
            }
        } catch (error) {
            console.error('Error obteniendo certificación:', error);
            alert('Error al cargar la certificación');
            router.push('/admin/certifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing && certificationId) {
            fetchCertification();
        }
    }, [isEditing, certificationId, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({
            ...prev,
            description: value || ''
        }));
        if (errors.description) {
            setErrors(prev => ({
                ...prev,
                description: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre de la certificación es obligatorio';
        }

        if (!formData.institution.trim()) {
            newErrors.institution = 'La institución emisora es obligatoria';
        }

        if (!formData.issuedDate) {
            newErrors.issuedDate = 'La fecha de emisión es obligatoria';
        }

        if (formData.issuedDate && formData.expiryDate && formData.issuedDate > formData.expiryDate) {
            newErrors.expiryDate = 'La fecha de vencimiento debe ser posterior a la de emisión';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const docId = certificationId || new Date().getTime().toString();
            const docRef = doc(db, 'certifications', docId);

            const certificationData = {
                name: formData.name.trim(),
                institution: formData.institution.trim(),
                issuedDate: Timestamp.fromDate(new Date(formData.issuedDate)),
                expiryDate: formData.expiryDate ? Timestamp.fromDate(new Date(formData.expiryDate)) : null,
                certificateNumber: formData.certificateNumber.trim(),
                verificationUrl: formData.verificationUrl.trim(),
                description: formData.description.trim(),
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, certificationData, { merge: false });
            router.push('/admin/certifications');
        } catch (error) {
            console.error('Error guardando certificación:', error);
            alert('Error al guardar la certificación. Inténtalo nuevamente.');
        } finally {
            setSaving(false);
        }
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
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <Link
                        href="/admin/certifications"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver a Certificaciones
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar' : 'Nueva'} Certificación
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Información de la Certificación</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre de la Certificación <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Certificado BIM Management Professional"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
                                    Institución Emisora <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.institution ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Autodesk, Colegio de Arquitectos"
                                />
                                {errors.institution && (
                                    <p className="mt-1 text-sm text-red-400">{errors.institution}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Emisión <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="issuedDate"
                                    name="issuedDate"
                                    value={formData.issuedDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.issuedDate ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                />
                                {errors.issuedDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.issuedDate}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Vencimiento <span className="text-gray-400">(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.expiryDate ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                />
                                {errors.expiryDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.expiryDate}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    Deja vacío si la certificación no vence
                                </p>
                            </div>

                            <div>
                                <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-300 mb-2">
                                    Número de Certificado <span className="text-gray-400">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    id="certificateNumber"
                                    name="certificateNumber"
                                    value={formData.certificateNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                    placeholder="Ej: CERT-2024-001"
                                />
                            </div>

                            <div>
                                <label htmlFor="verificationUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                    URL de Verificación <span className="text-gray-400">(opcional)</span>
                                </label>
                                <input
                                    type="url"
                                    id="verificationUrl"
                                    name="verificationUrl"
                                    value={formData.verificationUrl}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                    placeholder="https://verify.certification.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción y Detalles <span className="text-red-500">*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe la certificación, competencias adquiridas, duración del curso, etc..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/certifications"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') + ' Certificación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}