'use client';

import { useState, useEffect } from 'react';

export default function FirebaseStatus() {
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verificar si Firebase está disponible
        const checkFirebase = async () => {
            try {
                // Intentar importar Firebase dinámicamente para verificar disponibilidad
                const { db } = await import('../lib/firebase');
                if (db) {
                    setFirebaseStatus('available');
                }
            } catch (err) {
                console.error('Firebase check failed:', err);
                setError(err.message);
                setFirebaseStatus('unavailable');
            }
        };

        checkFirebase();
    }, []);

    if (firebaseStatus === 'checking') {
        return null; // No mostrar nada mientras se verifica
    }

    if (firebaseStatus === 'unavailable') {
        return (
            <div className="fixed bottom-4 right-4 bg-yellow-900 border border-yellow-700 rounded-lg p-4 max-w-sm z-50">
                <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⚠️</span>
                    <div>
                        <h3 className="text-yellow-400 font-medium">Configuración Incompleta</h3>
                        <p className="text-yellow-200 text-sm">
                            Firebase no está configurado correctamente. Algunas funciones pueden no estar disponibles.
                        </p>
                        {error && (
                            <p className="text-yellow-300 text-xs mt-1">
                                Error: {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}