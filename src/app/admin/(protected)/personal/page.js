'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function PersonalAdminPage() {
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        title: '',
        location: '',
        email: '',
        phone: '',
        linkedin: '',
        objective: '',
        profileImage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

    const fetchPersonalInfo = async () => {
        try {
            const docRef = doc(db, 'personal', 'info');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPersonalInfo(docSnap.data());
            }
        } catch (error) {
            console.error('Error obteniendo información personal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona un archivo de imagen válido');
                return;
            }

            // Validar tamaño (máximo 1MB para Base64)
            if (file.size > 1 * 1024 * 1024) {
                alert('La imagen no debe superar 1MB para almacenamiento directo');
                return;
            }

            setImageFile(file);

            // Crear preview y convertir a Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                // Actualizar directamente el profileImage con Base64
                setPersonalInfo(prev => ({
                    ...prev,
                    profileImage: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleObjectiveChange = (value) => {
        setPersonalInfo(prev => ({
            ...prev,
            objective: value || ''
        }));
        if (errors.objective) {
            setErrors(prev => ({
                ...prev,
                objective: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!personalInfo.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (!personalInfo.title.trim()) {
            newErrors.title = 'El título profesional es obligatorio';
        }

        if (!personalInfo.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (personalInfo.linkedin && !personalInfo.linkedin.startsWith('https://')) {
            newErrors.linkedin = 'El enlace de LinkedIn debe comenzar con https://';
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
            console.log('Guardando datos en Firestore...');
            const docRef = doc(db, 'personal', 'info');

            // Guardar toda la información incluyendo la imagen en Base64
            await setDoc(docRef, personalInfo);

            console.log('Datos guardados exitosamente');

            // Limpiar archivo y preview
            setImageFile(null);
            setImagePreview(null);

            alert('Información personal guardada exitosamente');
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Código de error:', error.code);
            console.error('Mensaje:', error.message);

            let errorMessage = 'Error al guardar la información. ';

            if (error.code === 'permission-denied') {
                errorMessage += 'No tienes permisos para guardar. Verifica que estés autenticado.';
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Inténtalo nuevamente.';
            }

            alert(errorMessage);
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
                        href="/admin/dashboard"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver al Dashboard
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">Información Personal</h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Datos Básicos</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={personalInfo.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Tu nombre completo"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Título Profesional <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={personalInfo.title}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Desarrolladora Full Stack"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                    Ubicación
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={personalInfo.location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-gray-700 text-white"
                                    placeholder="Ciudad, País"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={personalInfo.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={personalInfo.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-gray-700 text-white"
                                    placeholder="+XX XXX XXX XXX"
                                />
                            </div>

                            <div>
                                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-2">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    id="linkedin"
                                    name="linkedin"
                                    value={personalInfo.linkedin}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.linkedin ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="https://linkedin.com/in/tu-perfil"
                                />
                                {errors.linkedin && (
                                    <p className="mt-1 text-sm text-red-400">{errors.linkedin}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="objective" className="block text-sm font-medium text-gray-300 mb-2">
                            Objetivo Profesional
                        </label>
                        <MarkdownEditor
                            value={personalInfo.objective}
                            onChange={handleObjectiveChange}
                            placeholder="Describe tu objetivo profesional, experiencia y lo que buscas..."
                        />
                        {errors.objective && (
                            <p className="mt-1 text-sm text-red-400">{errors.objective}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-300 mb-2">
                            Foto de Perfil
                        </label>

                        {/* Preview de imagen actual o nueva */}
                        {(imagePreview || personalInfo.profileImage) && (
                            <div className="mb-4 flex items-center space-x-4">
                                <img
                                    src={imagePreview || personalInfo.profileImage}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-purple-500"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        ✕ Cancelar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Input de archivo */}
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="profileImage"
                                className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                📁 Seleccionar Imagen
                            </label>
                            <span className="text-sm text-gray-400">
                                {imageFile ? imageFile.name : 'Ningún archivo seleccionado'}
                            </span>
                        </div>

                        {/* Campo alternativo para URL */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                O ingresa una URL de imagen
                            </label>
                            <input
                                type="url"
                                name="profileImage"
                                value={personalInfo.profileImage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-gray-700 text-white"
                                placeholder="https://ejemplo.com/tu-foto.jpg"
                            />
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 1MB (se guarda como Base64)
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/dashboard"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
