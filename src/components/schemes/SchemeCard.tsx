import React from 'react';
import type { Scheme } from '../../data/types';
import { ArrowRight, FileText, CheckCircle, ExternalLink, Heart } from 'lucide-react';
import { useSavedSchemes } from '../../contexts/SavedSchemesContext';

interface SchemeCardProps {
    scheme: Scheme;
    isEligible: boolean;
    onViewDetails: () => void;
}

export const SchemeCard = ({ scheme, isEligible, onViewDetails }: SchemeCardProps) => {
    const { isSaved, saveScheme, removeScheme } = useSavedSchemes();
    const saved = isSaved(scheme.id);

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (saved) {
            removeScheme(scheme.id);
        } else {
            saveScheme(scheme.id);
        }
    };

    return (
        <div className={`bg-white rounded-xl border ${isEligible ? 'border-primary-200 shadow-sm' : 'border-slate-100'} p-6 transition-all hover:shadow-md h-full flex flex-col relative group`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                            {scheme.ministry}
                        </span>
                        {isEligible && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Eligible
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{scheme.name}</h3>
                </div>
                <button
                    onClick={toggleSave}
                    className={`p-2 rounded-full transition-colors ${saved ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'}`}
                >
                    <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                </button>
            </div>

            <p className="text-slate-600 text-sm mb-6 flex-grow">{scheme.description}</p>

            <div className="mt-auto space-y-4">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">Benefits</h4>
                    <ul className="text-sm text-slate-700 list-disc list-inside">
                        {scheme.benefits.slice(0, 2).map((benefit, i) => (
                            <li key={i} className="truncate">{benefit}</li>
                        ))}
                    </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={onViewDetails}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                        View Details
                    </button>
                    {scheme.officialUrl && (
                        <a
                            href={scheme.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
