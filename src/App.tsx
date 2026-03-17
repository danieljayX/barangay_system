import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

import Complainants from './pages/Complainants';
import Respondents from './pages/Respondents';
import Cases from './pages/Cases';
import Hearings from './pages/Hearings';
import Settlements from './pages/Settlements';
import Reports from './pages/Reports';
import Admin from './pages/Admin';

const AppContent: React.FC = () => {
    const { currentUser } = useAppContext();
    const [activePath, setActivePath] = useState('dashboard');

    if (!currentUser) {
        return <Login />;
    }

    const renderContent = () => {
        switch (activePath) {
            case 'dashboard':
                return <Dashboard onAction={setActivePath} />;
            case 'cases':
                return <Cases />;
            case 'complainants':
                return <Complainants />;
            case 'respondents':
                return <Respondents />;
            case 'hearings':
                return <Hearings onNavigate={setActivePath} />;
            case 'settlements':
                return <Settlements onNavigate={setActivePath} />;
            case 'reports':
                return <Reports />;
            case 'admin':
                return <Admin />;
            default:
                return <Dashboard onAction={setActivePath} />;
        }
    };

    return (
        <Layout activePath={activePath} onNavigate={setActivePath}>
            {renderContent()}
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
