import type { Metadata } from "next";
import TalkToUs from "@/components/TalkToUs/TalkToUs";

export const metadata: Metadata = {
    title: "Contact Us | EduNexus - Get in Touch",
    description:
        "Have questions or need support? Contact the EduNexus team for institutional onboarding, product demos, or technical support.",
    keywords: [
        "Contact EduNexus",
        "School Management Support",
        "EdTech Help",
        "EduNexus Sales & Demo",
    ],
};

const ContactPage = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100">
            <TalkToUs />
        </main>
    );
};

export default ContactPage;