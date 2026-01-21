import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { dbService } from '../services/DatabaseService';
import { useAuth } from './AuthContext';

interface SavedSchemesContextType {
    savedSchemeIds: string[];
    saveScheme: (id: string) => void;
    removeScheme: (id: string) => void;
    isSaved: (id: string) => boolean;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export const SavedSchemesProvider = ({ children }: { children: ReactNode }) => {
    const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);
    const { user, loading } = useAuth(); // Reload when user changes

    // Load saved schemes
    useEffect(() => {
        const loadSaved = async () => {
            if (loading) return; // Wait for auth to initialize

            try {
                if (user) {
                    const ids = await dbService.getSavedSchemes();
                    setSavedSchemeIds(ids);
                } else {
                    setSavedSchemeIds([]);
                }
            } catch (e) {
                console.error("Failed to load saved schemes", e);
            }
        };
        loadSaved();
    }, [user, loading]);

    const saveScheme = async (id: string) => {
        // Optimistic update
        setSavedSchemeIds(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
        await dbService.saveScheme(id);
    };

    const removeScheme = async (id: string) => {
        // Optimistic update
        setSavedSchemeIds(prev => prev.filter(schemeId => schemeId !== id));
        await dbService.removeSavedScheme(id);
    };

    const isSaved = (id: string) => savedSchemeIds.includes(id);

    return (
        <SavedSchemesContext.Provider value={{ savedSchemeIds, saveScheme, removeScheme, isSaved }}>
            {children}
        </SavedSchemesContext.Provider>
    );
};

export const useSavedSchemes = () => {
    const context = useContext(SavedSchemesContext);
    if (context === undefined) {
        throw new Error('useSavedSchemes must be used within a SavedSchemesProvider');
    }
    return context;
};
