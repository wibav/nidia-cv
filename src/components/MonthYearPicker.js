'use client';

import { useState, useEffect } from 'react';

export default function MonthYearPicker({ value, onChange, placeholder = "Selecciona mes y año" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Inicializar desde el valor existente
    useEffect(() => {
        if (value) {
            let year, month;

            // Manejar Firestore Timestamp
            if (typeof value === 'object' && value && value.seconds) {
                const date = new Date(value.seconds * 1000);
                year = date.getFullYear();
                month = date.getMonth() + 1;
            } else if (typeof value === 'string') {
                // Validar que sea un string válido
                const parts = String(value).split('-');
                if (parts.length === 2 && /^\d{4}$/.test(parts[0]) && /^\d{2}$/.test(parts[1])) {
                    year = parseInt(parts[0]);
                    month = parseInt(parts[1]);
                } else {
                    return;
                }
            } else {
                return;
            }

            setSelectedYear(year);
            setSelectedMonth(month - 1); // Convertir a índice 0
        }
    }, [value]);

    const handleMonthSelect = (monthIndex) => {
        setSelectedMonth(monthIndex);
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleConfirm = () => {
        const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
        // Reestablecer valores si se cancela
        if (value) {
            let year, month;

            // Manejar Firestore Timestamp
            if (typeof value === 'object' && value && value.seconds) {
                const date = new Date(value.seconds * 1000);
                year = date.getFullYear();
                month = date.getMonth() + 1;
            } else if (typeof value === 'string') {
                // Validar que sea un string válido
                const parts = String(value).split('-');
                if (parts.length === 2 && /^\d{4}$/.test(parts[0]) && /^\d{2}$/.test(parts[1])) {
                    year = parseInt(parts[0]);
                    month = parseInt(parts[1]);
                } else {
                    return;
                }
            } else {
                return;
            }

            setSelectedYear(year);
            setSelectedMonth(month - 1);
        }
    };

    const displayValue = (() => {
        if (!value) return placeholder;

        let year, month;

        if (typeof value === 'object' && value && value.seconds) {
            const date = new Date(value.seconds * 1000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
        } else if (typeof value === 'string') {
            // Validar que sea un string válido
            const parts = String(value).split('-');
            if (parts.length === 2 && /^\d{4}$/.test(parts[0]) && /^\d{2}$/.test(parts[1])) {
                year = parts[0];
                month = parseInt(parts[1]);
            } else {
                return placeholder;
            }
        } else {
            return placeholder;
        }

        return `${months[month - 1]} ${year}`;
    })();

    const currentYear = new Date().getFullYear();
    const yearStart = currentYear - 50;
    const yearEnd = currentYear + 10;

    return (
        <div className="relative w-full">
            <style jsx>{`
                .month-picker-container {
                    position: relative;
                }
                .month-picker-input {
                    background-color: #374151;
                    color: #f3f4f6;
                    border: 1px solid #4b5563;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    width: 100%;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                }
                .month-picker-input:hover {
                    border-color: #7c3aed;
                }
                .month-picker-input:focus {
                    outline: none;
                    ring: 2px;
                    ring-color: #7c3aed;
                }
                .month-picker-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: #1f2937;
                    border: 1px solid #4b5563;
                    border-radius: 0.5rem;
                    margin-top: 0.5rem;
                    padding: 1rem;
                    z-index: 50;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
                }
                .year-selector {
                    margin-bottom: 1rem;
                }
                .year-selector label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #9ca3af;
                    margin-bottom: 0.5rem;
                }
                .year-selector select {
                    width: 100%;
                    padding: 0.5rem;
                    background-color: #374151;
                    color: #f3f4f6;
                    border: 1px solid #4b5563;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                }
                .month-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .month-button {
                    padding: 0.625rem;
                    background-color: #374151;
                    color: #d1d5db;
                    border: 1px solid #4b5563;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .month-button:hover {
                    background-color: #4b5563;
                    color: #f3f4f6;
                }
                .month-button.selected {
                    background-color: #7c3aed;
                    color: #ffffff;
                    border-color: #7c3aed;
                }
                .button-group {
                    display: flex;
                    gap: 0.5rem;
                }
                .button-group button {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .cancel-btn {
                    background-color: #4b5563;
                    color: #d1d5db;
                }
                .cancel-btn:hover {
                    background-color: #6b7280;
                }
                .confirm-btn {
                    background-color: #7c3aed;
                    color: #ffffff;
                }
                .confirm-btn:hover {
                    background-color: #6d28d9;
                }
            `}</style>

            <div className="month-picker-container">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="month-picker-input text-left"
                >
                    {displayValue}
                </button>

                {isOpen && (
                    <div className="month-picker-dropdown">
                        <div className="year-selector">
                            <label htmlFor="year-select">Año</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                {Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i).map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>
                                Mes
                            </label>
                            <div className="month-grid">
                                {months.map((month, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleMonthSelect(index)}
                                        className={`month-button ${selectedMonth === index ? 'selected' : ''}`}
                                    >
                                        {month.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="confirm-btn"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
