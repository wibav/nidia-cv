'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function ProjectFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');
    const isEditing = !!projectId;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: [],
        images: [],
        demoUrl: '',
        repoUrl: '',
        websiteUrl: '',
        category: '',
        status: 'completed',
        featured: false,
        startDate: '',
        endDate: ''
    });

    const [tech, setTech] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        'Arquitectura Residencial',
        'Arquitectura Comercial',
        'Arquitectura Institucional',
        'Diseño de Interiores',
        'Urbanismo y Paisajismo',
        'Restauración Arquitectónica',
        'Construcción Sustentable',
        'Diseño Arquitectónico',
        'Proyecto Ejecutivo',
        'Consultoría Arquitectónica',
        'Other'
    ];

    const statuses = [
        { value: 'completed', label: 'Completado' },
        { value: 'in-progress', label: 'En ejecución' },
        { value: 'planned', label: 'En diseño' },
        { value: 'on-hold', label: 'Suspendido' }
    ];

    const fetchProject = async () => {
        try {
            const docRef = doc(db, 'projects', projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    technologies: data.technologies || [],
                    images: data.images || [],
                    demoUrl: data.demoUrl || '',
                    repoUrl: data.repoUrl || '',
                    websiteUrl: data.websiteUrl || '',
                    category: data.category || '',
                    status: data.status || 'completed',
                    featured: data.featured || false,
                    startDate: data.startDate ? new Date(data.startDate.seconds * 1000).toISOString().split('T')[0] : '',
                    endDate: data.endDate ? new Date(data.endDate.seconds * 1000).toISOString().split('T')[0] : ''
                });
                setImagePreviews(data.images || []);
            } else {
                alert('Proyecto no encontrado');
                router.push('/admin/projects');
            }
        } catch (error) {
            console.error('Error obteniendo proyecto:', error);
            alert('Error al cargar el proyecto');
            router.push('/admin/projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditing && projectId) {
            fetchProject();
        }
    }, [isEditing, projectId, router]);

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + formData.images.length > 10) {
            alert('Máximo 10 imágenes por proyecto');
            return;
        }

        const validFiles = [];
        const previews = [];

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert(`El archivo "${file.name}" no es una imagen válida`);
                return;
            }

            if (file.size > 1 * 1024 * 1024) {
                alert(`La imagen "${file.name}" supera 1MB`);
                return;
            }

            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                previews.push(base64String);

                if (previews.length === validFiles.length) {
                    setImagePreviews(prev => [...prev, ...previews]);
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...previews]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        setImageFiles(prev => [...prev, ...validFiles]);
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveImage = (fromIndex, toIndex) => {
        const newPreviews = [...imagePreviews];
        const newImages = [...formData.images];

        [newPreviews[fromIndex], newPreviews[toIndex]] = [newPreviews[toIndex], newPreviews[fromIndex]];
        [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];

        setImagePreviews(newPreviews);
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es obligatoria';
        }

        if (formData.demoUrl && !formData.demoUrl.startsWith('https://')) {
            newErrors.demoUrl = 'La URL del demo debe comenzar con https://';
        }

        if (formData.repoUrl && !formData.repoUrl.startsWith('https://')) {
            newErrors.repoUrl = 'La URL del repositorio debe comenzar con https://';
        }

        if (formData.websiteUrl && !formData.websiteUrl.startsWith('https://')) {
            newErrors.websiteUrl = 'La URL del sitio web debe comenzar con https://';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
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
            console.log('Guardando proyecto en Firestore...');
            const docId = projectId || new Date().getTime().toString();
            const docRef = doc(db, 'projects', docId);

            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                technologies: formData.technologies,
                images: formData.images,
                demoUrl: formData.demoUrl.trim() || null,
                repoUrl: formData.repoUrl.trim() || null,
                websiteUrl: formData.websiteUrl.trim() || null,
                category: formData.category,
                status: formData.status,
                featured: formData.featured,
                startDate: formData.startDate ? Timestamp.fromDate(new Date(formData.startDate)) : null,
                endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : null,
                createdAt: isEditing ? undefined : Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            await setDoc(docRef, projectData, { merge: false });
            console.log('Proyecto guardado exitosamente');

            router.push('/admin/projects');
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Código de error:', error.code);
            console.error('Mensaje:', error.message);

            let errorMessage = 'Error al guardar el proyecto. ';

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
                        href="/admin/projects"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Volver al Portafolio Arquitectónico
                    </Link>
                    <span className="text-gray-400">|</span>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar' : 'Nuevo'} Proyecto Arquitectónico
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">Información del Proyecto Arquitectónico</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Título del Proyecto <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-500' : 'border-gray-600'
                                        } bg-gray-700 text-white`}
                                    placeholder="Ej: Casa Moderna en Viña del Mar - Diseño Sustentable"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-400">{errors.title}</p>
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
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                                    Estado del Proyecto
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                >
                                    {statuses.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Finalización
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="featured" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-300">
                                        Proyecto destacado
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descripción del Proyecto <span className="text-red-500">*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe detalladamente el proyecto arquitectónico, sus características, materiales utilizados, conceptos de diseño y resultados obtenidos..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tech" className="block text-sm font-medium text-gray-300 mb-2">
                            Software y Herramientas Utilizadas
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
                                placeholder="Ej: AutoCAD, Revit, SketchUp, V-Ray, Photoshop"
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

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Imágenes del Proyecto Arquitectónico</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Sube hasta 10 imágenes del proyecto (máx. 1MB cada una). Incluye renders 3D, planos, fotografías de obra y detalles constructivos. La primera imagen será la portada.
                        </p>

                        <div className="mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            />
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Imagen ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-600"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(index, index - 1)}
                                                    className="text-white hover:text-purple-300"
                                                    title="Mover a la izquierda"
                                                >
                                                    ←
                                                </button>
                                            )}
                                            <span className="text-white text-sm">{index + 1}</span>
                                            {index < imagePreviews.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(index, index + 1)}
                                                    className="text-white hover:text-purple-300"
                                                    title="Mover a la derecha"
                                                >
                                                    →
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="text-red-400 hover:text-red-300 ml-2"
                                                title="Eliminar imagen"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                                Portada
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Enlaces y Recursos</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                Galería de Imágenes
                            </label>
                            <input
                                type="url"
                                id="demoUrl"
                                name="demoUrl"
                                value={formData.demoUrl}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.demoUrl ? 'border-red-500' : 'border-gray-600'
                                    } bg-gray-700 text-white`}
                                placeholder="https://behance.net/proyecto"
                            />
                            {errors.demoUrl && (
                                <p className="mt-1 text-sm text-red-400">{errors.demoUrl}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                Proyecto en Plataforma
                            </label>
                            <input
                                type="url"
                                id="repoUrl"
                                name="repoUrl"
                                value={formData.repoUrl}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.repoUrl ? 'border-red-500' : 'border-gray-600'
                                    } bg-gray-700 text-white`}
                                placeholder="https://archdaily.com/proyecto"
                            />
                            {errors.repoUrl && (
                                <p className="mt-1 text-sm text-red-400">{errors.repoUrl}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                Sitio Web del Proyecto
                            </label>
                            <input
                                type="url"
                                id="websiteUrl"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.websiteUrl ? 'border-red-500' : 'border-gray-600'
                                    } bg-gray-700 text-white`}
                                placeholder="https://cliente.com/proyecto"
                            />
                            {errors.websiteUrl && (
                                <p className="mt-1 text-sm text-red-400">{errors.websiteUrl}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/projects"
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') + ' Proyecto Arquitectónico'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}