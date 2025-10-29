"use client";
import { Header } from '../../components/Header';
import { ObjectiveSection } from '../../components/ObjectiveSection';
import { ExperienceSection } from '../../components/ExperienceSection';
import { PortfolioSection } from '../../components/PortfolioSection';
import { Demo3DSection } from '../../components/Demo3DSection';
import { SkillsSection } from '../../components/SkillsSection';
import { CertificationsSection } from '../../components/CertificationsSection';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header />
            <ObjectiveSection />
            <ExperienceSection />
            <PortfolioSection />
            <Demo3DSection />
            <SkillsSection />
            <CertificationsSection />
        </div>
    );
}