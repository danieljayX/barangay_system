import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, MessageSquare, Trash2, X, ChevronRight, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Hearing } from '../types';

interface HearingsProps {
    onNavigate?: (path: string) => void;
}

const Hearings: React.FC<HearingsProps> = ({ onNavigate }) => {
    const { hearings, setHearings, cases } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Omit<Hearing, 'id'>>({
        caseId: '',
        hearingDate: new Date().toISOString().split('T')[0],
        hearingTime: '09:00',
        luponMember: '',
        notes: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.caseId) return;
        const newHearing: Hearing = { ...formData, id: Math.random().toString(36).substr(2, 9).toUpperCase() };
        setHearings([...hearings, newHearing]);
        setIsAdding(false);
        setFormData({
            caseId: '',
            hearingDate: new Date().toISOString().split('T')[0],
            hearingTime: '09:00',
            luponMember: '',
            notes: ''
        });
    };

    const getCaseDetails = (id: string) => cases.find(c => c.id === id);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.15rem' }}>Mediation Hearings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule and manage mediation sessions.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ 
                    padding: '0 1.25rem', 
                    height: '2.75rem', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Schedule Hearing</>}
                </button>
            </header>

            {isAdding ? (
                <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '700px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>New Hearing Schedule</h3>
                    </div>

                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div className="input-group">
                            <label className="label">Select Active Case</label>
                            <select className="input-field" required value={formData.caseId} onChange={e => setFormData({ ...formData, caseId: e.target.value })}>
                                <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select case for mediation...</option>
                                {cases.filter(c => c.status !== 'Settled').map(c => (
                                    <option key={c.id} value={c.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                                        Ref: {c.id.slice(0, 8)} - {c.complaintType}
                                    </option>
                                ))}
                            </select>
                            {cases.filter(c => c.status !== 'Settled').length === 0 && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.5rem', fontWeight: '600' }}>
                                    ⚠️ No active cases found. Please <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onNavigate?.('cases')}>register a case</span> first.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="label">Hearing Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                    <input type="date" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.hearingDate} onChange={e => setFormData({ ...formData, hearingDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="label">Hearing Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                    <input type="time" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.hearingTime} onChange={e => setFormData({ ...formData, hearingTime: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Mediator (Lupon Member)</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.luponMember} onChange={e => setFormData({ ...formData, luponMember: e.target.value })} placeholder="Full name of assigned official" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Session Notes and Remarks</label>
                            <textarea className="input-field" style={{ height: '100px', resize: 'none' }} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional instructions..." />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Confirm and Schedule Session</button>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {hearings.map(h => {
                        const caseData = getCaseDetails(h.caseId);
                        const isToday = new Date(h.hearingDate).toDateString() === new Date().toDateString();

                        return (
                            <div key={h.id} className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', border: isToday ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isToday ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isToday ? 'var(--primary)' : 'var(--glass)', color: isToday ? 'white' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session ID</span>
                                            <p style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.85rem' }}>#{h.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setHearings(hearings.filter(x => x.id !== h.id))} className="btn-hover-effect" style={{ background: 'rgba(239, 68, 68, 0.05)', border: 'none', color: '#fca5a5', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{caseData?.complaintType || 'Unknown Dispute'}</h3>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Linked Case: <span style={{ color: 'var(--primary-light)', fontWeight: '600' }}>#{h.caseId.slice(0, 8)}</span></p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                <Calendar size={16} style={{ color: 'var(--primary-light)' }} />
                                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{new Date(h.hearingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                <Clock size={16} style={{ color: 'var(--primary-light)' }} />
                                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{h.hearingTime}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <User size={16} style={{ color: 'var(--primary-light)' }} />
                                            <span>Mediator: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{h.luponMember}</span></span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={16} style={{ color: 'var(--primary-light)' }} />
                                            <span>Location: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Barangay Session Hall</span></span>
                                        </div>
                                    </div>

                                    {h.notes && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>
                                                <MessageSquare size={14} />
                                                <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Session Notes</span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{h.notes}</p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isToday ? 'var(--primary-light)' : 'var(--text-dim)' }}>
                                        {isToday ? 'Hearing Today' : 'Upcoming Hearing'}
                                    </span>
                                    <button className="btn-hover-effect" style={{ background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.8125rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                        Prepare Entry <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {hearings.length === 0 && (
                        <div style={{ gridColumn: '1/-1', padding: '5rem 2rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '24px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-dim)' }}>
                                <Calendar size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Hearings Scheduled</h3>
                            <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto' }}>All mediation sessions are up to date. Start by scheduling a new hearing for pending cases.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Hearings;
