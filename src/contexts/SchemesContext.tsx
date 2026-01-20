import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Scheme } from '../data/types';
import { dbService } from '../services/DatabaseService';
import { SCHEMES as LOCAL_SCHEMES } from '../data/schemes'; // Fallback

interface SchemesContextType {
    schemes: Scheme[];
    isLoading: boolean;
    getSchemeById: (id: string) => Scheme | undefined;
}

const SchemesContext = createContext<SchemesContextType | undefined>(undefined);

export const SchemesProvider = ({ children }: { children: ReactNode }) => {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSchemes = async () => {
            setIsLoading(true);
            try {
                console.log("Fetching schemes from DB...");
                const dbSchemes = await dbService.getSchemes();
                console.log("DB Schemes result:", dbSchemes);

                if (dbSchemes && dbSchemes.length > 0) {
                    setSchemes(dbSchemes);
                } else {
                    console.warn("DB returned empty schemes, falling back to local.");
                    // Fallback to local if DB empty or unavailable
                    setSchemes(LOCAL_SCHEMES);
                }
            } catch (e) {
                console.error("Failed to load schemes", e);
                setSchemes(LOCAL_SCHEMES);
            } finally {
                setIsLoading(false);
            }
        };
        loadSchemes();
    }, []);

    const getSchemeById = (id: string) => schemes.find(s => s.id === id);

    return (
        <SchemesContext.Provider value={{ schemes, isLoading, getSchemeById }}>
            {children}
        </SchemesContext.Provider>
    );
};

export const useSchemes = () => {
    const context = useContext(SchemesContext);
    if (context === undefined) {
        throw new Error('useSchemes must be used within a SchemesProvider');
    }
    return context;
};
