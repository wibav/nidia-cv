'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function ExperienceFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const experienceId = searchParams.get('id');
    const isEditing = !!experienceId;

    const [formData, setFormData] = useState({
        position: '',
        company: '',
        location: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        current: false
    });
    const [tech, setTech] = useState('');
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchExperience = async () => {
        try {
            const docRef = doc(db, 'experience', experienceId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    position: data.position || '',
                    company: data.company || '',
                    location: data.location || '',
                    description: data.description || '',
                    technologies: data.technologies || [],
                    startDate: data.startDate ? new Date(data.startDate.seconds * 1000).toISOString().split('T')[0] : '',
                    endDate: data.endDate ? new Date(data.endDate.seconds * 1000).toISOString().split('T')[0] : '',
                    current: data.current || false
                });
            } else {
                alert('Experiencia no encontrada');
                router.push('/admin/experience');
            }
        } catch (error) {
            console.error('Error obteniendo experiencia:', error);
            alert('Error al cargar la experiencia');
            router.push('/admin/experience');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing && experienceId) {
            fetchExperience();
        }
    }, [isEditing, experienceId, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

    const addTechnology = () => {
        if (tech.trim() && !formData.technologies.includes(tech.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, tech.trim()]
            }));
            setTech('');
        }
    };

    const removeTechnology = (index) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.position.trim()) {
            newErrors.position = 'El puesto es obligatorio';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'La empresa es obligatoria';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La ubicación es obligatoria';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'La fecha de inicio es obligatoria';
        }

        if (!formData.current && !formData.endDate) {
            newErrors.endDate = 'La fecha de fin es obligatoria (o marca "Trabajo actual")';
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
            const docId = experienceId || new Date().getTime().toString();
            const docRef = doc(db, 'experience', docId);

            const experienceData = {
                position: formData.position.trim(),
                company: formData.company.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                technologies: formData.technologies,
                startDate: Timestamp.fromDate(new Date(formData.startDate)),
                endDate: formData.current ? null : Timestamp.fromDate(new Date(formData.endDate)),
                current: formData.current,
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, experienceData, { merge: false });
            router.push('/admin/experience');
        } catch (error) {
            console.error('Error guardando experiencia:', error);
            alert('Error al guardar la experiencia. Inténtalo nuevamente.');
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
                        href="/admin/experience"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver a Experiencias
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar' : 'Nueva'} Experiencia Laboral
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Información Básica</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-2">
                                    Puesto <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.position ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Senior Developer"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-400">{errors.position}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                                    Empresa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.company ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Nombre de la empresa"
                                />
                                {errors.company && (
                                    <p className="mt-1 text-sm text-red-400">{errors.company}</p>
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
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.startDate ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Fin
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={formData.current}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.endDate ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                                )}
                            </div>

                            <div className="flex items-center">
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
                                        Actualmente trabajo aquí
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción y Responsabilidades <span className="text-red-500">*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe tus responsabilidades, logros y tareas realizadas..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tech" className="block text-sm font-medium text-gray-300 mb-2">
                            Tecnologías Utilizadas
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="tech"
                                value={tech}
                                onChange={(e) => setTech(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTechnology();
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                placeholder="Ej: React, Node.js, PostgreSQL"
                            />
                            <button
                                type="button"
                                onClick={addTechnology}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Agregar
                            </button>
                        </div>

                        {formData.technologies.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {formData.technologies.map((t, index) => (
                                    <div
                                        key={index}
                                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {t}
                                        <button
                                            type="button"
                                            onClick={() => removeTechnology(index)}
                                            className="text-white hover:text-red-300 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/experience"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') + ' Experiencia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
