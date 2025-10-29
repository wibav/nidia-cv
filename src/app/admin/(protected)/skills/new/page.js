'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function SkillFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const skillId = searchParams.get('id');
    const isEditing = !!skillId;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        proficiency: 3,
        yearsOfExperience: 0,
        order: 0
    });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        'BIM Software',
        'CAD Software',
        'Modelado 3D',
        'Render & Visualización',
        'Gestión de Proyectos',
        'Diseño Urbano',
        'Software de Oficina'
    ];

    const softwareOptions = {
        'BIM Software': ['Revit', 'ArchiCAD', 'Allplan', 'Edificius'],
        'CAD Software': ['AutoCAD', 'MicroStation', 'LibreCAD'],
        'Modelado 3D': ['SketchUp', 'Rhino', '3ds Max', 'Blender', 'Cinema 4D'],
        'Render & Visualización': ['V-Ray', 'Lumion', 'Enscape', 'Corona Renderer', 'Mental Ray'],
        'Gestión de Proyectos': ['BIM 360', 'Navisworks', 'Synchro', 'Touchplan'],
        'Diseño Urbano': ['CityEngine', 'InfraWorks', 'Civil 3D'],
        'Software de Oficina': ['Microsoft Office', 'Google Workspace', 'Adobe Suite', 'Photoshop', 'Illustrator']
    };

    const proficiencyLabels = {
        1: 'Principiante',
        2: 'Básico',
        3: 'Intermedio',
        4: 'Avanzado',
        5: 'Experto'
    };

    const fetchSkill = async () => {
        try {
            const docRef = doc(db, 'skills', skillId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data());
            } else {
                alert('Habilidad no encontrada');
                router.push('/admin/skills');
            }
        } catch (error) {
            console.error('Error obteniendo skill:', error);
            alert('Error al cargar la habilidad');
            router.push('/admin/skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing && skillId) {
            fetchSkill();
        }
    }, [isEditing, skillId]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del software es obligatorio';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es obligatoria';
        }

        if (formData.proficiency < 1 || formData.proficiency > 5) {
            newErrors.proficiency = 'El nivel debe estar entre 1 y 5';
        }

        if (formData.yearsOfExperience < 0) {
            newErrors.yearsOfExperience = 'Los años no pueden ser negativos';
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
            const docId = skillId || new Date().getTime().toString();
            const docRef = doc(db, 'skills', docId);

            const skillData = {
                name: formData.name.trim(),
                category: formData.category,
                proficiency: formData.proficiency,
                yearsOfExperience: formData.yearsOfExperience,
                order: formData.order || 0,
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, skillData, { merge: !isEditing });
            router.push('/admin/skills');
        } catch (error) {
            console.error('Error guardando skill:', error);
            alert('Error al guardar la habilidad. Inténtalo nuevamente.');
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
                        href="/admin/skills"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver a Habilidades
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar' : 'Nueva'} Habilidad Técnica
                    </h1>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Información de la Habilidad</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Software / Herramienta <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    list="software-list"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Revit, AutoCAD, SketchUp"
                                />
                                <datalist id="software-list">
                                    {formData.category && softwareOptions[formData.category]?.map(soft => (
                                        <option key={soft} value={soft} />
                                    ))}
                                </datalist>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.category ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                                )}
                                {formData.category && softwareOptions[formData.category] && (
                                    <p className="mt-2 text-xs text-gray-400">
                                        Ejemplos: {softwareOptions[formData.category].join(', ')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="proficiency" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nivel de Proficiency <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        id="proficiency"
                                        name="proficiency"
                                        min="1"
                                        max="5"
                                        value={formData.proficiency}
                                        onChange={handleChange}
                                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex gap-1 min-w-fit">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                className={`text-2xl ${star <= formData.proficiency ? 'text-yellow-400' : 'text-gray-600'} cursor-pointer`}
                                                onClick={() => setFormData(prev => ({ ...prev, proficiency: star }))}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">
                                    {proficiencyLabels[formData.proficiency]}
                                </p>
                                {errors.proficiency && (
                                    <p className="mt-1 text-sm text-red-400">{errors.proficiency}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-300 mb-2">
                                    Años de Experiencia
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="range"
                                        id="yearsOfExperience"
                                        name="yearsOfExperience"
                                        min="0"
                                        max="50"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        min="0"
                                        max="50"
                                        className="w-16 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                    />
                                </div>
                                {errors.yearsOfExperience && (
                                    <p className="mt-1 text-sm text-red-400">{errors.yearsOfExperience}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/skills"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') + ' Habilidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
