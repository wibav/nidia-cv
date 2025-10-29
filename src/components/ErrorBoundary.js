'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ Error Boundary caught an error:', error, errorInfo);
        // No necesitamos usar 'error' en el estado ya que lo mostramos directamente
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-3xl font-bold text-red-400 mb-4">
                                Error en la Aplicación
                            </h1>
                            <p className="text-gray-300 mb-6">
                                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left">
                            <h2 className="text-lg font-semibold mb-4 text-yellow-400">
                                Detalles del Error:
                            </h2>
                            <div className="text-sm text-gray-400 font-mono bg-gray-900 p-4 rounded overflow-auto max-h-40">
                                {this.state.error && this.state.error.toString()}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                🔄 Recargar Página
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-4"
                            >
                                ← Volver Atrás
                            </button>
                        </div>

                        <div className="mt-8 text-xs text-gray-500">
                            Si el problema persiste, contacta al administrador del sitio.
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;