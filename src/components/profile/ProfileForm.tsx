import React, { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import type { UserProfile } from '../../data/types';
import { useNavigate } from 'react-router-dom';
import { Save, User, MapPin, Briefcase, Building2, School, Sprout } from 'lucide-react';

// List of all 28 States + 8 UTs
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Helper to handle "number | ''" for empty inputs
type FormData = Omit<UserProfile, 'age' | 'income'> & {
    age: number | '';
    income: number | '';
};

export const ProfileForm = () => {
    const { profile, updateProfile } = useProfile();
    const navigate = useNavigate();

    // Initialize with blank values instead of 0 for better UX
    const [formData, setFormData] = useState<FormData>(() => {
        if (profile) return profile;
        return {
            name: '',
            age: '', // Empty string for "placeholder" effect
            gender: 'male',
            income: '',
            state: '', // No default selection force user to choose
            district: '',
            city: '',
            occupation: 'unemployed',
            disability: false,
            caste: 'general',
            maritalStatus: 'single',
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            // Allow empty string or convert to number
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Ensure numbers are actually numbers before saving
        const finalData: UserProfile = {
            ...formData,
            age: Number(formData.age),
            income: Number(formData.income),
            // Default "Delhi" if state is somehow empty? Or validation required.
            // HTML 'required' attr handles empty string validation for select/inputs
            state: formData.state || 'Delhi'
        };

        try {
            await updateProfile(finalData);
            navigate('/schemes');
        } catch (error: any) {
            console.error("Profile Save Failed:", error);
            // Show the actual error message from Supabase to help debug
            alert(`Failed to save! Error: ${error.message || "Unknown error"}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {/* --- Basic Details --- */}
            <div className="border-b border-slate-100 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary-600" />
                    Basic Details
                </h2>
                <p className="text-slate-500 mt-1">Tell us about yourself so we can find the best schemes for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g. Rajesh Kumar"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        required
                        min="0"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Age (e.g. 25)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* --- Socio-Economic --- */}
            <div className="border-b border-slate-100 pb-6 mb-6 mt-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    Socio-Economic Details
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Family Income (₹)</label>
                    <input
                        type="number"
                        name="income"
                        required
                        min="0"
                        value={formData.income}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g. 150000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Caste Category</label>
                    <select
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                    <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                        <option value="employed">Employed (Salaried)</option>
                        <option value="self_employed">Self Employed / Business</option>
                        <option value="farmer">Farmer</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>

                {/* Conditional Occupation Fields */}
                {formData.occupation === 'student' && (
                    <div className="col-span-2 md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                            <School className="w-4 h-4 text-slate-500" /> Institute / School Name
                        </label>
                        <input
                            type="text"
                            name="institute"
                            value={formData.institute || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Name of your School/College"
                        />
                    </div>
                )}

                {formData.occupation === 'employed' && (
                    <div className="col-span-2 md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-slate-500" /> Company Name
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Current Employer"
                        />
                    </div>
                )}

                {formData.occupation === 'farmer' && (
                    <div className="col-span-2 md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                            <Sprout className="w-4 h-4 text-slate-500" /> Land Holding Size
                        </label>
                        <input
                            type="text"
                            name="farmSize"
                            value={formData.farmSize || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g. 2 Acres"
                        />
                    </div>
                )}
            </div>

            {/* --- Location --- */}
            <div className="border-b border-slate-100 pb-6 mb-6 mt-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Location & Other
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <select
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="District Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City / Town</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="City"
                    />
                </div>

                <div className="flex items-center space-x-3 mt-6">
                    <input
                        type="checkbox"
                        name="disability"
                        id="disability"
                        checked={formData.disability}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="disability" className="text-sm font-medium text-slate-700">
                        Are you a Person with Disability (PwD)?
                    </label>
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/30"
                >
                    <Save className="w-5 h-5" />
                    Save Profile & Find Schemes
                </button>
            </div>
        </form>
    );
};
