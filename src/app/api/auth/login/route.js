import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { token } = await request.json();

        // Validación básica
        if (!token) {
            return NextResponse.json(
                { message: 'Token es requerido' },
                { status: 400 }
            );
        }

        // Configurar cookie con el token de Firebase
        const cookieStore = cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, // 24 horas
            path: '/'
        });

        return NextResponse.json({
            message: 'Login exitoso'
        });

    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}