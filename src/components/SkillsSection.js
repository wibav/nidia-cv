"use client";
import { useLanguage } from '../contexts/LanguageContext';
import { education, softwareSkills, personalSkills, languages, certifications } from '../data/cvData';

export function SkillsSection() {
    const { language, t } = useLanguage();

    return (
        <section id="education" className="px-6 py-10">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Educación */}
                <div>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t('education')}</h2>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-200">
                            {language === 'es' ? education.degree :
                                language === 'pt' ? 'Licenciatura em Arquitetura' :
                                    'Bachelor\'s Degree in Architecture'}
                        </h3>
                        <p className="text-gray-300">{education.institution}</p>
                        <p className="text-gray-400 text-sm">{education.period}</p>
                    </div>
                </div>

                {/* Software y Habilidades */}
                <div>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">{t('software')}</h2>
                    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                        <div>
                            <h4 className="text-purple-200 font-medium mb-3">Software</h4>
                            <div className="space-y-3">
                                {softwareSkills.map((skill, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">{skill.name}</span>
                                            <span className="text-gray-400 text-xs">
                                                {t(skill.label)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-purple-200 font-medium mb-2">{t('skills')}</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                {personalSkills.map((skill, index) => (
                                    <li key={index}>• {
                                        language === 'es' ? skill :
                                            language === 'pt' ? (
                                                skill === 'Creatividad' ? 'Criatividade' :
                                                    skill === 'Atención a los detalles' ? 'Atenção aos detalhes' :
                                                        skill === 'Trabajo en equipo' ? 'Trabalho em equipa' :
                                                            skill === 'Capacidad de colaboración' ? 'Capacidade de colaboração' :
                                                                skill === 'Mentalidad de crecimiento' ? 'Mentalidade de crescimento' :
                                                                    skill
                                            ) :
                                                (
                                                    skill === 'Creatividad' ? 'Creativity' :
                                                        skill === 'Atención a los detalles' ? 'Attention to detail' :
                                                            skill === 'Trabajo en equipo' ? 'Teamwork' :
                                                                skill === 'Capacidad de colaboración' ? 'Collaboration skills' :
                                                                    skill === 'Mentalidad de crecimiento' ? 'Growth mindset' :
                                                                        skill
                                                )
                                    }</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-purple-200 font-medium mb-2">{t('languages')}</h4>
                            <div className="flex gap-4 text-sm">
                                {languages.map((lang, index) => (
                                    <span key={index} className="text-gray-300">
                                        {language === 'es' ? lang.name :
                                            language === 'pt' ? (
                                                lang.name === 'Español' ? 'Espanhol' :
                                                    lang.name === 'Portugués' ? 'Português' :
                                                        lang.name
                                            ) :
                                                lang.name
                                        }: {
                                            language === 'es' ? lang.level :
                                                language === 'pt' ? (lang.level === 'Nativo' ? 'Nativo' : lang.level) :
                                                    (lang.level === 'Nativo' ? 'Native' : lang.level)
                                        }
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}