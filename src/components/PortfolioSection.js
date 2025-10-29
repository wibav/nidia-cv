"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';

export function PortfolioSection() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="portfolio" className="px-6 py-16">
                <div className="text-center mb-8">
                    <div className="h-8 bg-gray-700 rounded w-48 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <div className="w-full h-48 bg-gray-700"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="portfolio" className="px-6 py-16">
            <h2 className="text-2xl font-semibold mb-8 text-center" style={{ color: theme.titleColor }}>
                Portafolio Arquitectónico
            </h2>

            {projects.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">No hay proyectos registrados aún.</p>
                    <p className="text-gray-500 text-sm mt-2">Agregue proyectos desde el panel de administración.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-105"
                            onClick={() => setSelectedProject(project)}
                        >
                            {project.images && project.images.length > 0 ? (
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-project.jpg';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-400">Sin imagen</span>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-medium" style={{ color: theme.titleColor }}>
                                    {project.title}
                                </h3>
                                {project.category && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        {project.category}
                                    </p>
                                )}
                                {project.status && (
                                    <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${project.status === 'Completado' ? 'bg-green-900 text-green-300' :
                                        project.status === 'En ejecución' ? 'bg-blue-900 text-blue-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>
                                        {project.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Proyecto */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold" style={{ color: theme.titleColor }}>
                                        {selectedProject.title}
                                    </h3>
                                    {selectedProject.category && (
                                        <p className="text-gray-400 text-sm">{selectedProject.category}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Galería de imágenes */}
                            {selectedProject.images && selectedProject.images.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {selectedProject.images.map((imgSrc, imgIndex) => (
                                        <div key={imgIndex} className="bg-gray-700 rounded-lg overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={`${selectedProject.title} - ${imgIndex + 1}`}
                                                className="w-full h-64 object-contain"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-project.jpg';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Descripción */}
                            {selectedProject.description && (
                                <div className="mb-4">
                                    <h4 className="text-lg font-medium mb-2" style={{ color: theme.titleColor }}>Descripción</h4>
                                    <div className="text-gray-300 leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: selectedProject.description.replace(/\n/g, '<br>') }} />
                                    </div>
                                </div>
                            )}

                            {/* Tecnologías */}
                            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-lg font-medium mb-2" style={{ color: theme.titleColor }}>Software Utilizado</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech, index) => (
                                            <span key={index} className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enlaces */}
                            <div className="flex gap-4">
                                {selectedProject.websiteUrl && (
                                    <a
                                        href={selectedProject.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                    >
                                        Ver Sitio Web
                                    </a>
                                )}
                                {selectedProject.demoUrl && (
                                    <a
                                        href={selectedProject.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                    >
                                        Ver Demo
                                    </a>
                                )}
                                {selectedProject.repoUrl && (
                                    <a
                                        href={selectedProject.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                    >
                                        Ver Repositorio
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}