import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Application {
    id: string;
    schemeId: string;
    schemeName: string;
    status: 'Submitted' | 'Under Review' | 'Verified' | 'Approved' | 'Rejected';
    date: string;
    step: number;
    totalSteps: number;
}

interface ApplicationContextType {
    applications: Application[];
    addApplication: (schemeId: string, schemeName: string) => void;
    updateStatus: (id: string, status: Application['status'], step: number) => void;
    removeApplication: (id: string) => void;
    getApplicationBySchemeId: (schemeId: string) => Application | undefined;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
    const [applications, setApplications] = useState<Application[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('applications');
        if (saved) {
            try {
                setApplications(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse applications", e);
            }
        } else {
            // Initialize with some mock data if empty (optional, or empty)
            // Let's keep it empty or maybe the previous mock data for demo purposes if the user wants?
            // User requested "Engagement features", finding existing bugs. 
            // Better start fresh or keep the mocks if useful? 
            // Let's keep the user-defined mocks if nothing is there, so the page isn't blank initially?
            // No, fresh is better for a "real" feel.
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('applications', JSON.stringify(applications));
    }, [applications]);

    const addApplication = (schemeId: string, schemeName: string) => {
        const newApp: Application = {
            id: `APP-${Date.now()}`,
            schemeId,
            schemeName,
            status: 'Submitted',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            step: 1,
            totalSteps: 4
        };
        setApplications(prev => [newApp, ...prev]);
    };

    const updateStatus = (id: string, status: Application['status'], step: number) => {
        setApplications(prev => prev.map(app =>
            app.id === id ? { ...app, status, step } : app
        ));
    };

    const removeApplication = (id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    const getApplicationBySchemeId = (schemeId: string) => {
        return applications.find(app => app.schemeId === schemeId);
    };

    return (
        <ApplicationContext.Provider value={{ applications, addApplication, updateStatus, removeApplication, getApplicationBySchemeId }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplications = () => {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplications must be used within a ApplicationProvider');
    }
    return context;
};
