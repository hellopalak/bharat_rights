import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useSchemes } from '../contexts/SchemesContext';
import { findEligibleSchemes } from '../services/SchemeEngine';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { SchemeDetailsModal } from '../components/schemes/SchemeDetailsModal';
import { VoiceSearch } from '../components/common/VoiceSearch';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import type { SchemeCategory, Scheme } from '../data/types';

export const SchemeExplore = () => {
    const { profile } = useProfile();
    const { schemes: SCHEMES, isLoading } = useSchemes();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<SchemeCategory | 'all'>('all');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEligibleOnly, setShowEligibleOnly] = useState(false);

    const eligibleSchemes = useMemo(() => {
        return profile ? findEligibleSchemes(profile, SCHEMES) : [];
    }, [profile, SCHEMES]);

    // Update showEligibleOnly default when profile loads
    useEffect(() => {
        if (profile) setShowEligibleOnly(true);
    }, [profile]);

    const filteredSchemes = useMemo(() => {
        let result = SCHEMES;

        // Filter by Eligibility
        if (showEligibleOnly && profile) {
            result = eligibleSchemes;
        }

        // Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(lower) ||
                s.description.toLowerCase().includes(lower) ||
                s.ministry.toLowerCase().includes(lower)
            );
        }

        // Filter by Category
        if (filterCategory !== 'all') {
            result = result.filter(s => s.category.includes(filterCategory));
        }

        return result;
    }, [searchTerm, filterCategory, showEligibleOnly, profile, SCHEMES, eligibleSchemes]);

    const isEligible = (schemeId: string) => {
        return eligibleSchemes.some(s => s.id === schemeId);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Explore Schemes</h1>
                    <p className="text-slate-600 mt-1">
                        {profile
                            ? `We found ${eligibleSchemes.length} schemes you are eligible for based on your profile.`
                            : "Discover government schemes for citizens."}
                    </p>
                </div>
                {!profile && (
                    <a href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">
                        Complete Profile for Eligibility Check
                        <ArrowRight className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search by name, ministry, or keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="absolute right-2 top-1">
                        <VoiceSearch onSearch={setSearchTerm} />
                    </div>
                </div>

                {profile && (
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={showEligibleOnly}
                                onChange={(e) => setShowEligibleOnly(e.target.checked)}
                                className="messageCheckbox w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <span className="text-slate-700 font-medium">Eligible Only</span>
                        </label>
                    </div>
                )}

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as any)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="all">All Categories</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                        <option value="social_welfare">Social Welfare</option>
                        <option value="housing">Housing</option>
                        <option value="employment">Employment</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            {filteredSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map(scheme => (
                        <SchemeCard
                            key={scheme.id}
                            scheme={scheme}
                            isEligible={isEligible(scheme.id)}
                            onViewDetails={() => {
                                setSelectedScheme(scheme);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No schemes found</h3>
                    <p className="text-slate-500">Try adjusting your search filters</p>
                </div>
            )}

            {selectedScheme && (
                <SchemeDetailsModal
                    scheme={selectedScheme}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isEligible={isEligible(selectedScheme.id)}
                />
            )}
        </div>
    );
};
