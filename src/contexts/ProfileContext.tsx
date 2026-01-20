import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../data/types';
import { dbService } from '../services/DatabaseService';
import { useAuth } from './AuthContext';

interface ProfileContextType {
    profile: UserProfile | null;
    updateProfile: (profile: UserProfile) => Promise<void>;
    clearProfile: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth(); // Depend on Auth state

    // Load profile when User changes (login/logout/refresh)
    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                // If we have a user, try to fetch from DB (Supabase or Local)
                // dbService handles the logic: checking Supabase session or LocalStorage
                const data = await dbService.getUserProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const updateProfile = async (newProfile: UserProfile) => {
        setIsLoading(true);
        try {
            await dbService.saveUserProfile(newProfile);
            setProfile(newProfile);
        } catch (error) {
            console.error("Failed to save profile", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const clearProfile = () => {
        setProfile(null);
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            updateProfile,
            clearProfile,
            isAuthenticated: !!profile || !!user, // Consider authenticated if we have a User object from AuthContext
            isLoading
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
