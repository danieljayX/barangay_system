import { Complainant, Respondent, Case, Hearing, Settlement, User } from '../types';

const DB_KEYS = {
    USERS: 'lupon_users',
    COMPLAINANTS: 'lupon_complainants',
    RESPONDENTS: 'lupon_respondents',
    CASES: 'lupon_cases',
    HEARINGS: 'lupon_hearings',
    SETTLEMENTS: 'lupon_settlements',
    SESSION: 'lupon_session'
};

const get = <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

const set = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

const setAndSync = <T>(key: string, value: T, endpoint: string): void => {
    localStorage.setItem(key, JSON.stringify(value));
    
    // Sync to SQLite backend
    fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value)
    }).catch(err => console.error(`Sync error for ${endpoint}:`, err));
};

export const DB = {
    users: {
        getAll: () => get<User[]>(DB_KEYS.USERS, []),
        save: (users: User[]) => setAndSync(DB_KEYS.USERS, users, 'users'),
        getCurrentSession: () => get<User | null>(DB_KEYS.SESSION, null),
        setSession: (user: User | null) => set(DB_KEYS.SESSION, user)
    },
    complainants: {
        getAll: () => get<Complainant[]>(DB_KEYS.COMPLAINANTS, []),
        save: (data: Complainant[]) => setAndSync(DB_KEYS.COMPLAINANTS, data, 'complainants')
    },
    respondents: {
        getAll: () => get<Respondent[]>(DB_KEYS.RESPONDENTS, []),
        save: (data: Respondent[]) => setAndSync(DB_KEYS.RESPONDENTS, data, 'respondents')
    },
    cases: {
        getAll: () => get<Case[]>(DB_KEYS.CASES, []),
        save: (data: Case[]) => setAndSync(DB_KEYS.CASES, data, 'cases')
    },
    hearings: {
        getAll: () => get<Hearing[]>(DB_KEYS.HEARINGS, []),
        save: (data: Hearing[]) => setAndSync(DB_KEYS.HEARINGS, data, 'hearings')
    },
    settlements: {
        getAll: () => get<Settlement[]>(DB_KEYS.SETTLEMENTS, []),
        save: (data: Settlement[]) => setAndSync(DB_KEYS.SETTLEMENTS, data, 'settlements')
    }
};

// Add default admin if users table is empty locally
if (DB.users.getAll().length === 0) {
    DB.users.save([{ id: '1', username: 'admin', password: 'password', role: 'admin' }]);
}
