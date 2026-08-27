import CustomerFeedback from '@/components/homepage/customerfeedback/feedback';
import FinalCTA from '@/components/homepage/fnalcta/finalcta';
import Hero from '@/components/homepage/hero/Hero';
import ManagementShowcase from '@/components/homepage/managementshowcase/manage';
import ManagementSolutions from '@/components/homepage/managementsolution/managementsolution';
import StudentSuccess from '@/components/homepage/studentsuccess/studentsuccess';
import ThreeSteps from '@/components/homepage/threesteps/threesteps';
import React from 'react';

const page = () => {
    return (
        <div>
                <Hero></Hero>
                <ManagementSolutions></ManagementSolutions>
                <StudentSuccess></StudentSuccess>
                <ManagementShowcase></ManagementShowcase>
                <ThreeSteps></ThreeSteps>
                <CustomerFeedback></CustomerFeedback>
                <FinalCTA></FinalCTA>
        </div>
    );
};

export default page;
