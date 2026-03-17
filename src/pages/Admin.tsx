import React, { useState } from 'react';
import { Shield, Info, Code, User, Building, Database, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DB } from '../db/localDb';

const Admin: React.FC = () => {
    const { currentUser, setCurrentUser } = useAppContext();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) return;

        if (currentPassword !== currentUser.password) {
            setFeedback({ type: 'error', msg: 'The current password you entered is incorrect.' });
            return;
        }

        if (newPassword.length < 4) {
            setFeedback({ type: 'error', msg: 'New password must be at least 4 characters long.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setFeedback({ type: 'error', msg: 'New passwords do not match.' });
            return;
        }

        // Update in DB
        const allUsers = DB.users.getAll();
        const updatedUsers = allUsers.map(u => 
            u.id === currentUser.id ? { ...u, password: newPassword } : u
        );
        
        DB.users.save(updatedUsers);
        
        const updatedCurrentUser = { ...currentUser, password: newPassword };
        DB.users.setSession(updatedCurrentUser);
        setCurrentUser(updatedCurrentUser);

        setFeedback({ type: 'success', msg: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            setFeedback(null);
            setIsChangingPassword(false);
        }, 2000);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.01rem' }}>Admin Settings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>System preferences and credentials.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                {/* Developer Section - Premium Digital ID Style */}
                <div className="glass-panel" style={{ 
                    padding: '0.6rem', 
                    border: '1px solid var(--primary)', 
                    background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.01))', 
                    position: 'relative', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ position: 'absolute', top: '-5px', right: '-5px', opacity: 0.08, transform: 'rotate(-10deg)' }}>
                        <Shield size={50} color="var(--primary)" />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', position: 'relative' }}>
                        <div style={{ 
                            width: '24px', height: '24px', borderRadius: '5px', 
                            background: 'var(--primary)', color: 'white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Code size={12} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-main)' }}>System Developer</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.5rem', color: 'var(--primary-light)', fontWeight: '800' }}>ARCHITECT</span>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'white' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ 
                        padding: '0.6rem', 
                        background: 'rgba(15, 23, 42, 0.4)', 
                        borderRadius: '10px', 
                        border: '1px solid rgba(16, 185, 129, 0.12)',
                        backdropFilter: 'blur(4px)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ 
                                width: '36px', height: '36px', borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--primary), #059669)', 
                                padding: '1.5px'
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <User size={18} style={{ color: 'var(--primary-light)' }} />
                                </div>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '0.75rem', fontWeight: '1000', color: 'var(--text-main)', marginBottom: '0.05rem', lineHeight: 1.1 }}>
                                    DANIEL B. LEGUMBRES
                                </h2>
                                <p style={{ fontSize: '0.55rem', color: 'var(--primary-light)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                    Lead Developer
                                </p>
                                <p style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontStyle: 'italic', fontWeight: '600' }}>
                                    "Precision Engineering."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Security (Change Password) */}
                <div className="glass-panel" style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ 
                            width: '24px', height: '24px', borderRadius: '5px', 
                            background: 'var(--glass)', color: '#a78bfa', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border)'
                        }}>
                            <Lock size={12} />
                        </div>
                        <h3 style={{ fontSize: '0.7rem', fontWeight: '900' }}>Security</h3>
                    </div>

                    {!isChangingPassword ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', border: '1px dashed var(--border)', borderRadius: '10px', padding: '0.75rem' }}>
                            <p style={{ fontSize: '0.55rem', color: 'var(--text-dim)', textAlign: 'center', fontWeight: '600' }}>Password hidden.</p>
                            <button 
                                onClick={() => setIsChangingPassword(true)}
                                className="btn btn-primary" 
                                style={{ width: '100%', height: '1.9rem', fontSize: '0.7rem', fontWeight: '900' }}
                            >
                                <Lock size={10} style={{ marginRight: '4px' }} /> Update
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div className="input-group">
                                <label className="label" style={{ fontSize: '0.5rem', fontWeight: '800', color: 'var(--text-dim)' }}>CURRENT</label>
                                <input 
                                    type="password" 
                                    className="input-field" 
                                    placeholder="••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    style={{ height: '1.7rem', fontSize: '0.7rem' }} 
                                    required
                                />
                            </div>
                            <div className="input-group" style={{ display: 'flex', gap: '0.3rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label" style={{ fontSize: '0.5rem', fontWeight: '800', color: 'var(--text-dim)' }}>NEW</label>
                                    <input 
                                        type="password" 
                                        className="input-field" 
                                        placeholder="••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ height: '1.7rem', fontSize: '0.7rem' }} 
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label" style={{ fontSize: '0.5rem', fontWeight: '800', color: 'var(--text-dim)' }}>CONFIRM</label>
                                    <input 
                                        type="password" 
                                        className="input-field" 
                                        placeholder="••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ height: '1.7rem', fontSize: '0.7rem' }} 
                                        required
                                    />
                                </div>
                            </div>

                            {feedback && (
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.2rem', 
                                    padding: '0.3rem', borderRadius: '5px',
                                    background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                    border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                                    color: feedback.type === 'success' ? '#10b981' : '#ef4444',
                                    fontSize: '0.55rem', fontWeight: '700'
                                }}>
                                    {feedback.type === 'success' ? <CheckCircle size={9} /> : <AlertCircle size={9} />}
                                    {feedback.msg}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '1.9rem', fontSize: '0.65rem', fontWeight: '900' }}>
                                    Save
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setFeedback(null);
                                    }}
                                    className="btn" 
                                    style={{ flex: 1, height: '1.9rem', fontSize: '0.65rem', fontWeight: '800', background: 'var(--bg-dark)', border: '1px solid var(--border)' }}
                                >
                                    No
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Barangay Profile */}
                <div className="glass-panel" style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: 'var(--glass)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <Building size={12} />
                        </div>
                        <h3 style={{ fontSize: '0.7rem', fontWeight: '900' }}>Identity</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                        <div className="input-group">
                            <label className="label" style={{ fontSize: '0.5rem', fontWeight: '800', color: 'var(--text-dim)' }}>OFFICIAL NAME</label>
                            <input type="text" className="input-field" defaultValue="Barangay Tablon" style={{ height: '1.7rem', fontSize: '0.7rem' }} />
                        </div>
                        <div className="input-group">
                            <label className="label" style={{ fontSize: '0.5rem', fontWeight: '800', color: 'var(--text-dim)' }}>LOCATION</label>
                            <input type="text" className="input-field" defaultValue="Cagayan de Oro City" style={{ height: '1.7rem', fontSize: '0.7rem' }} />
                        </div>
                        <button className="btn" style={{ height: '1.9rem', background: 'var(--bg-dark)', border: '1px dashed var(--primary)', color: 'var(--primary-light)', fontSize: '0.6rem', fontWeight: '800', marginTop: 'auto' }}>
                            Apply
                        </button>
                    </div>
                </div>

                {/* System Infrastructure */}
                <div className="glass-panel" style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: 'var(--glass)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <Shield size={12} />
                        </div>
                        <h3 style={{ fontSize: '0.7rem', fontWeight: '900' }}>System</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, justifyContent: 'center' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Database size={10} style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '800', fontSize: '0.6rem' }}>Local DB</span>
                                </div>
                                <span style={{ fontSize: '0.5rem', color: 'var(--success)', fontWeight: '900' }}>ONLINE</span>
                            </div>
                        </div>
                        
                        <div style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Info size={10} style={{ color: 'var(--primary-light)' }} />
                                <span style={{ fontWeight: '800', fontSize: '0.6rem' }}>Version</span>
                            </div>
                            <span style={{ background: 'var(--glass)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.55rem', fontWeight: '900', border: '1px solid var(--border)' }}>v2.5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
