"use client";
import { Header } from '../../components/Header';
import { ObjectiveSection } from '../../components/ObjectiveSection';
import { ExperienceSection } from '../../components/ExperienceSection';
import { PortfolioSection } from '../../components/PortfolioSection';
import { Demo3DSection } from '../../components/Demo3DSection';
import { SkillsSection } from '../../components/SkillsSection';
import { CertificationsSection } from '../../components/CertificationsSection';
import { useTheme } from '../../contexts/ThemeContext';

export default function Dashboard() {
    const { theme, loading } = useTheme();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: theme.backgroundColor }} className="min-h-screen text-gray-100">
            <Header />
            <ObjectiveSection />
            <ExperienceSection />
            <PortfolioSection />
            {/* <Demo3DSection /> */}
            <SkillsSection />
            <CertificationsSection />
        </div>
    );
}