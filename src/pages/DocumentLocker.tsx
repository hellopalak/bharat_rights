import React, { useState } from 'react';
import { FileText, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useDocuments } from '../contexts/DocumentContext';

const COMMON_DOCUMENTS = [
    { id: 'aadhar', name: 'Aadhar Card', category: 'Identity' },
    { id: 'pan', name: 'PAN Card', category: 'Identity' },
    { id: 'income', name: 'Income Certificate', category: 'Finance' },
    { id: 'caste', name: 'Caste Certificate', category: 'Identity' },
    { id: 'residence', name: 'Domicile/Residence Certificate', category: 'Identity' },
    { id: 'bank', name: 'Bank Passbook', category: 'Finance' },
    { id: 'ration', name: 'Ration Card', category: 'Family' },
    { id: 'marksheets', name: '10th/12th Marksheets', category: 'Education' },
    { id: 'disability', name: 'Disability Certificate (UDID)', category: 'Health' },
];


import { digiLocker } from '../services/DigiLockerService';

export const DocumentLocker = () => {
    // Use global persistent state
    const { documents, toggleDocument, isCollected, isVerified, syncWithDigiLocker, isLoading } = useDocuments();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectDigiLocker = async () => {
        setIsConnecting(true);
        try {
            const auth = await digiLocker.connect();
            if (auth.status === 'success') {
                const docs = await digiLocker.fetchDocuments();
                await syncWithDigiLocker(docs);
                alert(`Successfully connected to DigiLocker! Synced ${docs.length} verified documents.`);
            }
        } catch (error) {
            console.error("DigiLocker Error", error);
            alert("Failed to connect to DigiLocker");
        } finally {
            setIsConnecting(false);
        }
    };

    const progress = Math.round((documents.length / COMMON_DOCUMENTS.length) * 100);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Document Locker</h1>
                    <p className="text-slate-600">Keep track of documents required for various schemes.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 px-4 rounded-xl border border-slate-100 shadow-sm text-center">
                        <div className="text-xl font-bold text-primary-600">{progress}%</div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Ready</div>
                    </div>
                </div>
            </div>

            {/* DigiLocker Callout */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <img src="https://img.icons8.com/color/48/000000/india-emblem.png" alt="Emblem" className="w-10 h-10 opacity-90" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Connect your DigiLocker</h3>
                        <p className="text-blue-100 text-sm opacity-90">Automatically import verified documents like Aadhar, PAN, and Certificates.</p>
                    </div>
                </div>
                <button
                    onClick={handleConnectDigiLocker}
                    disabled={isConnecting}
                    className="bg-white text-blue-700 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isConnecting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                            Connecting...
                        </>
                    ) : (
                        "Link DigiLocker"
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Identity', 'Finance', 'Family', 'Health', 'Education'].map(category => {
                    const docs = COMMON_DOCUMENTS.filter(d => d.category === category);
                    if (docs.length === 0) return null;

                    return (
                        <div key={category} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-semibold text-slate-700">
                                {category}
                            </div>
                            <div className="p-2">
                                {docs.map(doc => {
                                    const collected = isCollected(doc.id);
                                    const verified = isVerified(doc.id);

                                    return (
                                        <div
                                            key={doc.id}
                                            onClick={() => toggleDocument(doc.id)}
                                            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border mb-2 last:mb-0 ${collected ? 'border-primary-100 bg-primary-50/30' : 'border-transparent'}`}
                                        >
                                            <div className={`flex-shrink-0 ${collected ? 'text-green-500' : 'text-slate-300'}`}>
                                                {collected ? <CheckCircle className="w-6 h-6 fill-green-50" /> : <Circle className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${collected ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {doc.name}
                                                    </span>
                                                    {verified && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide border border-green-200">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {!collected && (
                                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

