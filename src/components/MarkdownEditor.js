'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Importar dinámicamente para evitar problemas de SSR
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
);

export default function MarkdownEditor({ value, onChange, placeholder = "Escribe aquí..." }) {
    const [preview, setPreview] = useState('edit');

    return (
        <div className="w-full">
            <MDEditor
                value={value}
                onChange={onChange}
                preview={preview}
                hideToolbar={false}
                visibleDragBar={false}
                data-color-mode="dark"
                textareaProps={{
                    placeholder: placeholder,
                }}
                className="w-full"
                style={{
                    backgroundColor: '#1f2937', // gray-800
                    color: '#f9fafb', // gray-50
                }}
            />
            <div className="flex justify-end mt-2 space-x-2">
                <button
                    type="button"
                    onClick={() => setPreview('edit')}
                    className={`px-3 py-1 text-sm rounded ${preview === 'edit'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Editar
                </button>
                <button
                    type="button"
                    onClick={() => setPreview('preview')}
                    className={`px-3 py-1 text-sm rounded ${preview === 'preview'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Vista Previa
                </button>
            </div>
        </div>
    );
}