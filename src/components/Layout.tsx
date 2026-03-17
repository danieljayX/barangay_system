import React, { useState } from 'react';
import { Home, Settings, Users, Folder, Calendar, BarChart2, LogOut, User, Moon, Sun, LayoutGrid, FileCheck, AlertTriangle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
    children: React.ReactNode;
    activePath: string;
    onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
    const { setCurrentUser, theme, setTheme } = useAppContext();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'cases', label: 'Case Management', icon: <Folder size={18} /> },
        { id: 'complainants', label: 'Complainants', icon: <User size={18} /> },
        { id: 'respondents', label: 'Respondents', icon: <Users size={18} /> },
        { id: 'hearings', label: 'Hearing Schedule', icon: <Calendar size={18} /> },
        { id: 'settlements', label: 'Settlement Records', icon: <FileCheck size={18} /> },
        { id: 'reports', label: 'Reports', icon: <BarChart2 size={18} /> },
        { id: 'admin', label: 'Admin Settings', icon: <Settings size={18} /> },
    ];

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: 'var(--bg-dark)',
            color: 'var(--text-main)',
            overflow: 'hidden'
        }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'var(--bg-sidebar)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                position: 'fixed',
                height: '100vh',
                boxShadow: theme === 'dark' ? '10px 0 30px rgba(0,0,0,0.4)' : '10px 0 30px rgba(0,0,0,0.02)'
            }}>
                {/* Logo Section */}
                <div style={{ padding: '1rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{
                        width: '165px',
                        height: '165px',
                        background: 'transparent',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <img src="logo.png" alt="Barangay Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: theme === 'dark' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/180?text=Logo'; }} />
                    </div>
                </div>

                {/* Navigation Section */}
                <nav style={{ flex: 1, padding: '0 1rem', marginTop: '1.5rem', overflowY: 'auto' }}>
                    <div style={{ 
                        paddingLeft: '0.75rem', 
                        marginBottom: '0.75rem', 
                        fontSize: '0.65rem', 
                        fontWeight: '800', 
                        color: 'var(--text-dim)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em',
                        opacity: 0.6
                    }}>
                        Main Menu
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.85rem',
                                    padding: '0.7rem 1rem',
                                    width: '100%',
                                    border: 'none',
                                    background: activePath === item.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                                    color: activePath === item.id ? '#10b981' : 'var(--text-main)',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: activePath === item.id ? '800' : '600',
                                    fontSize: '0.85rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                className="nav-btn"
                            >
                                {activePath === item.id && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        bottom: '20%',
                                        width: '4px',
                                        background: '#10b981',
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                                    }}></div>
                                )}
                                <span style={{ 
                                    opacity: activePath === item.id ? 1 : 0.6, 
                                    color: activePath === item.id ? '#10b981' : 'inherit',
                                    transition: 'transform 0.3s ease',
                                    transform: activePath === item.id ? 'scale(1.1)' : 'scale(1)'
                                }}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                </span>
                                <span style={{ letterSpacing: '0.01em' }}>{item.label}</span>
                            </button>
                        ))}

                        <div style={{ margin: '1rem 0.5rem', height: '1px', background: 'var(--border)', opacity: 0.3 }}></div>

                        <div style={{ 
                            paddingLeft: '0.75rem', 
                            marginBottom: '0.75rem', 
                            fontSize: '0.65rem', 
                            fontWeight: '800', 
                            color: 'var(--text-dim)', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em',
                            opacity: 0.6
                        }}>
                            Preferences
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                padding: '0.7rem 1rem',
                                width: '100%',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            className="nav-btn"
                        >
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: theme === 'light' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                color: theme === 'light' ? '#f59e0b' : '#818cf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s'
                            }}>
                                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            </div>
                            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                padding: '0.7rem 1rem',
                                width: '100%',
                                border: 'none',
                                background: 'rgba(239, 68, 68, 0.05)',
                                color: '#ef4444',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '800',
                                fontSize: '0.85rem',
                                marginTop: '0.5rem'
                            }}
                            className="nav-btn"
                        >
                            <LogOut size={20} />
                            Logout Session
                        </button>
                    </div>
                </nav>

                {/* Developer Credit Footer */}
                <div style={{
                    padding: '0.6rem 1.5rem',
                    borderTop: '1px solid var(--border)',
                    marginTop: 'auto',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Developed By</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: '900', letterSpacing: '0.02em' }}>DANIEL B. LEGUMBRES</p>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>v2.5.0 Premium Edition</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '280px',
                padding: '1rem 3rem',
                maxHeight: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                background: theme === 'dark' ? '#0b1120' : '#f8fafc'
            }}>
                {/* Global Top Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0.5rem 0',
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid var(--border)',
                    flexShrink: 0
                }}>
                    <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {activePath.replace('-', ' ')}
                        </span>
                    </div>

                </header>

                <div style={{ flex: 1 }}>
                    {children}
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '1.25rem'
                }} className="animate-fade-in">
                    <div className="glass-panel" style={{ 
                        width: '100%',
                        maxWidth: '400px',
                        padding: '2rem',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setShowLogoutConfirm(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{ 
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <AlertTriangle size={36} />
                        </div>
                        
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Confirm Logout</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Are you sure you want to log out of the system? Any unsaved changes might be lost.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                className="btn" 
                                onClick={() => setShowLogoutConfirm(false)}
                                style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border)', fontWeight: '700' }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn" 
                                onClick={() => {
                                    setCurrentUser(null);
                                    setShowLogoutConfirm(false);
                                }}
                                style={{ flex: 1, background: 'var(--danger)', border: 'none', color: 'white', fontWeight: '700' }}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
