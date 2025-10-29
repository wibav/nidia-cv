'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import MonthYearPicker from '@/components/MonthYearPicker';

export default function EducationFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const educationId = searchParams.get('id');
    const isEditing = !!educationId;

    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        field: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false
    });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchEducation = async () => {
        try {
            const docRef = doc(db, 'education', educationId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    institution: data.institution || '',
                    degree: data.degree || '',
                    field: data.field || '',
                    location: data.location || '',
                    description: data.description || '',
                    startDate: data.startDate ? new Date(data.startDate.seconds * 1000).toISOString().slice(0, 7) : '',
                    endDate: data.endDate ? new Date(data.endDate.seconds * 1000).toISOString().slice(0, 7) : '',
                    current: data.current || false
                });
            } else {
                alert('Formación académica no encontrada');
                router.push('/admin/education');
            }
        } catch (error) {
            console.error('Error obteniendo formación académica:', error);
            alert('Error al cargar la formación académica');
            router.push('/admin/education');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing && educationId) {
            fetchEducation();
        }
    }, [isEditing, educationId, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            // Limpiar endDate si se marca "actual"
            ...(name === 'current' && checked ? { endDate: '' } : {})
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

        if (!formData.institution.trim()) {
            newErrors.institution = 'La institución es obligatoria';
        }

        if (!formData.degree.trim()) {
            newErrors.degree = 'El título obtenido es obligatorio';
        }

        if (!formData.field.trim()) {
            newErrors.field = 'La especialidad es obligatoria';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La ubicación es obligatoria';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'La fecha de inicio es obligatoria';
        } else if (!/^\d{4}-\d{2}$/.test(formData.startDate)) {
            newErrors.startDate = 'La fecha de inicio debe tener formato YYYY-MM';
        }

        if (!formData.current && !formData.endDate) {
            newErrors.endDate = 'La fecha de fin es obligatoria (o marca "Estudiando actualmente")';
        } else if (!formData.current && formData.endDate && !/^\d{4}-\d{2}$/.test(formData.endDate)) {
            newErrors.endDate = 'La fecha de fin debe tener formato YYYY-MM';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
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
            const docId = educationId || new Date().getTime().toString();
            const docRef = doc(db, 'education', docId);

            const educationData = {
                institution: formData.institution.trim(),
                degree: formData.degree.trim(),
                field: formData.field.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                startDate: Timestamp.fromDate(new Date(formData.startDate + '-01')),
                endDate: formData.current || !formData.endDate ? null : Timestamp.fromDate(new Date(formData.endDate + '-01')),
                current: formData.current,
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, educationData, { merge: false });
            router.push('/admin/education');
        } catch (error) {
            console.error('Error guardando formación académica:', error);
            alert('Error al guardar la formación académica. Inténtalo nuevamente.');
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
                        href="/admin/education"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver a Educación
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar' : 'Nueva'} Formación Académica
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Información Académica</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
                                    Institución Educativa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.institution ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Universidad de Chile"
                                />
                                {errors.institution && (
                                    <p className="mt-1 text-sm text-red-400">{errors.institution}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-2">
                                    Título Obtenido <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="degree"
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.degree ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Arquitecto, Licenciado en Arquitectura"
                                />
                                {errors.degree && (
                                    <p className="mt-1 text-sm text-red-400">{errors.degree}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="field" className="block text-sm font-medium text-gray-300 mb-2">
                                    Especialidad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="field"
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.field ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Arquitectura Sustentable, Diseño Urbano"
                                />
                                {errors.field && (
                                    <p className="mt-1 text-sm text-red-400">{errors.field}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                    Ubicación <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.location ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ciudad, País"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Inicio <span className="text-red-500">*</span>
                                </label>
                                <MonthYearPicker
                                    value={formData.startDate}
                                    onChange={(date) => {
                                        setFormData(prev => ({ ...prev, startDate: date }));
                                        if (errors.startDate) {
                                            setErrors(prev => ({ ...prev, startDate: '' }));
                                        }
                                    }}
                                    placeholder="Selecciona mes y año de inicio"
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Fin
                                </label>
                                <MonthYearPicker
                                    value={formData.endDate}
                                    onChange={(date) => {
                                        setFormData(prev => ({ ...prev, endDate: date }));
                                        if (errors.endDate) {
                                            setErrors(prev => ({ ...prev, endDate: '' }));
                                        }
                                    }}
                                    placeholder="Selecciona mes y año de fin"
                                />
                                {formData.current && (
                                    <p className="mt-2 text-xs text-purple-300">✓ Actualmente estudiando aquí</p>
                                )}
                                {errors.endDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                                )}
                            </div>

                            <div className="flex items-center md:col-span-2">
                                <label htmlFor="current" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="current"
                                        name="current"
                                        checked={formData.current}
                                        onChange={handleChange}
                                        className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-300">
                                        Actualmente estudiando aquí
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción y Logros Académicos <span className="text-red-500">*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe tu formación, especialidades, proyectos destacados, tesis, etc..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/education"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') + ' Formación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}