"use client";
import { useLanguage } from '../contexts/LanguageContext';

export function ObjectiveSection() {
    const { t } = useLanguage();

    return (
        <section id="about" className="px-6 py-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t('objective')}</h2>
            <p className="text-gray-300 leading-relaxed">
                {t('objectiveText')}
            </p>
        </section>
    );
}