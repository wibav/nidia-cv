"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProtectedRoute({ children, requireAdmin = true }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Verificar si es admin
                if (requireAdmin && user.email !== 'admin@nidia-cv.com') {
                    router.push('/admin/login?error=unauthorized');
                    return;
                }
                setUser(user);
            } else {
                router.push('/admin/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, requireAdmin]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return children;
}