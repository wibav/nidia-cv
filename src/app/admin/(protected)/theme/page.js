"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const COLOR_PRESETS = [
    {
        name: 'Púrpura Clásico',
        backgroundColor: '#111827',
        backgroundColorClass: 'bg-gray-900',
        titleColor: '#a78bfa',
        titleColorClass: 'text-purple-400',
        accentColor: '#c084fc',
        accentColorClass: 'text-purple-500',
    },
    {
        name: 'Azul Moderno',
        backgroundColor: '#0f172a',
        backgroundColorClass: 'bg-slate-950',
        titleColor: '#60a5fa',
        titleColorClass: 'text-blue-400',
        accentColor: '#3b82f6',
        accentColorClass: 'text-blue-500',
    },
    {
        name: 'Verde Naturaleza',
        backgroundColor: '#1a2e1a',
        backgroundColorClass: 'bg-green-950',
        titleColor: '#10b981',
        titleColorClass: 'text-green-500',
        accentColor: '#34d399',
        accentColorClass: 'text-green-400',
    },
    {
        name: 'Rojo Pasión',
        backgroundColor: '#1f1213',
        backgroundColorClass: 'bg-red-950',
        titleColor: '#f87171',
        titleColorClass: 'text-red-400',
        accentColor: '#ef4444',
        accentColorClass: 'text-red-500',
    },
    {
        name: 'Naranja Energía',
        backgroundColor: '#1e1a16',
        backgroundColorClass: 'bg-orange-950',
        titleColor: '#fb923c',
        titleColorClass: 'text-orange-400',
        accentColor: '#f97316',
        accentColorClass: 'text-orange-500',
    },
];

export default function ThemeConfigPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/admin/login');
            return;
        }

        const fetchCurrentTheme = async () => {
            try {
                const docRef = doc(db, 'settings', 'theme');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const preset = COLOR_PRESETS.find(
                        p => p.titleColor === data.titleColor
                    );
                    if (preset) {
                        setSelectedPreset(preset);
                    } else {
                        setSelectedPreset(COLOR_PRESETS[0]);
                    }
                } else {
                    setSelectedPreset(COLOR_PRESETS[0]);
                }
            } catch (error) {
                console.error('Error fetching theme:', error);
                setSelectedPreset(COLOR_PRESETS[0]);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentTheme();
    }, [user, router]);

    const handleSaveTheme = async () => {
        if (!selectedPreset) return;

        setSaving(true);
        setMessage('');

        try {
            const docRef = doc(db, 'settings', 'theme');
            await setDoc(docRef, {
                backgroundColor: selectedPreset.backgroundColor,
                backgroundColorClass: selectedPreset.backgroundColorClass,
                titleColor: selectedPreset.titleColor,
                titleColorClass: selectedPreset.titleColorClass,
                accentColor: selectedPreset.accentColor,
                accentColorClass: selectedPreset.accentColorClass,
                updatedAt: new Date(),
            });

            setMessage('✅ Tema guardado exitosamente');
            // Recargar la página después de 1.5 segundos
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error saving theme:', error);
            setMessage('❌ Error al guardar el tema');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-400 mb-8">
                    Configuración de Tema
                </h1>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-purple-300 mb-6">
                        Selecciona un tema para tu portafolio
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => setSelectedPreset(preset)}
                                className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${selectedPreset?.name === preset.name
                                        ? 'border-purple-500 scale-105'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                                style={{
                                    backgroundColor: preset.backgroundColor,
                                }}
                            >
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">{preset.name}</h3>

                                    {/* Preview Nombre */}
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: preset.titleColor }}
                                    >
                                        Nidia Nahas
                                    </div>

                                    {/* Preview Subtítulo */}
                                    <div
                                        className="text-sm"
                                        style={{ color: preset.accentColor }}
                                    >
                                        Arquitecto
                                    </div>

                                    {/* Indicador seleccionado */}
                                    {selectedPreset?.name === preset.name && (
                                        <div className="mt-4 text-center">
                                            <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold">
                                                ✓ Seleccionado
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview del tema seleccionado */}
                {selectedPreset && (
                    <div className="bg-gray-800 rounded-lg p-8 mb-8">
                        <h2 className="text-xl font-semibold text-purple-300 mb-6">
                            Vista previa del tema
                        </h2>

                        <div
                            className="rounded-lg p-12 text-center"
                            style={{
                                backgroundColor: selectedPreset.backgroundColor,
                            }}
                        >
                            <h1
                                className="text-4xl font-bold mb-2"
                                style={{ color: selectedPreset.titleColor }}
                            >
                                Nidia Nahas Alfonzo
                            </h1>
                            <p
                                className="text-lg mb-4"
                                style={{ color: selectedPreset.accentColor }}
                            >
                                Arquitecto. Delineante técnico en AutoCAD/Modelador BIM
                            </p>
                            <p className="text-gray-400">
                                Porto, Portugal | +351 963 795 269
                            </p>
                        </div>
                    </div>
                )}

                {/* Mensaje */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('✅')
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSaveTheme}
                        disabled={saving}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {saving ? 'Guardando...' : 'Guardar Tema'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
