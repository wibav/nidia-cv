"use client";
import { useLanguage } from '../contexts/LanguageContext';

export function ExperienceSection() {
    const { t } = useLanguage();

    const experiences = [
        {
            title: t('job1Title'),
            company: t('job1Company'),
            period: t('job1Period'),
            tools: t('job1Tools'),
            tasks: t('job1Tasks')
        },
        {
            title: t('job2Title'),
            company: t('job2Company'),
            period: t('job2Period'),
            tools: t('job2Tools'),
            tasks: t('job2Tasks')
        },
        {
            title: t('job3Title'),
            company: t('job3Company'),
            period: t('job3Period'),
            tools: t('job3Tools'),
            tasks: t('job3Tasks')
        },
        {
            title: t('job4Title'),
            company: t('job4Company'),
            period: t('job4Period'),
            tools: t('job4Tools'),
            tasks: t('job4Tasks')
        }
    ];

    return (
        <section id="experience" className="px-6 py-10 bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">{t('experience')}</h2>

                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <div key={index} className="border-l-4 border-purple-400 pl-6">
                            <h3 className="text-xl font-semibold text-purple-300">{exp.title}</h3>
                            <p className="text-purple-200 font-medium">{exp.company}</p>
                            <p className="text-gray-400 text-sm">{exp.period}</p>
                            <p className="text-gray-300 mt-2 mb-2">{exp.tools}</p>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                {exp.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex}>• {task}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}