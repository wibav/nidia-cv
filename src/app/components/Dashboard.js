"use client";
import { useRef, useState } from "react";
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
    const [language, setLanguage] = useState('es');
    const [selectedProject, setSelectedProject] = useState(null);

    const translations = {
        es: {
            name: "Nidia Nahas Alfonzo",
            title: "Arquitecto. Delineante técnico en AutoCAD/Modelador BIM",
            location: "Porto, Portugal | +351 963 795 269",
            objective: "Objetivo Profesional",
            objectiveText: "Arquitecto con 8 años de experiencia, incluidos 5 en dibujo técnico para el sector sanitario (hidráulico). He participado en proyectos residenciales, comerciales, industriales y hospitalarios, ofreciendo soluciones funcionales y sostenibles. Manejo AutoCAD, Revit (BIM) y SketchUp para modelado 3D, visualización y presentación de proyectos. Destaco por mi capacidad para interpretar planos, elaborar documentación técnica y coordinar con equipos interdisciplinarios. Me motiva la búsqueda continua de la mejora continua en cada proyecto, aportando una perspectiva crítica y centrada a cualquier etapa del proceso de diseño.",
            experience: "Experiencia Profesional",
            portfolio: "Portafolio",
            demo3d: "Demo 3D",
            education: "Educación",
            software: "Software & Habilidades",
            certifications: "Certificaciones y Cursos",
            languages: "Idiomas",
            skills: "Habilidades",
            // Experiencia profesional
            job1Title: "Técnico BIM/CAD - Proyectos de Ingeniería Hidráulica",
            job1Company: "CMG INGENIERIA SpA",
            job1Period: "Junio 2019 - Actualidad | Remoto / Santiago de Chile",
            job1Tools: "Herramientas: AutoCAD 2D y Revit MEP",
            job1Tasks: [
                "Desarrollo proyectos sanitarios Hidráulico y de Saneamiento también pavimentación",
                "Diseño y desarrollo de soluciones de ingeniería sanitaria cumpliendo normativa chilena (NCh)",
                "Diseño de sistemas de aguas pluviales, captación, conducción y regulación",
                "Diseño de pavimentos para urbanización de sectores públicos y privados",
                "Diseño de accesos vehiculares con aprobación de SERVIU y/o MOP"
            ],
            job2Title: "Dibujante Técnico CAD / Proyectos Arquitectónicos",
            job2Company: "Forma e Desforma Ltda",
            job2Period: "Noviembre 2018 - Mayo 2019 | Santiago de Chile",
            job2Tools: "Herramientas: AutoCAD 2D y Microsoft Office",
            job2Tasks: [
                "Desarrollo de proyectos de vivienda multifamiliar y social",
                "Diseño de viviendas multifamiliares y elaboración de catálogos de materiales",
                "Levantamiento y evaluación de expedientes técnicos para subsidios habitacionales"
            ],
            job3Title: "Dibujante Técnico CAD / Proyectos Arquitectónicos",
            job3Company: "PUKY Company C.A",
            job3Period: "Junio 2017 - Septiembre 2018 | Venezuela",
            job3Tools: "Herramientas: AutoCAD 2D, SketchUP y Microsoft Office",
            job3Tasks: [
                "Diseño arquitectónico de posada turística con 15 habitaciones y 2 locales comerciales",
                "Diseño interior en remodelación de habitaciones del Hotel María Luiza",
                "Remodelación de fachada en vivienda unifamiliar"
            ],
            job4Title: "Asistente de Ingeniería",
            job4Company: "Servicios Vientomar C.A",
            job4Period: "Junio 2017 - Septiembre 2018 | Venezuela",
            job4Tools: "Herramientas: AutoCAD 2D y Microsoft Office",
            job4Tasks: [
                "Participación en fase de ejecución de centro comercial",
                "Actualización de proyectos sanitarios del centro comercial",
                "Apoyo en gestión de Trámites Municipales"
            ]
        },
        pt: {
            name: "Nidia Nahas Alfonzo",
            title: "Arquiteto. Desenhador técnico em AutoCAD/Modelador BIM",
            location: "Porto, Portugal | +351 963 795 269",
            objective: "Objetivo Profissional",
            objectiveText: "Arquiteto com 8 anos de experiência, incluindo 5 em desenho técnico para o setor sanitário (hidráulico). Participei em projetos residenciais, comerciais, industriais e hospitalares, oferecendo soluções funcionais e sustentáveis. Domino AutoCAD, Revit (BIM) e SketchUp para modelagem 3D, visualização e apresentação de projetos. Destaco-me pela capacidade de interpretar plantas, elaborar documentação técnica e coordenar com equipas interdisciplinares. Motiva-me a busca contínua pela melhoria contínua em cada projeto, contribuindo com uma perspetiva crítica e focada em qualquer etapa do processo de design.",
            experience: "Experiência Profissional",
            portfolio: "Portfólio",
            demo3d: "Demo 3D",
            education: "Educação",
            software: "Software & Competências",
            certifications: "Certificações e Cursos",
            languages: "Idiomas",
            skills: "Competências",
            // Experiência profissional
            job1Title: "Técnico BIM/CAD - Projetos de Engenharia Hidráulica",
            job1Company: "CMG INGENIERIA SpA",
            job1Period: "Junho 2019 - Atualidade | Remoto / Santiago do Chile",
            job1Tools: "Ferramentas: AutoCAD 2D e Revit MEP",
            job1Tasks: [
                "Desenvolvimento de projetos sanitários Hidráulicos e de Saneamento também pavimentação",
                "Design e desenvolvimento de soluções de engenharia sanitária cumprindo normativa chilena (NCh)",
                "Design de sistemas de águas pluviais, captação, condução e regulação",
                "Design de pavimentos para urbanização de setores públicos e privados",
                "Design de acessos veiculares com aprovação de SERVIU e/ou MOP"
            ],
            job2Title: "Desenhador Técnico CAD / Projetos Arquitetónicos",
            job2Company: "Forma e Desforma Ltda",
            job2Period: "Novembro 2018 - Maio 2019 | Santiago do Chile",
            job2Tools: "Ferramentas: AutoCAD 2D e Microsoft Office",
            job2Tasks: [
                "Desenvolvimento de projetos de habitação multifamiliar e social",
                "Design de habitações multifamiliares e elaboração de catálogos de materiais",
                "Levantamento e avaliação de processos técnicos para subsídios habitacionais"
            ],
            job3Title: "Desenhador Técnico CAD / Projetos Arquitetónicos",
            job3Company: "PUKY Company C.A",
            job3Period: "Junho 2017 - Setembro 2018 | Venezuela",
            job3Tools: "Ferramentas: AutoCAD 2D, SketchUP e Microsoft Office",
            job3Tasks: [
                "Design arquitetónico de pousada turística com 15 quartos e 2 lojas comerciais",
                "Design interior na remodelação de quartos do Hotel María Luiza",
                "Remodelação de fachada em habitação unifamiliar"
            ],
            job4Title: "Assistente de Engenharia",
            job4Company: "Servicios Vientomar C.A",
            job4Period: "Junho 2017 - Setembro 2018 | Venezuela",
            job4Tools: "Ferramentas: AutoCAD 2D e Microsoft Office",
            job4Tasks: [
                "Participação na fase de execução de centro comercial",
                "Atualização de projetos sanitários do centro comercial",
                "Apoio na gestão de Trâmites Municipais"
            ]
        },
        en: {
            name: "Nidia Nahas Alfonzo",
            title: "Architect. Technical Draftsperson in AutoCAD/BIM Modeler",
            location: "Porto, Portugal | +351 963 795 269",
            objective: "Professional Objective",
            objectiveText: "Architect with 8 years of experience, including 5 in technical drawing for the sanitary sector (hydraulic). I have participated in residential, commercial, industrial and hospital projects, offering functional and sustainable solutions. I handle AutoCAD, Revit (BIM) and SketchUp for 3D modeling, visualization and project presentation. I stand out for my ability to interpret plans, develop technical documentation and coordinate with interdisciplinary teams. I am motivated by the continuous search for continuous improvement in each project, contributing a critical and focused perspective to any stage of the design process.",
            experience: "Professional Experience",
            portfolio: "Portfolio",
            demo3d: "3D Demo",
            education: "Education",
            software: "Software & Skills",
            certifications: "Certifications and Courses",
            languages: "Languages",
            skills: "Skills",
            // Professional experience
            job1Title: "BIM/CAD Technician - Hydraulic Engineering Projects",
            job1Company: "CMG INGENIERIA SpA",
            job1Period: "June 2019 - Present | Remote / Santiago, Chile",
            job1Tools: "Tools: AutoCAD 2D and Revit MEP",
            job1Tasks: [
                "Development of hydraulic sanitary and sewerage projects as well as paving",
                "Design and development of sanitary engineering solutions complying with Chilean regulations (NCh)",
                "Design of rainwater systems, including capture, conduction and regulation",
                "Design of pavements for urbanization of public and private sectors",
                "Design of vehicular access with SERVIU and/or MOP approval"
            ],
            job2Title: "CAD Technical Draftsperson / Architectural Projects",
            job2Company: "Forma e Desforma Ltda",
            job2Period: "November 2018 - May 2019 | Santiago, Chile",
            job2Tools: "Tools: AutoCAD 2D and Microsoft Office",
            job2Tasks: [
                "Development of multifamily and social housing projects",
                "Design of multifamily housing and preparation of material catalogs",
                "Survey and evaluation of technical files for state housing subsidies"
            ],
            job3Title: "CAD Technical Draftsperson / Architectural Projects",
            job3Company: "PUKY Company C.A",
            job3Period: "June 2017 - September 2018 | Venezuela",
            job3Tools: "Tools: AutoCAD 2D, SketchUP and Microsoft Office",
            job3Tasks: [
                "Architectural design of tourist inn with 15 rooms and 2 commercial premises",
                "Interior design in remodeling of Hotel María Luiza rooms",
                "Facade remodeling in single-family housing"
            ],
            job4Title: "Engineering Assistant",
            job4Company: "Servicios Vientomar C.A",
            job4Period: "June 2017 - September 2018 | Venezuela",
            job4Tools: "Tools: AutoCAD 2D and Microsoft Office",
            job4Tasks: [
                "Participation in shopping center execution phase",
                "Update of shopping center sanitary projects",
                "Support in Municipal Procedures management"
            ]
        }
    };

    const t = translations[language];

    const projects = [
        {
            src: "/Proyectos/Vista.jpg",
            title: language === 'es' ? "Vivienda Multifamiliar" :
                language === 'pt' ? "Habitação Multifamiliar" :
                    "Multifamily Housing",
            isMainProject: true,
            gallery: [
                "/Proyectos/Vista.jpg",
                "/Proyectos/Corte1.jpg",
                "/Proyectos/Corte2.jpg",
                "/Proyectos/Corte3.jpg"
            ]
        },
        { src: "/portfolio/posada-turistica.jpg", title: "Posada Turística - 15 Habitaciones" },
        { src: "/portfolio/hotel-maria-luiza.jpg", title: "Remodelación Hotel María Luiza" },
        { src: "/portfolio/centro-comercial.jpg", title: "Centro Comercial - Fase Ejecución" },
        { src: "/portfolio/sistemas-hidraulicos.jpg", title: "Sistemas Hidráulicos y Saneamiento" },
        { src: "/portfolio/pavimentacion.jpg", title: "Proyectos de Pavimentación" },
    ];

    // Información estática del perfil

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Language Selector */}
            <div className="fixed top-4 right-4 z-50">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-gray-100 border border-purple-400 rounded px-3 py-1 text-sm"
                >
                    <option value="es">🇪🇸 Español</option>
                    <option value="pt">🇵🇹 Português</option>
                    <option value="en">🇺🇸 English</option>
                </select>
            </div>

            {/* Header */}
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-purple-400">{t.name}</h1>
                <p className="text-purple-200 mt-2">{t.title}</p>
                <div className="mt-4 text-gray-300">
                    <p>{t.location}</p>
                    <p>Nidianhs@gmail.com</p>
                    <a
                        href="https://www.linkedin.com/in/nidia-nahas/"
                        className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                    </a>
                </div>
            </header>

            {/* Sobre mí */}
            <section id="about" className="px-6 py-10 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t.objective}</h2>
                <p className="text-gray-300 leading-relaxed">
                    {t.objectiveText}
                </p>
            </section>

            {/* Experiencia */}
            <section id="experience" className="px-6 py-10 bg-gray-800">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold text-purple-300 mb-6">{t.experience}</h2>

                    <div className="space-y-6">
                        <div className="border-l-4 border-purple-400 pl-6">
                            <h3 className="text-xl font-semibold text-purple-300">{t.job1Title}</h3>
                            <p className="text-purple-200 font-medium">{t.job1Company}</p>
                            <p className="text-gray-400 text-sm">{t.job1Period}</p>
                            <p className="text-gray-300 mt-2 mb-2">{t.job1Tools}</p>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                {t.job1Tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-l-4 border-purple-400 pl-6">
                            <h3 className="text-xl font-semibold text-purple-300">{t.job2Title}</h3>
                            <p className="text-purple-200 font-medium">{t.job2Company}</p>
                            <p className="text-gray-400 text-sm">{t.job2Period}</p>
                            <p className="text-gray-300 mt-2 mb-2">{t.job2Tools}</p>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                {t.job2Tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-l-4 border-purple-400 pl-6">
                            <h3 className="text-xl font-semibold text-purple-300">{t.job3Title}</h3>
                            <p className="text-purple-200 font-medium">{t.job3Company}</p>
                            <p className="text-gray-400 text-sm">{t.job3Period}</p>
                            <p className="text-gray-300 mt-2 mb-2">{t.job3Tools}</p>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                {t.job3Tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-l-4 border-purple-400 pl-6">
                            <h3 className="text-xl font-semibold text-purple-300">{t.job4Title}</h3>
                            <p className="text-purple-200 font-medium">{t.job4Company}</p>
                            <p className="text-gray-400 text-sm">{t.job4Period}</p>
                            <p className="text-gray-300 mt-2 mb-2">{t.job4Tools}</p>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                {t.job4Tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portafolio */}
            <section id="portfolio" className="px-6 py-10">
                <h2 className="text-2xl font-semibold text-purple-300 mb-8 text-center">
                    {t.portfolio}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-105"
                            onClick={() => project.isMainProject ? setSelectedProject(project) : null}
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
                                {project.isMainProject && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        {language === 'es' ? 'Ver galería completa' :
                                            language === 'pt' ? 'Ver galeria completa' :
                                                'View complete gallery'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de Galería */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-purple-300">
                                        {selectedProject.title}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="text-gray-400 hover:text-white text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedProject.gallery.map((imgSrc, imgIndex) => (
                                        <div key={imgIndex} className="bg-gray-700 rounded-lg overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={`${selectedProject.title} - ${imgIndex + 1}`}
                                                className="w-full h-64 object-contain"
                                            />
                                            <div className="p-3">
                                                <p className="text-gray-300 text-sm">
                                                    {imgIndex === 0 ?
                                                        (language === 'es' ? 'Vista Principal' :
                                                            language === 'pt' ? 'Vista Principal' :
                                                                'Main View') :
                                                        `${language === 'es' ? 'Corte' :
                                                            language === 'pt' ? 'Corte' :
                                                                'Section'} ${imgIndex}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Sección Demo 3D */}
            <section id="renders3d" className="px-6 py-10 bg-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4 text-center">
                    {t.demo3d}
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

            {/* Educación y Habilidades */}
            <section id="education" className="px-6 py-10">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Educación */}
                    <div>
                        <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t.education}</h2>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-200">
                                {language === 'es' ? 'Licenciatura en Arquitectura' :
                                    language === 'pt' ? 'Licenciatura em Arquitetura' :
                                        'Bachelor\'s Degree in Architecture'}
                            </h3>
                            <p className="text-gray-300">Instituto Politécnico Santiago Mariño</p>
                            <p className="text-gray-400 text-sm">2011 - 2017</p>
                        </div>
                    </div>

                    {/* Software y Habilidades */}
                    <div>
                        <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t.software}</h2>
                        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                            <div>
                                <h4 className="text-purple-200 font-medium mb-3">Software</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">Revit</span>
                                            <span className="text-gray-400 text-xs">
                                                {language === 'es' ? 'Intermedio' : language === 'pt' ? 'Intermédio' : 'Intermediate'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">AutoCAD</span>
                                            <span className="text-gray-400 text-xs">
                                                {language === 'es' ? 'Intermedio' : language === 'pt' ? 'Intermédio' : 'Intermediate'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">SketchUp</span>
                                            <span className="text-gray-400 text-xs">
                                                {language === 'es' ? 'Intermedio' : language === 'pt' ? 'Intermédio' : 'Intermediate'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">Microsoft Office</span>
                                            <span className="text-gray-400 text-xs">
                                                {language === 'es' ? 'Intermedio' : language === 'pt' ? 'Intermédio' : 'Intermediate'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-purple-200 font-medium mb-2">{t.skills}</h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    <li>• {language === 'es' ? 'Creatividad' : language === 'pt' ? 'Criatividade' : 'Creativity'}</li>
                                    <li>• {language === 'es' ? 'Atención a los detalles' : language === 'pt' ? 'Atenção aos detalhes' : 'Attention to detail'}</li>
                                    <li>• {language === 'es' ? 'Trabajo en equipo' : language === 'pt' ? 'Trabalho em equipa' : 'Teamwork'}</li>
                                    <li>• {language === 'es' ? 'Capacidad de colaboración' : language === 'pt' ? 'Capacidade de colaboração' : 'Collaboration skills'}</li>
                                    <li>• {language === 'es' ? 'Mentalidad de crecimiento' : language === 'pt' ? 'Mentalidade de crescimento' : 'Growth mindset'}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-purple-200 font-medium mb-2">{t.languages}</h4>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-gray-300">
                                        {language === 'es' ? 'Español: Nativo' : language === 'pt' ? 'Espanhol: Nativo' : 'Spanish: Native'}
                                    </span>
                                    <span className="text-gray-300">
                                        {language === 'es' ? 'Portugués: B1' : language === 'pt' ? 'Português: B1' : 'Portuguese: B1'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certificaciones */}
            <section id="certifications" className="px-6 py-10 bg-gray-800">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold text-purple-300 mb-6">{t.certifications}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-purple-200 font-semibold">Autodesk Revit MEP</h3>
                            <p className="text-gray-300 text-sm">iBIM ATC Autodesk | {language === 'es' ? 'Diciembre' : language === 'pt' ? 'Dezembro' : 'December'} 2024</p>
                            <p className="text-gray-400 text-xs">Certificate N°: AM101862098090965523024</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-purple-200 font-semibold">
                                {language === 'es' ? 'Autodesk Revit Arquitectura' :
                                    language === 'pt' ? 'Autodesk Revit Arquitetura' :
                                        'Autodesk Revit Architecture'}
                            </h3>
                            <p className="text-gray-300 text-sm">iBIM ATC Autodesk | {language === 'es' ? 'Marzo' : language === 'pt' ? 'Março' : 'March'} 2025</p>
                            <p className="text-gray-400 text-xs">Certificate N°: AM101862098235525523024</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-purple-200 font-semibold">SketchUp Pro</h3>
                            <p className="text-gray-300 text-sm">Udemy | {language === 'es' ? 'Febrero' : language === 'pt' ? 'Fevereiro' : 'February'} 2022</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-purple-200 font-semibold">
                                {language === 'es' ? 'Creación de proyectos de Interiorismo' :
                                    language === 'pt' ? 'Criação de projetos de Design de Interiores' :
                                        'Interior Design Project Creation'}
                            </h3>
                            <p className="text-gray-300 text-sm">Domestika | {language === 'es' ? 'Agosto' : language === 'pt' ? 'Agosto' : 'August'} 2023</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}