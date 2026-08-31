import CustomerFeedback from '@/components/homepage/customerfeedback/feedback';
import FinalCTA from '@/components/homepage/fnalcta/finalcta';
import FAQSection from '@/components/FAQ/FAQ';
import Hero from '@/components/homepage/hero/Hero';
import ManagementShowcase from '@/components/homepage/managementshowcase/manage';
import ManagementSolutions from '@/components/homepage/managementsolution/managementsolution';
import StudentSuccess from '@/components/homepage/studentsuccess/studentsuccess';
import ThreeSteps from '@/components/homepage/threesteps/threesteps';
import React from 'react';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Hero />
            <ManagementSolutions />
            <StudentSuccess />
            <ManagementShowcase />
            <ThreeSteps />
            <CustomerFeedback />
            <FAQSection />
            <FinalCTA />
        </main>
    );
}
