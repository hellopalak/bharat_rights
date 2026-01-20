import React from 'react';
import { ProfileForm } from '../components/profile/ProfileForm';

export const ProfilePage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
                <p className="text-slate-600 mt-2">Complete your profile to get personalized scheme recommendations.</p>
            </div>
            <ProfileForm />
        </div>
    );
};
