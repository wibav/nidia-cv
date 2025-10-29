// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required Firebase environment variables:', missingEnvVars);
    console.error('Please configure these variables in Firebase Hosting console or .env.local file');

    // En producción, crear una configuración de respaldo o mostrar error
    if (typeof window !== 'undefined') {
        // Solo mostrar error en el navegador, no en el servidor
        console.error('Firebase configuration incomplete. Some features may not work.');
    }
}

// Initialize Firebase with error handling
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    if (typeof window !== 'undefined') {
        // En el navegador, mostrar un error más amigable
        console.error('Firebase initialization failed. Please check your configuration.');
    }
    // Crear una app dummy para evitar crashes
    app = initializeApp({
        apiKey: "demo-key",
        authDomain: "demo.firebaseapp.com",
        projectId: "demo-project"
    }, 'fallback-app');
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;