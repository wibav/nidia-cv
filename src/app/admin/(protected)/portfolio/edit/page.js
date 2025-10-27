'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PortfolioEditRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            router.replace(`/admin/projects/edit?id=${id}`);
        } else {
            router.replace('/admin/projects');
        }
    }, [router, id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Redirigiendo a editar proyecto...</p>
                </div>
            </div>
        </div>
    );
}