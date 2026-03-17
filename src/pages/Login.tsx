import React, { useState } from 'react';
import { LogIn, ShieldCheck, User, Lock, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DB } from '../db/localDb';
import '../styles/global.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setCurrentUser, theme, setTheme } = useAppContext();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const users = DB.users.getAll();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            setCurrentUser(user);
        } else {
            setError('The username or password you entered is incorrect. Please try again.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            background: theme === 'dark' ? '#0f172a' : '#f1f5f9',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}>
            <style>{`
                @keyframes slow-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes slow-spin-reverse {
                    from { transform: translate(-50%, -50%) rotate(360deg); }
                    to { transform: translate(-50%, -50%) rotate(0deg); }
                }
                @keyframes soft-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.02); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes mesh-move {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-5%, 5%) rotate(5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .input-field:focus {
                    border-color: var(--primary) !important;
                    background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 1)'} !important;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px -10px rgba(var(--primary-rgb), 0.3) !important;
                }
                .login-card {
                    animation: card-entrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                @keyframes card-entrance {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .btn-primary:active {
                    transform: scale(0.98);
                }
            `}</style>

            {/* Dynamic Mesh Background blobs */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0, pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '10%', right: '15%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 60%)',
                    opacity: theme === 'dark' ? 0.15 : 0.08,
                    filter: 'blur(120px)',
                    animation: 'mesh-move 20s infinite alternate'
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '10%', left: '10%',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, #8b5cf6 0%, transparent 60%)',
                    opacity: theme === 'dark' ? 0.12 : 0.06,
                    filter: 'blur(100px)',
                    animation: 'mesh-move 25s infinite alternate-reverse'
                }}></div>
            </div>

            {/* Barangay Seal Spinning Background Watermark */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '85vw',
                height: '85vw',
                pointerEvents: 'none',
                zIndex: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'slow-spin 80s linear infinite',
                opacity: theme === 'dark' ? 0.1 : 0.05,
            }}>
                <img
                    src="logo.png"
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: theme === 'dark'
                            ? 'brightness(1.5) contrast(1.1) grayscale(0.2)'
                            : 'contrast(1.1) grayscale(0.1)',
                    }}
                />
            </div>

            {/* Extra smaller seal for depth effect */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '60vmin',
                height: '60vmin',
                pointerEvents: 'none',
                zIndex: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'slow-spin 120s linear infinite reverse',
                opacity: theme === 'dark' ? 0.08 : 0.05,
            }}>
                <img
                    src="logo.png"
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: theme === 'dark'
                            ? 'brightness(1.5) contrast(1.1)'
                            : 'contrast(1.1)',
                    }}
                />
            </div>

            {/* Premium Theme Toggle */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '14px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px -5px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {theme === 'light' ?
                        <><Moon size={16} /> Dark</> :
                        <><Sun size={16} /> Light</>
                    }
                </button>
            </div>

            <div className="login-card glass-panel" style={{
                padding: '2.25rem 2rem',
                width: '100%',
                maxWidth: '380px',
                background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '32px',
                boxShadow: theme === 'dark'
                    ? '0 50px 100px -20px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)'
                    : '0 40px 100px -20px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(255,255,255,0.5)',
                zIndex: 1,
                position: 'relative'
            }}>
                {/* Visual Accent Decoration */}
                <div style={{
                    position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                    width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    opacity: 0.5
                }}></div>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        width: '230px',
                        height: '230px',
                        margin: '0 auto 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        animation: 'soft-float 5s ease-in-out infinite'
                    }}>
                        {/* Outer Glow for Logo */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '180px', height: '180px', borderRadius: '50%',
                            background: 'var(--primary)', filter: 'blur(45px)',
                            opacity: 0.2, animation: 'pulse-glow 4s ease-in-out infinite'
                        }}></div>
                        
                        <img src="logo.png" alt="Logo" style={{
                            width: '100%', height: '100%', objectFit: 'contain',
                            filter: theme === 'dark' ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                            position: 'relative', zIndex: 1
                        }} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ 
                            fontSize: '2.2rem', 
                            fontWeight: '900', 
                            color: '#a78bfa', // Violet color
                            margin: 0,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textShadow: '0 0 20px rgba(167, 139, 250, 0.4)'
                        }}>
                            ADMIN
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', marginLeft: '0.5rem' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{
                                position: 'absolute', left: '1rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7
                            }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{
                                    width: '100%', paddingLeft: '3rem', height: '3rem',
                                    borderRadius: '14px',
                                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem', fontWeight: '600'
                                }}
                                placeholder="Admin ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', marginLeft: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{
                                position: 'absolute', left: '1rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7
                            }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{
                                    width: '100%', paddingLeft: '3rem', height: '3rem',
                                    borderRadius: '14px',
                                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.03)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem', fontWeight: '600'
                                }}
                                placeholder="Access Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="animate-shake" style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '0.75rem',
                            borderRadius: '14px',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{
                        marginTop: '0.75rem', height: '3.25rem', borderRadius: '14px',
                        fontSize: '0.9rem', fontWeight: '800',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        boxShadow: '0 10px 25px -5px rgba(var(--primary-rgb), 0.4)',
                        border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                    }}>
                        <LogIn size={18} />
                        Login
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem', paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.7 }}>
                        <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>
                            Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>

            {/* Premium Bottom Credit */}
            <div style={{
                position: 'absolute', bottom: '2rem', left: '0', right: '0',
                textAlign: 'center', pointerEvents: 'none'
            }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', letterSpacing: '0.05em' }}>
                    © 2026 Barangay Tablon • LTIS System v2.0
                </p>
            </div>
        </div>
    );
};

export default Login;
