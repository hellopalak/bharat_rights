import type { Scheme, UserProfile } from '../data/types';
import { SCHEMES } from '../data/schemes';

export const findEligibleSchemes = (profile: UserProfile): Scheme[] => {
    return SCHEMES.filter(scheme => {
        const { eligibility } = scheme;

        // Age Check
        if (eligibility.ageMin && profile.age < eligibility.ageMin) return false;
        if (eligibility.ageMax && profile.age > eligibility.ageMax) return false;

        // Gender Check
        if (eligibility.gender && eligibility.gender !== 'all' && eligibility.gender !== profile.gender) return false;

        // Income Check
        if (eligibility.incomeMax && profile.income > eligibility.incomeMax) return false;

        // Student Check
        if (eligibility.isStudent && profile.occupation !== 'student') return false;

        // Disability Check
        if (eligibility.disability && !profile.disability) return false;

        // Caste Check
        if (eligibility.caste && !eligibility.caste.includes(profile.caste)) return false;

        // State Check
        if (eligibility.state && eligibility.state !== profile.state) return false;

        return true;
    });
};

export const findNearlyEligibleSchemes = (profile: UserProfile): Scheme[] => {
    // Logic to find schemes where user fails only 1 criteria (e.g., income slightly high)
    // For hackathon simplification, we can just return a few random ones or skip this complexity for now
    return [];
};
