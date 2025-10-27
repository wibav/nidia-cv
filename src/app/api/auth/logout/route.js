import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Eliminar la cookie de autenticación
        const cookieStore = cookies();
        cookieStore.delete('admin_token');

        return NextResponse.json({
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}