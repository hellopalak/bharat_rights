export type SchemeCategory =
    | 'education'
    | 'health'
    | 'finance'
    | 'agriculture'
    | 'social_welfare'
    | 'housing'
    | 'employment';

export type BeneficiaryGroup =
    | 'child'
    | 'student'
    | 'youth'
    | 'adult'
    | 'woman'
    | 'senior_citizen'
    | 'pwd';

export interface Scheme {
    id: string;
    name: string;
    ministry: string;
    description: string;
    category: SchemeCategory[];
    beneficiaryGroups: BeneficiaryGroup[];
    eligibility: {
        ageMin?: number;
        ageMax?: number;
        incomeMax?: number;
        gender?: 'male' | 'female' | 'all';
        disability?: boolean;
        caste?: ('sc' | 'st' | 'obc' | 'general')[];
        occupation?: string[];
        isStudent?: boolean;
        state?: string; // If null, applies to all
        maritalStatus?: 'single' | 'married' | 'widowed';
    };
    benefits: string[];
    documentsRequired: string[];
    applicationMode: 'online' | 'offline' | 'both';
    officialUrl?: string;
    applicationDeadline?: string;
}

export interface UserProfile {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    income: number; // Annual income
    state: string;
    district: string;
    city?: string;
    // Conditional fields based on occupation
    institute?: string;     // for student
    company?: string;       // for employed
    farmSize?: string;      // for farmer

    occupation: 'student' | 'employed' | 'unemployed' | 'self_employed' | 'retired' | 'farmer';
    disability: boolean;
    caste: 'sc' | 'st' | 'obc' | 'general';
    // Fix: Make maritalStatus optional or required consistenty. 
    maritalStatus?: 'single' | 'married' | 'widowed';
}

export interface DocumentItem {
    id: string;
    isVerified: boolean;
    verificationSource?: 'manual' | 'digilocker';
    lastUpdated: string;
}

export interface Post {
    id: string;
    user_id: string;
    author_name: string;
    title: string;
    content: string;
    category: string;
    likes: number;
    comments_count: number;
    created_at: string;
}
