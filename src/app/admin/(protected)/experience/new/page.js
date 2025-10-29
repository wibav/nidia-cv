'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import MonthYearPicker from '@/components/MonthYearPicker';

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
            const docRef = doc(db, 'experiences', experienceId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    position: data.position || '',
                    company: data.company || '',
                    location: data.location || '',
                    description: data.description || '',
                    technologies: data.technologies || [],
                    startDate: data.startDate ? new Date(data.startDate.seconds * 1000).toISOString().slice(0, 7) : '',
                    endDate: data.endDate ? new Date(data.endDate.seconds * 1000).toISOString().slice(0, 7) : '',
                    current: data.current || false
                });
            } else {
                alert('Experiencia profesional no encontrada');
                router.push('/admin/experience');
            }
        } catch (error) {
            console.error('Error obteniendo experiencia:', error);
            alert('Error al cargar la experiencia profesional');
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
        } else if (!/^\d{4}-\d{2}$/.test(formData.startDate)) {
            newErrors.startDate = 'La fecha de inicio debe tener formato YYYY-MM';
        }

        if (!formData.current && !formData.endDate) {
            newErrors.endDate = 'La fecha de fin es obligatoria (o marca "Trabajo actual")';
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
            const docId = experienceId || new Date().getTime().toString();
            const docRef = doc(db, 'experiences', docId);

            const experienceData = {
                position: formData.position.trim(),
                company: formData.company.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                technologies: formData.technologies.length > 0 ? formData.technologies : [],
                startDate: Timestamp.fromDate(new Date(formData.startDate + '-01')),
                endDate: formData.current || !formData.endDate ? null : Timestamp.fromDate(new Date(formData.endDate + '-01')),
                current: formData.current,
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, experienceData, { merge: false });
            router.push('/admin/experience');
        } catch (error) {
            console.log('Error guardando experiencia:', error);
            alert('Error al guardar la experiencia profesional. Inténtalo nuevamente.');
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
                        {isEditing ? 'Editar' : 'Nueva'} Experiencia Profesional
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
                                    Rol/Puesto Arquitectónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.position ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Arquitecto Senior, Project Manager, BIM Coordinator"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-400">{errors.position}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                                    Estudio/Empresa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.company ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Estudio Arquitectónico Pérez, Constructora XYZ"
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
                                    placeholder="Ciudad, Región, País"
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
                                    <p className="mt-2 text-xs text-purple-300">✓ Actualmente trabajas aquí</p>
                                )}
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
                            placeholder="Describe tus responsabilidades arquitectónicas, proyectos destacados, metodologías utilizadas, equipos liderados, etc..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tech" className="block text-sm font-medium text-gray-300 mb-2">
                            Software y Herramientas Arquitectónicas
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
                                placeholder="Ej: AutoCAD, Revit, SketchUp, V-Ray, BIM 360"
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
