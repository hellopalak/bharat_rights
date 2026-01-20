import type { Scheme } from './types';

export const SCHEMES: Scheme[] = [
    // Children & Education
    {
        id: 'pm-poshan',
        name: 'PM POSHAN (Mid-Day Meal)',
        ministry: 'Ministry of Education',
        description: 'Provides hot cooked meals to school children in government and government-aided schools.',
        category: ['education', 'social_welfare'],
        beneficiaryGroups: ['child', 'student'],
        eligibility: {
            ageMax: 14,
            isStudent: true,
            incomeMax: undefined,
        },
        benefits: ['Nutritious hot cooked meal every school day'],
        documentsRequired: ['School Admission Record'],
        applicationMode: 'offline'
    },
    {
        id: 'pm-yasasvi',
        name: 'PM-YASASVI Scholarship',
        ministry: 'Ministry of Social Justice and Empowerment',
        description: 'Scholarship for OBC, EBC and DNT students for Top Class School Education.',
        category: ['education', 'finance'],
        beneficiaryGroups: ['student', 'youth'],
        eligibility: {
            caste: ['obc'],
            incomeMax: 250000,
            isStudent: true,
        },
        benefits: ['Financial assistance for education up to Rs. 75,000 - 1,25,000 p.a.'],
        documentsRequired: ['Income Certificate', 'Caste Certificate', 'Aadhaar Card'],
        applicationMode: 'online',
        officialUrl: 'https://yet.nta.ac.in/'
    },

    // Employment & Welfare
    {
        id: 'mgnrega',
        name: 'MGNREGA',
        ministry: 'Ministry of Rural Development',
        description: 'Guarantees 100 days of wage employment in a financial year to a rural household whose adult members volunteer to do unskilled manual work.',
        category: ['employment', 'social_welfare'],
        beneficiaryGroups: ['adult'],
        eligibility: {
            ageMin: 18,
            state: undefined, // Rural only technically, but simplified for now
        },
        benefits: ['100 days of guaranteed wage employment'],
        documentsRequired: ['Job Card', 'Aadhaar Card', 'Bank Account'],
        applicationMode: 'offline'
    },

    // Women
    {
        id: 'pm-matru-vandana',
        name: 'Pradhan Mantri Matru Vandana Yojana',
        ministry: 'Ministry of Women and Child Development',
        description: 'Maternity benefit program providing partial compensation for the wage loss in terms of cash incentives so that the woman can take adequate rest before and after delivery.',
        category: ['health', 'social_welfare'],
        beneficiaryGroups: ['woman'],
        eligibility: {
            gender: 'female',
            ageMin: 19,
        },
        benefits: ['Rs. 5000 in three installments'],
        documentsRequired: ['MCP Card', 'Aadhaar Card', 'Bank Account'],
        applicationMode: 'both'
    },

    // Senior Citizens
    {
        id: 'pm-vayoshri',
        name: 'Rashtriya Vayoshri Yojana',
        ministry: 'Ministry of Social Justice and Empowerment',
        description: 'Scheme for providing Physical Aids and Assisted-living Devices for Senior citizens belonging to BPL category.',
        category: ['social_welfare', 'health'],
        beneficiaryGroups: ['senior_citizen'],
        eligibility: {
            ageMin: 60,
            incomeMax: 100000, // Proxy for BPL
        },
        benefits: ['Free assisted-living devices (walking sticks, hearing aids, etc.)'],
        documentsRequired: ['Aadhaar Card', 'Income Certificate/BPL Card', 'Medical Certificate'],
        applicationMode: 'offline'
    },

    // PwD
    {
        id: 'adip-scheme',
        name: 'ADIP Scheme',
        ministry: 'Ministry of Social Justice and Empowerment',
        description: 'Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances.',
        category: ['social_welfare', 'health'],
        beneficiaryGroups: ['pwd'],
        eligibility: {
            disability: true,
        },
        benefits: ['Free or subsidized aids and appliances'],
        documentsRequired: ['Disability Certificate (40%+)', 'Income Certificate'],
        applicationMode: 'offline'
    },

    // Housing
    {
        id: 'pmay-u',
        name: 'Pradhan Mantri Awas Yojana (Urban)',
        ministry: 'Ministry of Housing and Urban Affairs',
        description: 'Housing for All in urban areas.',
        category: ['housing'],
        beneficiaryGroups: ['adult', 'senior_citizen'],
        eligibility: {
            ageMin: 18,
            incomeMax: 1800000,
        },
        benefits: ['Interest subsidy on home loan up to Rs. 2.67 Lakh'],
        documentsRequired: ['Aadhaar Card', 'Income Proof'],
        applicationMode: 'online',
        officialUrl: 'https://pmaymis.gov.in/'
    },

    // Health
    {
        id: 'ayushman-bharat',
        name: 'Ayushman Bharat PM-JAY',
        ministry: 'Ministry of Health and Family Welfare',
        description: 'World\'s largest government funded healthcare program targeting more than 50 crore beneficiaries.',
        category: ['health'],
        beneficiaryGroups: ['adult', 'senior_citizen', 'child', 'woman', 'pwd'],
        eligibility: {
            // Logic is complex (SECC data), simplifying for hackathon
            incomeMax: 250000,
        },
        benefits: ['Health cover of Rs. 5 lakhs per family per year'],
        documentsRequired: ['Aadhaar Card', 'Ration Card'],
        applicationMode: 'online',
        officialUrl: 'https://pmjay.gov.in/'
    }
];
