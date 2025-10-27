'use client';

export default function AdminLayout({ children }) {
    // Layout general para /admin
    // Este es el layout raíz que envuelve tanto (auth) como (protected)
    // No aplica protección aquí - cada route group tiene su propio layout
    return children;
}
