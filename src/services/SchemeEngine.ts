import type { Scheme, UserProfile } from '../data/types';

export const findEligibleSchemes = (profile: UserProfile, schemes: Scheme[]): Scheme[] => {
    return schemes.filter(scheme => {
        const { eligibility } = scheme;

        // Age Check
        if (eligibility.ageMin && profile.age < eligibility.ageMin) return false;
        if (eligibility.ageMax && profile.age > eligibility.ageMax) return false;

        // Gender Check
        if (eligibility.gender && eligibility.gender !== 'all' && eligibility.gender !== profile.gender) return false;

        // Income Check
        if (eligibility.incomeMax && profile.income > eligibility.incomeMax) return false;

        // Student Check
        // If scheme requires student, user MUST be student.
        if (eligibility.isStudent && profile.occupation !== 'student') return false;

        // Disability Check
        if (eligibility.disability && !profile.disability) return false;

        // Caste Check
        if (eligibility.caste && eligibility.caste.length > 0 && !eligibility.caste.includes(profile.caste)) return false;

        // State Check
        // If scheme is state-specific, user must match state. If scheme is central (undefined state), everyone is eligible.
        if (eligibility.state && eligibility.state !== profile.state) return false;

        // Occupation Check
        // Check exact occupation match if scheme specifies specific occupations (e.g. farmer)
        if (eligibility.occupation && eligibility.occupation.length > 0) {
            if (!eligibility.occupation.includes(profile.occupation)) return false;
        }

        // Marital Status Check
        if (eligibility.maritalStatus && profile.maritalStatus && eligibility.maritalStatus !== profile.maritalStatus) return false;
        // If scheme requires specific marital status but user hasn't specified one?
        // Assuming if user field is optional/undefined, they fail a strict check? 
        // Or if user hasn't filled it, we can't be sure. Let's assume strict fail for now if requirement exists.
        if (eligibility.maritalStatus && !profile.maritalStatus) return false;

        return true;
    });
};

export const findNearlyEligibleSchemes = (profile: UserProfile): Scheme[] => {
    // Logic to find schemes where user fails only 1 criteria (e.g., income slightly high)
    // For hackathon simplification, we can just return a few random ones or skip this complexity for now
    return [];
};
