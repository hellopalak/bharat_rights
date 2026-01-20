import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProfileProvider } from './contexts/ProfileContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SavedSchemesProvider } from './contexts/SavedSchemesContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchemeExplore } from './pages/SchemeExplore';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { DocumentLocker } from './pages/DocumentLocker';
import { CommunityForum } from './pages/CommunityForum';
import { SchemeBot } from './components/chat/SchemeBot';

import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProfileProvider>
          <DocumentProvider>
            <SavedSchemesProvider>
              <ApplicationProvider>
                <Router>
                  <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/schemes" element={<SchemeExplore />} />
                        <Route path="/saved" element={<SavedSchemesPage />} />
                        <Route path="/applications" element={<ApplicationTracker />} />
                        <Route path="/documents" element={<DocumentLocker />} />
                        <Route path="/community" element={<CommunityForum />} />
                      </Routes>
                    </main>
                    <SchemeBot />
                  </div>
                </Router>
              </ApplicationProvider>
            </SavedSchemesProvider>
          </DocumentProvider>
        </ProfileProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
