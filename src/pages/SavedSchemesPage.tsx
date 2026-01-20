import React from 'react';
import { useSavedSchemes } from '../contexts/SavedSchemesContext';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { useProfile } from '../contexts/ProfileContext';
import { findEligibleSchemes } from '../services/SchemeEngine';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedSchemesPage = () => {
    const { savedSchemeIds } = useSavedSchemes();
    const { profile } = useProfile();

    const savedSchemes = SCHEMES.filter(scheme => savedSchemeIds.includes(scheme.id));
    const eligibleSchemes = profile ? findEligibleSchemes(profile) : [];

    const isEligible = (schemeId: string) => {
        return eligibleSchemes.some(s => s.id === schemeId);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-xl">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Saved Schemes</h1>
                    <p className="text-slate-600">Your bookmarked government schemes.</p>
                </div>
            </div>

            {savedSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedSchemes.map(scheme => (
                        <SchemeCard
                            key={scheme.id}
                            scheme={scheme}
                            isEligible={isEligible(scheme.id)}
                            onViewDetails={() => {
                                // For now just alert or log, as modal logic is in Explore page. 
                                // Ideally SchemeDetailsModal should be global or reusable here too.
                                // We can implement a simple redirect to explore with ID or reuse modal later.
                                alert(`Viewing details for ${scheme.name}. (Modal integration pending for Saved Page)`);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No saved schemes</h3>
                    <p className="text-slate-500 mb-6">You haven't bookmarked any schemes yet.</p>
                    <Link to="/schemes" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        <Search className="w-4 h-4" />
                        Explore Schemes
                    </Link>
                </div>
            )}
        </div>
    );
};
