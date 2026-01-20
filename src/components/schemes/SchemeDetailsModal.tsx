import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Scheme } from '../../data/types';
import { X, ExternalLink, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

import { useApplications } from '../../contexts/ApplicationContext';

interface SchemeDetailsModalProps {
    scheme: Scheme;
    isOpen: boolean;
    onClose: () => void;
    isEligible: boolean;
}

export const SchemeDetailsModal = ({ scheme, isOpen, onClose, isEligible }: SchemeDetailsModalProps) => {
    const navigate = useNavigate();
    const { addApplication, getApplicationBySchemeId } = useApplications();
    const existingApplication = getApplicationBySchemeId(scheme.id);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
                    <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                            {scheme.ministry}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-2">{scheme.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* content */}
                <div className="p-6 space-y-8">

                    {/* Eligibility Status */}
                    <div className={`p-4 rounded-xl border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-center gap-3">
                            {isEligible ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            )}
                            <div>
                                <h4 className={`font-semibold ${isEligible ? 'text-green-900' : 'text-amber-900'}`}>
                                    {isEligible ? "You are eligible!" : "Eligibility Check Required"}
                                </h4>
                                <p className={`text-sm ${isEligible ? 'text-green-700' : 'text-amber-700'}`}>
                                    {isEligible
                                        ? "Your profile matches the criteria for this scheme."
                                        : "Please verify your profile details to confirm eligibility."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">About the Scheme</h3>
                        <p className="text-slate-600 leading-relaxed">{scheme.description}</p>
                    </div>

                    {/* Benefits */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Benefits</h3>
                        <ul className="space-y-2">
                            {scheme.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-700">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Documents */}
                    {/* Documents */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-500" />
                            Required Documents
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {scheme.documentsRequired.map((doc, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                    {doc}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/documents')}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline flex items-center gap-1"
                        >
                            <FileText className="w-3 h-3" />
                            Check Document Locker
                        </button>
                    </div>

                    {/* Application Process */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">How to Apply</h3>
                        <p className="text-slate-600 mb-4">
                            This scheme accepts <span className="font-semibold text-slate-900 uppercase">{scheme.applicationMode}</span> applications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {scheme.officialUrl ? (
                                <a
                                    href={scheme.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                                >
                                    Apply on Official Website
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            ) : (
                                <div className="text-sm text-slate-500 italic p-2">
                                    Visit your nearest Common Service Center (CSC) or relevant government office to apply.
                                </div>
                            )}

                            {existingApplication ? (
                                <button
                                    onClick={() => navigate('/applications')}
                                    className="inline-flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 font-semibold py-2.5 px-5 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {existingApplication.status}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        addApplication(scheme.id, scheme.name);
                                        navigate('/applications');
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 px-5 rounded-lg transition-colors"
                                >
                                    Track Application
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
