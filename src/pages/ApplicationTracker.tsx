import React from 'react';
import { CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { useApplications } from '../contexts/ApplicationContext';



export const ApplicationTracker = () => {
    const { applications } = useApplications();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Application Status</h1>
                <p className="text-slate-600">Track the progress of your scheme applications.</p>
            </div>

            <div className="space-y-6">
                {applications.length > 0 ? (
                    applications.map(app => (
                        <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{app.schemeName}</h3>
                                    <p className="text-sm text-slate-500">ID: {app.id} • Applied on {app.date}</p>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            {/* Progress Bar */}
                            <div className="relative">
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                                    <div style={{ width: `${(app.step / app.totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                    <span className={app.step >= 1 ? 'text-primary-700' : ''}>Submitted</span>
                                    <span className={app.step >= 2 ? 'text-primary-700' : ''}>Under Review</span>
                                    <span className={app.step >= 3 ? 'text-primary-700' : ''}>Verified</span>
                                    <span className={app.step >= 4 ? 'text-primary-700' : ''}>Approved</span>
                                </div>
                            </div>
                        </div>
                    ))) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
                        <p className="text-slate-500 mb-6">You haven't applied for any schemes yet.</p>
                        <a href="/schemes" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                            Find Schemes to Apply
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        'Approved': 'bg-green-100 text-green-700',
        'Under Review': 'bg-yellow-100 text-yellow-700',
        'Rejected': 'bg-red-100 text-red-700',
    };
    const style = styles[status as keyof typeof styles] || 'bg-slate-100 text-slate-700';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
            {status}
        </span>
    );
};
