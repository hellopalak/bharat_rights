import type { DocumentItem } from "../data/types";

// Simulating DigiLocker Response
export class DigiLockerService {
    async connect(): Promise<{ status: 'success' | 'failed', user?: string }> {
        return new Promise((resolve) => {
            // Delay is now handled by the UI Modal for better UX
            // Service just confirms the final handshake
            setTimeout(() => {
                resolve({ status: 'success', user: 'Rahul Sharma (Aadhar Verified)' });
            }, 1000);
        });
    }

    async fetchDocuments(): Promise<DocumentItem[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fetchedDocs: DocumentItem[] = [
                    {
                        id: 'aadhar',
                        isVerified: true,
                        verificationSource: 'digilocker',
                        lastUpdated: new Date().toISOString()
                    },
                    {
                        id: 'pan',
                        isVerified: true,
                        verificationSource: 'digilocker',
                        lastUpdated: new Date().toISOString()
                    },
                    {
                        id: 'drive_license',
                        isVerified: true,
                        verificationSource: 'digilocker',
                        lastUpdated: new Date().toISOString()
                    }
                ];
                resolve(fetchedDocs);
            }, 1500);
        });
    }
}

export const digiLocker = new DigiLockerService();
