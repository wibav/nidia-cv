"use client";
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { projects } from '../data/projects';

export function PortfolioSection() {
    const { language, t } = useLanguage();
    const [selectedProject, setSelectedProject] = useState(null);

    const getTranslatedTitle = (project) => {
        // Si el proyecto tiene un título específico por idioma, úsalo
        // Por ahora mantenemos los títulos en español ya que son nombres de proyectos
        return project.title;
    };

    return (
        <section id="portfolio" className="px-6 py-10">
            <h2 className="text-2xl font-semibold text-purple-300 mb-8 text-center">
                {t('portfolio')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => project.isMainProject ? setSelectedProject(project) : null}
                    >
                        <img
                            src={project.src}
                            alt={getTranslatedTitle(project)}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-purple-300">
                                {getTranslatedTitle(project)}
                            </h3>
                            {project.isMainProject && (
                                <p className="text-gray-400 text-sm mt-1">
                                    {t('viewCompleteGallery')}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Galería */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-purple-300">
                                    {getTranslatedTitle(selectedProject)}
                                </h3>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedProject.gallery.map((imgSrc, imgIndex) => (
                                    <div key={imgIndex} className="bg-gray-700 rounded-lg overflow-hidden">
                                        <img
                                            src={imgSrc}
                                            alt={`${getTranslatedTitle(selectedProject)} - ${imgIndex + 1}`}
                                            className="w-full h-64 object-contain"
                                        />
                                        <div className="p-3">
                                            <p className="text-gray-300 text-sm">
                                                {imgIndex === 0 ?
                                                    t('mainView') :
                                                    `${t('section')} ${imgIndex}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}