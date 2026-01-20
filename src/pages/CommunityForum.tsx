import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, User, Plus, Search } from 'lucide-react';
import { dbService } from '../services/DatabaseService';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

interface Post {
    id: string;
    author: string;
    avatar?: string;
    title: string;
    content: string;
    category: string;
    likes: number;
    comments: number;
    timestamp: string;
}

export const CommunityForum = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { profile } = useProfile();

    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const dbPosts = await dbService.getPosts();
            // Map DB structure to UI structure if needed, or if fallback used
            // DB returns: user_id, author_name, title, content, created_at...
            // We map this to our UI Post interface
            const mappedPosts = dbPosts.map((p: any) => ({
                id: p.id,
                author: p.author_name || p.author || 'Anonymous', // Handle both DB and local structure
                title: p.title,
                content: p.content,
                category: p.category || 'General',
                likes: p.likes || 0,
                comments: p.comments_count || p.comments || 0,
                timestamp: new Date(p.created_at || Date.now()).toLocaleDateString()
            }));
            setPosts(mappedPosts);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to post.");
            return;
        }

        const newPostUI = {
            id: 'temp-' + Date.now(),
            author: profile?.name || user.email?.split('@')[0] || "User",
            title: newTitle,
            content: newContent,
            category: "General",
            likes: 0,
            comments: 0,
            timestamp: "Just now"
        };

        // Optimistic update
        setPosts([newPostUI, ...posts]);
        setShowModal(false);
        setNewTitle('');
        setNewContent('');

        // Save to DB
        try {
            await dbService.createPost(newPostUI);
            // Ideally we re-fetch to get the real ID, but this is fine for now
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to post question. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
                    <p className="text-slate-600">Connect with other citizens, ask questions, and share knowledge.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Ask a Question
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-2">
                <Search className="w-5 h-5 text-slate-400 my-auto ml-2" />
                <input
                    type="text"
                    placeholder="Search discussions..."
                    className="flex-grow p-2 focus:outline-none text-slate-700"
                />
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">Loading discussions...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No discussions yet. Be the first to ask!</div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{post.author}</h3>
                                        <span className="text-xs text-slate-500">{post.timestamp} • {post.category}</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">{post.content}</p>

                            <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                                <button className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">{post.likes} Likes</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">{post.comments} Comments</span>
                                </button>
                            </div>
                        </div>
                    )))}
            </div>

            {/* Ask Question Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ask a Question</h2>
                        <form onSubmit={handlePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="What's your question about?"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Details</label>
                                <textarea
                                    required
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                    placeholder="Describe your issue or query in detail..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Post Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
