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

import { dbService } from '../services/DatabaseService';
import { notificationService } from '../services/notificationService'; // For alerts
import { useAuth } from './AuthContext';

// ... (existing imports/interfaces)

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const { user, loading } = useAuth();

    // 1. Load from Database on mount and user change
    useEffect(() => {
        const loadApps = async () => {
            if (loading) return; // Wait for auth to initialize

            if (user) {
                const apps = await dbService.getApplications();
                setApplications(apps);
            } else {
                setApplications([]);
            }
        };
        loadApps();
    }, [user, loading]);

    // 2. Simulation Loop: Upgrade status every 15 seconds
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            setApplications(currentApps => {
                let hasChanges = false;
                const updatedApps = currentApps.map(app => {
                    // Logic to upgrade status
                    let newStep = app.step;
                    let newStatus = app.status;

                    // Only upgrade if not finished (step 4)
                    if (app.step < 4) {
                        // 30% chance to upgrade per tick to make it random/staggered
                        if (Math.random() > 0.7) {
                            newStep += 1;
                            if (newStep === 2) newStatus = 'Under Review';
                            if (newStep === 3) newStatus = 'Verified';
                            if (newStep === 4) newStatus = 'Approved';

                            hasChanges = true;

                            // Sync to DB
                            // We do this "fire and forget" here for the simulation to avoid freezing UI
                            const upgradedApp = { ...app, status: newStatus, step: newStep };
                            dbService.saveApplication(upgradedApp);

                            // Optional: Notify user
                            notificationService.sendNotification(user.id, {
                                title: 'Application Update',
                                message: `Your application for ${app.schemeName} is now ${newStatus}.`,
                                type: 'info',
                                time: new Date().toISOString(),
                                link: '/applications'
                            });
                        }
                    }
                    return { ...app, step: newStep, status: newStatus };
                });

                return hasChanges ? updatedApps : currentApps;
            });
        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, [user]);

    const addApplication = async (schemeId: string, schemeName: string) => {
        const newApp: Application = {
            id: `APP-${Date.now()}`,
            schemeId,
            schemeName,
            status: 'Submitted',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            step: 1,
            totalSteps: 4
        };

        // Optimistic UI update
        setApplications(prev => [newApp, ...prev]);

        // Save to DB
        await dbService.saveApplication(newApp);

        if (user) {
            notificationService.sendNotification(user.id, {
                title: 'Application Submitted',
                message: `We have received your application for ${schemeName}.`,
                type: 'success' as any,
                time: new Date().toISOString(),
                link: '/applications'
            });
        }
    };

    const updateStatus = async (id: string, status: Application['status'], step: number) => {
        // Find current app
        const app = applications.find(a => a.id === id);
        if (!app) return;

        const updatedApp = { ...app, status, step };

        setApplications(prev => prev.map(a => a.id === id ? updatedApp : a));
        await dbService.saveApplication(updatedApp);
    };

    const removeApplication = async (id: string) => {
        // Start by just removing from UI, database delete not implemented in service yet
        // but simulation is enough for now.
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
