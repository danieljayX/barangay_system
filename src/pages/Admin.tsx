import React from 'react';
import { Shield, Info, Code, User, Building, Database } from 'lucide-react';

const Admin: React.FC = () => {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.1rem' }}>Admin Settings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure system preferences and developer credentials.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {/* Developer Section */}
                <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--primary)', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <Code size={80} color="var(--primary)" />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Code size={18} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>System Developer</h3>
                            <p style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '700' }}>TECH ARCHITECT</p>
                        </div>
                    </div>
                    
                    <div style={{ padding: '0.85rem', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #059669)', padding: '2px' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} style={{ color: 'var(--primary-light)' }} />
                                </div>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '0.9rem', fontWeight: '1000', color: 'var(--text-main)' }}>DANIEL B. LEGUMBRES</h2>
                                <p style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '700' }}>Lead Software Developer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barangay Profile */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <Building size={18} />
                        </div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Barangay Identity</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="input-group">
                            <label className="label" style={{ fontSize: '0.65rem', fontWeight: '700' }}>LGU Official Name</label>
                            <input type="text" className="input-field" defaultValue="Barangay Tablon" style={{ height: '2.25rem', fontSize: '0.8rem' }} />
                        </div>
                        <div className="input-group">
                            <label className="label" style={{ fontSize: '0.65rem', fontWeight: '700' }}>Location</label>
                            <input type="text" className="input-field" defaultValue="Cagayan de Oro City" style={{ height: '2.25rem', fontSize: '0.8rem' }} />
                        </div>
                        <button className="btn btn-primary" style={{ height: '2.25rem', background: 'var(--bg-dark)', border: '1px dashed var(--primary)', color: 'var(--primary-light)', fontSize: '0.75rem', fontWeight: '800' }}>
                            Update Details
                        </button>
                    </div>
                </div>

                {/* System Infrastructure */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <Shield size={18} />
                        </div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Infrastructure</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Database size={14} style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontWeight: '750', fontSize: '0.8rem' }}>Database</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: '800' }}>HEALTHY</span>
                            </div>
                        </div>
                        
                        <div style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={14} style={{ color: 'var(--primary-light)' }} />
                                <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>Version</span>
                            </div>
                            <span style={{ background: 'var(--glass)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800' }}>v2.5.0 STABLE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
