import type { UserProfile, DocumentItem } from '../data/types';
import type { Application } from '../contexts/ApplicationContext';
import { supabase } from '../lib/supabase';

// Simulating a delay to mimic network requests
const DELAY_MS = 800;

const delay = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), DELAY_MS));
};

class DatabaseService {
    // --- User Profile ---
    async getUserProfile(): Promise<UserProfile | null> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                console.error("Supabase error:", error);
            }
            return data || null;
        } else {
            const data = localStorage.getItem('profile');
            return delay(data ? JSON.parse(data) : null);
        }
    }

    async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: user.id, ...profile })
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            localStorage.setItem('profile', JSON.stringify(profile));
            return delay(profile);
        }
    }

    // --- Applications ---
    async getApplications(): Promise<Application[]> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('user_applications')
                .select('*')
                .eq('user_id', user.id);

            if (error) console.error(error);
            return data || [];
        } else {
            const data = localStorage.getItem('applications');
            return delay(data ? JSON.parse(data) : []);
        }
    }

    async saveApplication(application: Application): Promise<Application> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            // Create a new object without 'id' if we want Supabase to generate it, 
            // OR use the one we generated. For simplicity, let's use the ID we generated in context
            const { error } = await supabase
                .from('user_applications')
                .upsert({ ...application, user_id: user.id });

            if (error) throw error;
            return application;
        } else {
            const apps = await this.getApplications();
            const updatedApps = [application, ...apps];
            localStorage.setItem('applications', JSON.stringify(updatedApps));
            return delay(application);
        }
    }

    // --- Documents ---
    async getDocuments(): Promise<DocumentItem[]> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('user_documents')
                .select('*')
                .eq('user_id', user.id);

            if (error) console.error(error);
            return data || [];
        } else {
            const data = localStorage.getItem('user_documents');
            return delay(data ? JSON.parse(data) : []);
        }
    }

    async updateDocumentStatus(doc: DocumentItem): Promise<DocumentItem> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            const { error } = await supabase
                .from('user_documents')
                .upsert({ ...doc, user_id: user.id });

            if (error) throw error;
            return doc;
        } else {
            const docs = await this.getDocuments();
            const index = docs.findIndex(d => d.id === doc.id);

            let newDocs;
            if (index >= 0) {
                newDocs = [...docs];
                newDocs[index] = doc;
            } else {
                newDocs = [...docs, doc];
            }

            localStorage.setItem('user_documents', JSON.stringify(newDocs));
            return delay(doc);
        }
    }

    async syncDigiLockerDocs(verifiedDocs: DocumentItem[]): Promise<DocumentItem[]> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            // Bulk upsert
            const docsWithUser = verifiedDocs.map(d => ({ ...d, user_id: user.id }));
            const { data, error } = await supabase
                .from('user_documents')
                .upsert(docsWithUser)
                .select();

            if (error) throw error;
            return data || [];
        } else {
            const currentDocs = await this.getDocuments();
            const newDocs = [...currentDocs];

            verifiedDocs.forEach(vDoc => {
                const index = newDocs.findIndex(d => d.id === vDoc.id);
                if (index >= 0) {
                    newDocs[index] = { ...newDocs[index], ...vDoc };
                } else {
                    newDocs.push(vDoc);
                }
            });

            localStorage.setItem('user_documents', JSON.stringify(newDocs));
            return delay(newDocs);
        }
    }
    // --- Community Forum ---
    async getPosts(): Promise<any[]> {
        if (supabase) {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching posts:", error);
            return data || [];
        } else {
            const data = localStorage.getItem('communityPosts');
            return delay(data ? JSON.parse(data) : []);
        }
    }

    async createPost(post: any): Promise<any> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");

            // Post object needs to map to DB columns
            const dbPost = {
                user_id: user.id,
                author_name: post.author, // Mapped from UI 'author'
                title: post.title,
                content: post.content,
                category: post.category,
                likes: 0,
                comments_count: 0
            };

            const { data, error } = await supabase
                .from('posts')
                .insert(dbPost)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            // Local fallback
            const currentPosts = await this.getPosts();
            const newPosts = [post, ...currentPosts];
            localStorage.setItem('communityPosts', JSON.stringify(newPosts));
            return delay(post);
        }
    }

    // --- Saved Schemes ---
    async getSavedSchemes(): Promise<string[]> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('saved_schemes')
                .select('scheme_id')
                .eq('user_id', user.id);

            if (error) console.error(error);
            return data ? data.map(item => item.scheme_id) : [];
        } else {
            const data = localStorage.getItem('savedSchemes');
            return delay(data ? JSON.parse(data) : []);
        }
    }

    async saveScheme(schemeId: string): Promise<void> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Silent fail if not logged in

            const { error } = await supabase
                .from('saved_schemes')
                .upsert({ user_id: user.id, scheme_id: schemeId }); // upsert handles duplicates via unique constraint

            if (error) console.error("Error saving scheme:", error);
        } else {
            const current = await this.getSavedSchemes();
            if (!current.includes(schemeId)) {
                localStorage.setItem('savedSchemes', JSON.stringify([...current, schemeId]));
            }
        }
    }

    async removeSavedScheme(schemeId: string): Promise<void> {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('saved_schemes')
                .delete()
                .eq('user_id', user.id)
                .eq('scheme_id', schemeId);

            if (error) console.error("Error removing scheme:", error);
        } else {
            const current = await this.getSavedSchemes();
            const updated = current.filter(id => id !== schemeId);
            localStorage.setItem('savedSchemes', JSON.stringify(updated));
        }
    }
}

export const dbService = new DatabaseService();
