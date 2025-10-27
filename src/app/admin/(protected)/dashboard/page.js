"use client";

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-700 rounded-lg p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                        ¡Bienvenido al Panel de Administración!
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Aquí podrás gestionar todo el contenido de tu portafolio profesional.
                    </p>

                    {/* Cards de funcionalidades futuras */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <Link href="/admin/personal" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group">
                            <h3 className="text-lg font-medium text-purple-300 mb-2 group-hover:text-purple-200">
                                👤 Información Personal
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Gestiona tu perfil, contacto y datos personales.
                            </p>
                        </Link>

                        <Link href="/admin/experience" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group">
                            <h3 className="text-lg font-medium text-purple-300 mb-2 group-hover:text-purple-200">
                                💼 Experiencia Laboral
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Agrega, edita y organiza tus experiencias profesionales.
                            </p>
                        </Link>

                        <Link href="/admin/portfolio" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group">
                            <h3 className="text-lg font-medium text-purple-300 mb-2 group-hover:text-purple-200">
                                🎨 Portafolio Arquitectónico
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Gestiona tus proyectos arquitectónicos con imágenes, planos y detalles constructivos.
                            </p>
                        </Link>

                        <Link href="/admin/education" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group">
                            <h3 className="text-lg font-medium text-purple-300 mb-2 group-hover:text-purple-200">
                                🎓 Educación & Formación
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Gestiona tu formación académica, títulos y especialidades.
                            </p>
                        </Link>

                        <Link href="/admin/certifications" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group">
                            <h3 className="text-lg font-medium text-purple-300 mb-2 group-hover:text-purple-200">
                                🏆 Certificaciones
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Administra tus certificaciones profesionales y credenciales.
                            </p>
                        </Link>

                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 opacity-60">
                            <h3 className="text-lg font-medium text-purple-300 mb-2">
                                🛠️ Habilidades Técnicas
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Gestiona tus competencias en software arquitectónico y BIM.
                            </p>
                            <span className="text-xs text-gray-500 mt-2 block">Próxima Fase</span>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 opacity-60">
                            <h3 className="text-lg font-medium text-purple-300 mb-2">
                                🌐 Traducciones
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Edita textos en español, portugués e inglés.
                            </p>
                            <span className="text-xs text-gray-500 mt-2 block">Próxima Fase</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
