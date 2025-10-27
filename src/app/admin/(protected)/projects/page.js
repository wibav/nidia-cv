'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'list'
    const [filterTech, setFilterTech] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(projectsQuery);
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error('Error obteniendo proyectos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            return;
        }

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'projects', id));
            setProjects(projects.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            alert('Error al eliminar el proyecto');
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

    // Get unique technologies and categories for filters
    const allTechnologies = [...new Set(projects.flatMap(p => p.technologies || []))];
    const allCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesTech = !filterTech || (project.technologies || []).includes(filterTech);
        const matchesCategory = !filterCategory || project.category === filterCategory;
        return matchesTech && matchesCategory;
    });

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
                    <h1 className="text-4xl font-bold mb-2">Portafolio Arquitectónico</h1>
                    <p className="text-gray-400">
                        {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} arquitectónico{filteredProjects.length !== 1 ? 's' : ''} {filterTech || filterCategory ? 'filtrado' : 'registrado'}{filteredProjects.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/admin/projects/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    ➕ Nuevo Proyecto Arquitectónico
                </Link>
            </div>

            {/* Filters and View Toggle */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Vista:</span>
                        <button
                            onClick={() => setViewMode('gallery')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'gallery' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            🖼️ Galería
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            📋 Lista
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Software:</span>
                        <select
                            value={filterTech}
                            onChange={(e) => setFilterTech(e.target.value)}
                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Todas</option>
                            {allTechnologies.map(tech => (
                                <option key={tech} value={tech}>{tech}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Categoría:</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Todas</option>
                            {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {(filterTech || filterCategory) && (
                        <button
                            onClick={() => {
                                setFilterTech('');
                                setFilterCategory('');
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                            🗑️ Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold mb-2">
                        {projects.length === 0 ? 'No hay proyectos arquitectónicos' : 'No hay proyectos con esos filtros'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {projects.length === 0
                            ? 'Agrega tu primer proyecto arquitectónico para comenzar el portafolio'
                            : 'Prueba cambiando los filtros o agrega un nuevo proyecto arquitectónico'
                        }
                    </p>
                    <Link href="/admin/projects/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        {projects.length === 0 ? 'Agregar Primer Proyecto Arquitectónico' : 'Agregar Nuevo Proyecto Arquitectónico'}
                    </Link>
                </div>
            ) : viewMode === 'gallery' ? (
                // Gallery View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-colors group">
                            {/* Project Image */}
                            <div className="aspect-video bg-gray-700 relative overflow-hidden">
                                {project.images && project.images.length > 0 ? (
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🖼️</div>
                                            <div className="text-sm">Sin imagen</div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'completed' ? 'bg-green-600 text-white' :
                                        project.status === 'in-progress' ? 'bg-yellow-600 text-white' :
                                            'bg-gray-600 text-white'
                                        }`}>
                                        {project.status === 'completed' ? 'Completado' :
                                            project.status === 'in-progress' ? 'En desarrollo' :
                                                project.status || 'Sin estado'}
                                    </span>
                                </div>

                                {/* Featured Badge */}
                                {project.featured && (
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium">
                                            ⭐ Destacado
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Project Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                    {project.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                                    {project.description}
                                </p>

                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.technologies.slice(0, 3).map((tech, index) => (
                                            <span key={index} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                                                +{project.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Links */}
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 text-sm"
                                            >
                                                🎯 Demo
                                            </a>
                                        )}
                                        {project.repoUrl && (
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 text-sm"
                                            >
                                                📁 Repo
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/admin/projects/edit?id=${project.id}`}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            disabled={deleting === project.id}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                        >
                                            {deleting === project.id ? '⏳' : '🗑️'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // List View
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Proyecto Arquitectónico
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Software
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-700 rounded mr-3 flex-shrink-0 overflow-hidden">
                                                    {project.images && project.images.length > 0 ? (
                                                        <img
                                                            src={project.images[0]}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                            🖼️
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {project.title}
                                                    </div>
                                                    <div className="text-sm text-gray-400 line-clamp-1">
                                                        {project.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {project.category || 'Sin categoría'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {project.technologies && project.technologies.slice(0, 2).map((tech, index) => (
                                                    <span key={index} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies && project.technologies.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                                                        +{project.technologies.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'completed' ? 'bg-green-600 text-white' :
                                                project.status === 'in-progress' ? 'bg-yellow-600 text-white' :
                                                    'bg-gray-600 text-white'
                                                }`}>
                                                {project.status === 'completed' ? 'Completado' :
                                                    project.status === 'in-progress' ? 'En desarrollo' :
                                                        project.status || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatDate(project.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/admin/projects/edit?id=${project.id}`}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={deleting === project.id}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                                >
                                                    {deleting === project.id ? '⏳' : '🗑️'}
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