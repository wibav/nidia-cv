"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function BoxDemo() {
    const mesh = useRef();
    useFrame((state, delta) => (mesh.current.rotation.y += delta));
    return (
        <mesh ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9d4edd" />
        </mesh>
    );
}

export default function Dashboard() {
    const projects = [
        { src: "/portfolio/proyecto1.jpg", title: "Diseño Residencial" },
        { src: "/portfolio/proyecto2.jpg", title: "Espacio Comercial 3D" },
        { src: "/portfolio/proyecto3.jpg", title: "Renovación Urbana" },
    ];

    // Información estática del perfil

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-purple-400">Nombre Arquitecta</h1>
                <p className="text-purple-200 mt-2">Arquitecta | Especialista en Diseño 3D</p>
            </header>

            {/* Sobre mí */}
            <section id="about" className="px-6 py-10 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">Sobre mí</h2>
                <p className="text-gray-300">
                    Arquitecta con amplia experiencia en diseño sostenible y modelado 3D...
                </p>
            </section>

            {/* Experiencia */}
            <section id="experience" className="px-6 py-10 bg-gray-800">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">Experiencia</h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li><strong>Estudio XYZ</strong> - Arquitecta Senior (2020 - Presente)</li>
                        <li><strong>Consultora ABC</strong> - Arquitecta (2016 - 2020)</li>
                        {/* Más experiencia */}
                    </ul>
                </div>
            </section>

            {/* Portafolio */}
            <section id="portfolio" className="px-6 py-10">
                <h2 className="text-2xl font-semibold text-purple-300 mb-8 text-center">
                    Portafolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                        >
                            <img
                                src={project.src}
                                alt={project.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-purple-300">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección Demo 3D */}
            <section id="renders3d" className="px-6 py-10 bg-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4 text-center">
                    Demo 3D
                </h2>
                <div className="w-full h-64 max-w-lg mx-auto">
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[2, 5, 2]} intensity={1} />
                        <BoxDemo />
                        <OrbitControls />
                    </Canvas>
                </div>
            </section>
        </div>
    );
}