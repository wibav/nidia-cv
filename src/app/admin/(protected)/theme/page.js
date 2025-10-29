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

const DEMO_PERSONAL_INFO = {
    name: 'Nidia Nahas Alfonzo',
    title: 'Arquitecto',
    description: 'Delineante técnico en AutoCAD/Modelador BIM',
    location: 'Porto, Portugal',
    phone: '+351 963 795 269',
    email: 'nidia@example.com',
};

const FONT_OPTIONS = [
    { value: 'system-ui', label: 'Sistema (Por defecto)', fontFamily: 'system-ui' },
    { value: 'serif', label: 'Serif Clásico', fontFamily: 'Georgia, serif' },
    { value: 'sans-serif-modern', label: 'Sans-Serif Moderno', fontFamily: '"Trebuchet MS", sans-serif' },
    { value: 'monospace', label: 'Monoespaciada', fontFamily: '"Courier New", monospace' },
    { value: 'cursive', label: 'Cursiva Elegante', fontFamily: 'cursive' },
    { value: 'display', label: 'Display Bold', fontFamily: 'Impact, Charcoal, sans-serif' },
    { value: 'comic', label: 'Comic Sans MS', fontFamily: '"Comic Sans MS", cursive' },
    { value: 'garamond', label: 'Garamond', fontFamily: 'Garamond, serif' },
];

export default function ThemeConfigPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [useCustom, setUseCustom] = useState(false);
    const [customColors, setCustomColors] = useState({
        backgroundColor: '#111827',
        titleColor: '#a78bfa',
        textColor: '#ffffff',
    });
    const [customFonts, setCustomFonts] = useState({
        titleFont: 'system-ui',
        textFont: 'system-ui',
    });
    const [personalInfo, setPersonalInfo] = useState(DEMO_PERSONAL_INFO);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/admin/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch personal info
                const personalDocRef = doc(db, 'personal', 'info');
                const personalDocSnap = await getDoc(personalDocRef);
                if (personalDocSnap.exists()) {
                    setPersonalInfo(personalDocSnap.data());
                } else {
                    setPersonalInfo(DEMO_PERSONAL_INFO);
                }

                // Fetch current theme
                const themeDocRef = doc(db, 'settings', 'theme');
                const themeDocSnap = await getDoc(themeDocRef);

                if (themeDocSnap.exists()) {
                    const data = themeDocSnap.data();

                    // Check if it's a custom theme
                    if (data.isCustom) {
                        setUseCustom(true);
                        setCustomColors({
                            backgroundColor: data.backgroundColor || '#111827',
                            titleColor: data.titleColor || '#a78bfa',
                            textColor: data.textColor || '#ffffff',
                        });
                        setCustomFonts({
                            titleFont: data.titleFont || 'system-ui',
                            textFont: data.textFont || 'system-ui',
                        });
                    } else {
                        const preset = COLOR_PRESETS.find(
                            p => p.titleColor === data.titleColor
                        );
                        if (preset) {
                            setSelectedPreset(preset);
                        } else {
                            setSelectedPreset(COLOR_PRESETS[0]);
                        }
                    }
                } else {
                    setSelectedPreset(COLOR_PRESETS[0]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setSelectedPreset(COLOR_PRESETS[0]);
                setPersonalInfo(DEMO_PERSONAL_INFO);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    const handleSaveTheme = async () => {
        if (!selectedPreset && !useCustom) return;

        setSaving(true);
        setMessage('');

        try {
            const docRef = doc(db, 'settings', 'theme');
            const themeData = useCustom
                ? {
                    backgroundColor: customColors.backgroundColor,
                    titleColor: customColors.titleColor,
                    textColor: customColors.textColor,
                    titleFont: customFonts.titleFont,
                    textFont: customFonts.textFont,
                    isCustom: true,
                    updatedAt: new Date(),
                }
                : {
                    backgroundColor: selectedPreset.backgroundColor,
                    backgroundColorClass: selectedPreset.backgroundColorClass,
                    titleColor: selectedPreset.titleColor,
                    titleColorClass: selectedPreset.titleColorClass,
                    accentColor: selectedPreset.accentColor,
                    accentColorClass: selectedPreset.accentColorClass,
                    isCustom: false,
                    updatedAt: new Date(),
                };

            await setDoc(docRef, themeData);

            setMessage('✅ Tema guardado exitosamente');
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

    const currentColors = useCustom ? customColors : selectedPreset || COLOR_PRESETS[0];

    // Get font families
    const getTitleFontFamily = () => {
        const font = FONT_OPTIONS.find(f => f.value === (useCustom ? customFonts.titleFont : 'system-ui'));
        return font?.fontFamily || 'system-ui';
    };

    const getTextFontFamily = () => {
        const font = FONT_OPTIONS.find(f => f.value === (useCustom ? customFonts.textFont : 'system-ui'));
        return font?.fontFamily || 'system-ui';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-400 mb-8">
                    Configuración de Tema
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sección izquierda: Presets */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-purple-300 mb-6">
                                Temas Preestablecidos
                            </h2>

                            <div className="space-y-3 mb-6">
                                {COLOR_PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => {
                                            setSelectedPreset(preset);
                                            setUseCustom(false);
                                        }}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${!useCustom && selectedPreset?.name === preset.name
                                            ? 'border-purple-500 bg-gray-700'
                                            : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                                            }`}
                                        style={{
                                            borderLeftColor: preset.titleColor,
                                            borderLeftWidth: !useCustom && selectedPreset?.name === preset.name ? '4px' : '2px',
                                        }}
                                    >
                                        <div className="font-semibold text-sm">{preset.name}</div>
                                        <div
                                            className="text-xs mt-1"
                                            style={{ color: preset.titleColor }}
                                        >
                                            Titulo
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <hr className="border-gray-700 my-6" />

                            <button
                                onClick={() => setUseCustom(!useCustom)}
                                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${useCustom
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {useCustom ? '✓ Modo Personalizado' : '+ Personalizado'}
                            </button>
                        </div>

                        {/* Color Pickers - Solo si está en modo custom */}
                        {useCustom && (
                            <div className="bg-gray-800 rounded-lg p-6 mt-6">
                                <h3 className="text-lg font-semibold text-purple-300 mb-4">
                                    Colores Personalizados
                                </h3>

                                <div className="space-y-4">
                                    {/* Background Color */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Fondo
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={customColors.backgroundColor}
                                                onChange={(e) =>
                                                    setCustomColors({
                                                        ...customColors,
                                                        backgroundColor: e.target.value,
                                                    })
                                                }
                                                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                                            />
                                            <span className="text-gray-400 text-xs font-mono break-all">
                                                {customColors.backgroundColor}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title Color */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Títulos
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={customColors.titleColor}
                                                onChange={(e) =>
                                                    setCustomColors({
                                                        ...customColors,
                                                        titleColor: e.target.value,
                                                    })
                                                }
                                                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                                            />
                                            <span className="text-gray-400 text-xs font-mono break-all">
                                                {customColors.titleColor}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Text Color */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Texto
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={customColors.textColor}
                                                onChange={(e) =>
                                                    setCustomColors({
                                                        ...customColors,
                                                        textColor: e.target.value,
                                                    })
                                                }
                                                className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                                            />
                                            <span className="text-gray-400 text-xs font-mono break-all">
                                                {customColors.textColor}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-700 my-6" />

                                {/* Font Selectors */}
                                <h3 className="text-lg font-semibold text-purple-300 mb-4">
                                    Tipos de Letra
                                </h3>

                                <div className="space-y-4">
                                    {/* Title Font */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Fuente de Títulos
                                        </label>
                                        <select
                                            value={customFonts.titleFont}
                                            onChange={(e) =>
                                                setCustomFonts({
                                                    ...customFonts,
                                                    titleFont: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-gray-300 hover:border-gray-500 focus:border-purple-500 focus:outline-none"
                                        >
                                            {FONT_OPTIONS.map((font) => (
                                                <option key={font.value} value={font.value}>
                                                    {font.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Text Font */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Fuente de Texto
                                        </label>
                                        <select
                                            value={customFonts.textFont}
                                            onChange={(e) =>
                                                setCustomFonts({
                                                    ...customFonts,
                                                    textFont: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-gray-300 hover:border-gray-500 focus:border-purple-500 focus:outline-none"
                                        >
                                            {FONT_OPTIONS.map((font) => (
                                                <option key={font.value} value={font.value}>
                                                    {font.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección derecha: Preview */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg p-8">
                            <h2 className="text-xl font-semibold text-purple-300 mb-6">
                                Vista previa
                            </h2>

                            <div
                                className="rounded-lg p-12"
                                style={{
                                    backgroundColor: currentColors.backgroundColor,
                                }}
                            >
                                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
                                    {/* Imagen a la izquierda */}
                                    <div className="flex-shrink-0">
                                        {personalInfo?.profileImage ? (
                                            <img
                                                src={personalInfo.profileImage}
                                                alt={personalInfo?.name || DEMO_PERSONAL_INFO.name}
                                                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4"
                                                style={{ borderColor: currentColors.titleColor }}
                                            />
                                        ) : (
                                            <div
                                                className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-700 flex items-center justify-center text-gray-300"
                                                style={{ border: `4px solid ${currentColors.titleColor}` }}
                                            >
                                                <span className="text-sm">No Imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información a la derecha */}
                                    <div className="text-center md:text-left">
                                        <h1
                                            className="text-3xl md:text-4xl font-bold mb-2"
                                            style={{
                                                color: currentColors.titleColor,
                                                fontFamily: getTitleFontFamily(),
                                            }}
                                        >
                                            {personalInfo?.name || DEMO_PERSONAL_INFO.name}
                                        </h1>

                                        <p
                                            className="text-lg mb-2"
                                            style={{
                                                color: currentColors.textColor || currentColors.accentColor,
                                                fontFamily: getTextFontFamily(),
                                            }}
                                        >
                                            {personalInfo?.title || DEMO_PERSONAL_INFO.title}
                                            {personalInfo?.description && `. ${personalInfo.description}`}
                                        </p>

                                        <p
                                            className="text-sm text-gray-300"
                                            style={{ fontFamily: getTextFontFamily() }}
                                        >
                                            {personalInfo?.location || DEMO_PERSONAL_INFO.location}
                                            {personalInfo?.phone && ` | ${personalInfo.phone}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Información del tema */}
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                                    Información del tema
                                </h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div
                                            className="w-12 h-12 rounded mx-auto mb-2"
                                            style={{
                                                backgroundColor: currentColors.backgroundColor,
                                                border: '2px solid rgb(107, 114, 128)',
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-400">Fondo</div>
                                    </div>
                                    <div>
                                        <div
                                            className="w-12 h-12 rounded mx-auto mb-2"
                                            style={{
                                                backgroundColor: currentColors.titleColor,
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-400">Títulos</div>
                                    </div>
                                    <div>
                                        <div
                                            className="w-12 h-12 rounded mx-auto mb-2"
                                            style={{
                                                backgroundColor: currentColors.textColor || currentColors.accentColor,
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-400">Texto</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-lg ${message.includes('✅')
                                ? 'bg-green-900 text-green-300'
                                : 'bg-red-900 text-red-300'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="mt-6 flex gap-4">
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
            </div>
        </div>
    );
}
