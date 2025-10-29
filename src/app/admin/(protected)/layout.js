'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProtectedLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 shadow-lg min-h-screen fixed">
                    <div className="p-6">
                        <Link href="/admin/dashboard" className="flex items-center space-x-2 mb-8">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                                CV Admin
                            </span>
                        </Link>

                        <nav className="space-y-2">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🏠</span>
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/admin/personal"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>👤</span>
                                <span>Información Personal</span>
                            </Link>

                            <Link
                                href="/admin/experience"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>💼</span>
                                <span>Experiencia Laboral</span>
                            </Link>

                            <Link
                                href="/admin/portfolio"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🎨</span>
                                <span>Portafolio</span>
                            </Link>

                            <Link
                                href="/admin/education"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🎓</span>
                                <span>Educación</span>
                            </Link>

                            <Link
                                href="/admin/skills"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🛠️</span>
                                <span>Habilidades</span>
                            </Link>

                            <Link
                                href="/admin/translations"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🌐</span>
                                <span>Traducciones</span>
                            </Link>

                            <hr className="my-4 border-gray-600" />

                            <Link
                                href="/"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <span>🌐</span>
                                <span>Ver Portafolio</span>
                            </Link>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors w-full text-left text-red-400"
                            >
                                <span>🚪</span>
                                <span>Cerrar Sesión</span>
                            </button>
                        </nav>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-950">
                        <div className="text-xs text-gray-400">
                            <p className="font-semibold mb-1">Usuario:</p>
                            <p className="truncate">{user?.email}</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
