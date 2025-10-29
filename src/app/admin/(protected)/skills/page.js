'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function SkillsAdminPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        'BIM Software',
        'CAD Software',
        'Modelado 3D',
        'Render & Visualización',
        'Gestión de Proyectos',
        'Diseño Urbano',
        'Software de Oficina'
    ];

    const proficiencyLabels = {
        1: 'Principiante',
        2: 'Básico',
        3: 'Intermedio',
        4: 'Avanzado',
        5: 'Experto'
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const skillsQuery = query(collection(db, 'skills'), orderBy('order', 'asc'));
            const snapshot = await getDocs(skillsQuery);
            const skillsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSkills(skillsData);
        } catch (error) {
            console.error('Error obteniendo skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
            return;
        }

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'skills', id));
            setSkills(skills.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error eliminando skill:', error);
            alert('Error al eliminar la habilidad');
        } finally {
            setDeleting(null);
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) return;
        if (source.index === destination.index) return;

        const newSkills = Array.from(skills);
        const draggedSkill = newSkills[source.index];
        newSkills.splice(source.index, 1);
        newSkills.splice(destination.index, 0, draggedSkill);

        setSkills(newSkills);

        // Actualizar orden en Firestore
        try {
            for (let i = 0; i < newSkills.length; i++) {
                const skillRef = doc(db, 'skills', newSkills[i].id);
                await updateDoc(skillRef, { order: i });
            }
        } catch (error) {
            console.error('Error actualizando orden:', error);
            fetchSkills(); // Revertir en caso de error
        }
    };

    // Filtrar skills
    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin"
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            ← Volver al Panel
                        </Link>
                        <span className="text-gray-400">|</span>
                        <h1 className="text-3xl font-bold">Habilidades Técnicas Arquitectónicas</h1>
                    </div>
                    <Link
                        href="/admin/skills/new"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        + Nueva Habilidad
                    </Link>
                </div>
                <p className="text-gray-400">
                    {filteredSkills.length} habilidad{filteredSkills.length !== 1 ? 's' : ''} registrada{filteredSkills.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <input
                        type="text"
                        placeholder="Buscar habilidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredSkills.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                    <p className="text-gray-400 mb-4">No hay habilidades registradas</p>
                    <Link
                        href="/admin/skills/new"
                        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Agregar primera habilidad
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="skills-list">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`${snapshot.isDraggingOver ? 'bg-gray-700' : ''}`}
                                >
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700 bg-gray-700">
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Orden</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Software</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Categoría</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Proficiency</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Años</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSkills.map((skill, index) => (
                                                <Draggable key={skill.id} draggableId={skill.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${snapshot.isDragging ? 'bg-purple-900' : ''}`}
                                                        >
                                                            <td className="px-6 py-4 text-gray-300 cursor-move">
                                                                <span className="text-gray-500">⋮⋮</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-300 font-medium">{skill.name}</td>
                                                            <td className="px-6 py-4 text-gray-400">{skill.category}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex gap-1">
                                                                        {[1, 2, 3, 4, 5].map(star => (
                                                                            <span
                                                                                key={star}
                                                                                className={`text-lg ${star <= skill.proficiency ? 'text-yellow-400' : 'text-gray-600'}`}
                                                                            >
                                                                                ★
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">{proficiencyLabels[skill.proficiency]}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-300">{skill.yearsOfExperience}</td>
                                                            <td className="px-6 py-4 flex gap-2">
                                                                <Link
                                                                    href={`/admin/skills/new?id=${skill.id}`}
                                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(skill.id)}
                                                                    disabled={deleting === skill.id}
                                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                                >
                                                                    {deleting === skill.id ? 'Borrando...' : 'Eliminar'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </tbody>
                                    </table>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
}
