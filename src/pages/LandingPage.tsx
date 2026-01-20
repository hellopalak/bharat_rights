import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Zap, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 pb-32 overflow-hidden transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        <span>AI-Powered Scheme Discovery</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                        {t('hero.title').split(',')[0]},<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                            {t('hero.title').split(',')[1] || 'Claim Your Benefits'}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {t('hero.cta')}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/schemes')}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {t('hero.browse')}
                        </button>
                    </div>
                </div>

                {/* Background decorative blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-200 dark:bg-secondary-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Search className="w-6 h-6 text-primary-600" />}
                        title="Smart Discovery"
                        description="Our engine automatically maps your profile to 100+ Central and State government schemes."
                    />
                    <FeatureCard
                        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                        title="Eligibility Check"
                        description="Instantly see if you qualify for scholarships, pensions, loans, and housing schemes."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-orange-600" />}
                        title="Proactive Alerts"
                        description="Get notified immediately when new schemes are announced that match your profile."
                    />
                </div>
            </section>

            {/* Category Quick Links */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CategoryCard title="Students" emoji="🎓" category="education" onClick={() => navigate('/schemes?category=education')} />
                        <CategoryCard title="Women" emoji="👩" category="woman" onClick={() => navigate('/schemes?category=social_welfare')} />
                        <CategoryCard title="Farmers" emoji="🌾" category="agriculture" onClick={() => navigate('/schemes?category=agriculture')} />
                        <CategoryCard title="Senior Citizens" emoji="👴" category="senior_citizen" onClick={() => navigate('/schemes?category=social_welfare')} />
                        <CategoryCard title="Healthcare" emoji="🏥" category="health" onClick={() => navigate('/schemes?category=health')} />
                        <CategoryCard title="Housing" emoji="🏠" category="housing" onClick={() => navigate('/schemes?category=housing')} />
                        <CategoryCard title="Business/Loans" emoji="💼" category="finance" onClick={() => navigate('/schemes?category=finance')} />
                        <CategoryCard title="PwD" emoji="♿" category="pwd" onClick={() => navigate('/schemes?category=social_welfare')} />
                    </div>
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ title, emoji, onClick }: { title: string, emoji: string, category: string, onClick: () => void }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary-300 transition-all group">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
        <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600">{title}</div>
    </button>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
);
