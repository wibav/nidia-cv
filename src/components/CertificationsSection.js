"use client";
import { useLanguage } from '../contexts/LanguageContext';
import { certifications } from '../data/cvData';

export function CertificationsSection() {
    const { language, t } = useLanguage();

    const getTranslatedCertifications = () => {
        return certifications.map(cert => ({
            ...cert,
            title: language === 'es' ? cert.title :
                language === 'pt' ? (
                    cert.title === 'Autodesk Revit MEP' ? 'Autodesk Revit MEP' :
                        cert.title === 'Autodesk Revit Arquitectura' ? 'Autodesk Revit Arquitetura' :
                            cert.title === 'SketchUp Pro' ? 'SketchUp Pro' :
                                cert.title === 'Creación de proyectos de Interiorismo' ? 'Criação de projetos de Design de Interiores' :
                                    cert.title
                ) :
                    cert.title,
            date: language === 'es' ? cert.date :
                language === 'pt' ? (
                    cert.date === 'Diciembre 2024' ? 'Dezembro 2024' :
                        cert.date === 'Marzo 2025' ? 'Março 2025' :
                            cert.date === 'Febrero 2022' ? 'Fevereiro 2022' :
                                cert.date === 'Agosto 2023' ? 'Agosto 2023' :
                                    cert.date
                ) :
                    cert.date
        }));
    };

    return (
        <section id="certifications" className="px-6 py-10 bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">{t('certifications')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {getTranslatedCertifications().map((cert, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-purple-200 font-semibold">{cert.title}</h3>
                            <p className="text-gray-300 text-sm">{cert.issuer} | {cert.date}</p>
                            {cert.certificateNumber && (
                                <p className="text-gray-400 text-xs">Certificate N°: {cert.certificateNumber}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}