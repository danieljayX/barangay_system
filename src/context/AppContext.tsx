import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Complainant, Respondent, Case, Hearing, Settlement } from '../types';
import { DB } from '../db/localDb';

interface AppContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    complainants: Complainant[];
    setComplainants: React.Dispatch<React.SetStateAction<Complainant[]>>;
    respondents: Respondent[];
    setRespondents: React.Dispatch<React.SetStateAction<Respondent[]>>;
    cases: Case[];
    setCases: React.Dispatch<React.SetStateAction<Case[]>>;
    hearings: Hearing[];
    setHearings: React.Dispatch<React.SetStateAction<Hearing[]>>;
    settlements: Settlement[];
    setSettlements: React.Dispatch<React.SetStateAction<Settlement[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        try {
            const saved = localStorage.getItem('lupon_theme');
            return (saved === 'dark' || saved === 'light') ? saved : 'dark'; // Defaulting to dark as requested "ibalik"
        } catch {
            return 'dark';
        }
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('lupon_session');
            return saved ? JSON.parse(saved) : null;
        } catch {
            localStorage.removeItem('lupon_session');
            return null;
        }
    });

    // ... rest of imports/state ...
    const [complainants, setComplainants] = useState<Complainant[]>(() => {
        try { return DB.complainants.getAll() || []; } catch { return []; }
    });
    const [respondents, setRespondents] = useState<Respondent[]>(() => {
        try { return DB.respondents.getAll() || []; } catch { return []; }
    });
    const [cases, setCases] = useState<Case[]>(() => {
        try { return DB.cases.getAll() || []; } catch { return []; }
    });
    const [hearings, setHearings] = useState<Hearing[]>(() => {
        try { return DB.hearings.getAll() || []; } catch { return []; }
    });
    const [settlements, setSettlements] = useState<Settlement[]>(() => {
        try { return DB.settlements.getAll() || []; } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('lupon_theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [theme]);

    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from backend
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const endpoints = ['users', 'complainants', 'respondents', 'cases', 'hearings', 'settlements'];
                const responses = await Promise.all(endpoints.map(ep => fetch(`http://localhost:5000/api/${ep}`).catch(() => null)));
                const data = await Promise.all(responses.map(res => res && res.ok ? res.json() : null));

                // If backend has data, prioritize it. If backend empty, it returns [].
                // We only set states if we successfully got arrays to replace the local storage copy.
                if (data[0] && Array.isArray(data[0]) && data[0].length > 0) DB.users.save(data[0]);
                if (data[1] && Array.isArray(data[1])) setComplainants(data[1]);
                if (data[2] && Array.isArray(data[2])) setRespondents(data[2]);
                if (data[3] && Array.isArray(data[3])) setCases(data[3]);
                if (data[4] && Array.isArray(data[4])) setHearings(data[4]);
                if (data[5] && Array.isArray(data[5])) setSettlements(data[5]);
            } catch (err) {
                console.error("Failed to fetch initial data from SQLite backend", err);
            } finally {
                setIsLoaded(true);
            }
        };
        loadInitialData();
    }, []);

    // Sync with LocalStorage AND Backend
    useEffect(() => { if (isLoaded) DB.users.setSession(currentUser); }, [currentUser, isLoaded]);
    useEffect(() => { if (isLoaded) DB.complainants.save(complainants); }, [complainants, isLoaded]);
    useEffect(() => { if (isLoaded) DB.respondents.save(respondents); }, [respondents, isLoaded]);
    useEffect(() => { if (isLoaded) DB.cases.save(cases); }, [cases, isLoaded]);
    useEffect(() => { if (isLoaded) DB.hearings.save(hearings); }, [hearings, isLoaded]);
    useEffect(() => { if (isLoaded) DB.settlements.save(settlements); }, [settlements, isLoaded]);

    return (
        <AppContext.Provider value={{
            currentUser, setCurrentUser,
            theme, setTheme,
            complainants, setComplainants,
            respondents, setRespondents,
            cases, setCases,
            hearings, setHearings,
            settlements, setSettlements
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
