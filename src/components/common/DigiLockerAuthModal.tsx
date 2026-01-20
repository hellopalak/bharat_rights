import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, UserCheck } from 'lucide-react';

interface DigiLockerAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const DigiLockerAuthModal: React.FC<DigiLockerAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAadhaarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
            setError('Please enter a valid 12-digit Aadhaar number.');
            return;
        }

        setIsLoading(true);
        // Simulate API check delay
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setIsLoading(true);
        // Simulate OTP verification delay
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/23/DigiLocker_logo.png"
                        alt="DigiLocker"
                        className="h-12 mx-auto mb-2"
                        onError={(e) => {
                            // Fallback if image fails
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <h2 className="text-2xl font-bold text-blue-800">DigiLocker Connect</h2>
                    <p className="text-sm text-gray-600">Secure Government Document Access</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleAadhaarSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={aadhaar}
                                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                    placeholder="XXXX XXXX XXXX"
                                    className="pl-10 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">We will send an OTP to the mobile linked with your Aadhaar.</p>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Verifying...</span>
                            ) : (
                                "Next"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4">
                            <CheckCircle className="text-green-500 mr-2" size={20} />
                            <span className="text-sm text-blue-800">Aadhaar Verified. OTP sent to mobile ending in ******{aadhaar.slice(-4)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Smartphone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="pl-10 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 tracking-widest text-lg"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-gray-100 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-200 transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-2/3 bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Verifying OTP...</span>
                                ) : (
                                    "Connect & Sync"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 flex items-center justify-center">
                        <span className="mr-1">🔒</span> 256-bit Encryption • UIDAI Verified
                    </p>
                </div>
            </div>
        </div>
    );
};
