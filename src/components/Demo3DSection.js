"use client";
import React, { useRef } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLanguage } from '../contexts/LanguageContext';

function BoxDemo() {
    const meshRef = useRef();

    React.useEffect(() => {
        let animationId;
        const animate = () => {
            if (meshRef.current) {
                meshRef.current.rotation.y += 0.01;
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9d4edd" />
        </mesh>
    );
}

export function Demo3DSection() {
    const { t } = useLanguage();

    return (
        <section id="renders3d" className="px-6 py-10 bg-gray-800">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4 text-center">
                {t('demo3d')}
            </h2>
            <div className="w-full h-64 max-w-lg mx-auto">
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2, 5, 2]} intensity={1} />
                    <BoxDemo />
                    <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
                </Canvas>
            </div>
        </section>
    );
}