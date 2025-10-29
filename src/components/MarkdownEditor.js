'use client';

import { useRef } from 'react';

export default function MarkdownEditor({ value, onChange, placeholder = "Escribe aquí..." }) {
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const applyFormat = (format) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const beforeText = value.substring(0, start);
        const afterText = value.substring(end);

        let newText = value;
        let newCursorPos = start;

        switch (format) {
            case 'bold':
                newText = beforeText + `**${selectedText}**` + afterText;
                newCursorPos = start + 2;
                break;
            case 'italic':
                newText = beforeText + `*${selectedText}*` + afterText;
                newCursorPos = start + 1;
                break;
            case 'underline':
                newText = beforeText + `<u>${selectedText}</u>` + afterText;
                newCursorPos = start + 3;
                break;
            case 'strikethrough':
                newText = beforeText + `~~${selectedText}~~` + afterText;
                newCursorPos = start + 2;
                break;
            case 'h1':
                newText = beforeText + `\n# ${selectedText}\n` + afterText;
                newCursorPos = start + 3;
                break;
            case 'h2':
                newText = beforeText + `\n## ${selectedText}\n` + afterText;
                newCursorPos = start + 4;
                break;
            case 'h3':
                newText = beforeText + `\n### ${selectedText}\n` + afterText;
                newCursorPos = start + 5;
                break;
            case 'ul':
                newText = beforeText + `\n- ${selectedText}\n` + afterText;
                newCursorPos = start + 3;
                break;
            case 'ol':
                newText = beforeText + `\n1. ${selectedText}\n` + afterText;
                newCursorPos = start + 4;
                break;
            case 'blockquote':
                newText = beforeText + `\n> ${selectedText}\n` + afterText;
                newCursorPos = start + 3;
                break;
            default:
                break;
        }

        onChange(newText);

        setTimeout(() => {
            textarea.selectionStart = newCursorPos;
            textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }, 0);
    };

    return (
        <div className="w-full">
            <style jsx global>{`
                .markdown-textarea {
                    background-color: #1f2937 !important;
                    color: #f9fafb !important;
                    border: 1px solid #4b5563 !important;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
                    font-size: 14px !important;
                    line-height: 1.5 !important;
                    padding: 12px !important;
                    min-height: 120px !important;
                    resize: vertical !important;
                    border-radius: 0 0 8px 8px !important;
                }
                .markdown-textarea:focus {
                    outline: none !important;
                    border-color: #7c3aed !important;
                    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
                }
                .markdown-textarea::placeholder {
                    color: #6b7280 !important;
                }
            `}</style>

            <div className="w-full border border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-800 border-b border-gray-600 p-2 flex flex-wrap gap-1">
                    <button
                        type="button"
                        onClick={() => applyFormat('bold')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Negrita (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('italic')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Itálica (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('underline')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Subrayado (Ctrl+U)"
                    >
                        <u>U</u>
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('strikethrough')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Tachado"
                    >
                        <s>S</s>
                    </button>

                    <div className="w-px bg-gray-600"></div>

                    <button
                        type="button"
                        onClick={() => applyFormat('h1')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Título 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('h2')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Título 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('h3')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Título 3"
                    >
                        H3
                    </button>

                    <div className="w-px bg-gray-600"></div>

                    <button
                        type="button"
                        onClick={() => applyFormat('ul')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Lista desordenada"
                    >
                        • Lista
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('ol')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Lista ordenada"
                    >
                        1. Lista
                    </button>
                    <button
                        type="button"
                        onClick={() => applyFormat('blockquote')}
                        className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Cita"
                    >
                        &quot; Cita
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="markdown-textarea w-full"
                />
            </div>

            <div className="mt-3 text-xs text-gray-400">
                ✓ Editor de texto: Usa **negrita**, *itálica*, ~~tachado~~, # Títulos, - listas, &gt; citas
            </div>
        </div>
    );
}