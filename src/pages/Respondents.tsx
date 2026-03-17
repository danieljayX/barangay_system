import React, { useState } from 'react';
import { Users, Plus, Pencil, FileText, Search, X, User, MapPin, Phone, UserCircle, Hash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Respondent } from '../types';

const Respondents: React.FC = () => {
    const { respondents, setRespondents } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Respondent, 'id'>>({
        name: '', address: '', contact: '', gender: 'Male', age: 30
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setRespondents(respondents.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
            setEditingId(null);
        } else {
            const newRespondent: Respondent = { ...formData, id: Math.random().toString(36).substr(2, 9).toUpperCase() };
            setRespondents([...respondents, newRespondent]);
        }
        setIsAdding(false);
        setFormData({ name: '', address: '', contact: '', gender: 'Male', age: 30 });
    };

    const handleEdit = (r: Respondent) => {
        setFormData({
            name: r.name,
            address: r.address,
            contact: r.contact,
            gender: r.gender,
            age: r.age
        });
        setEditingId(r.id);
        setIsAdding(true);
    };

    const filtered = respondents.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="section-header" style={{ alignItems: 'center' }}>
                <div className="header-title-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}>
                            <Users size={22} />
                        </div>
                        <h1 className="header-title" style={{ fontSize: '2rem', marginBottom: '0' }}>Respondents List</h1>
                    </div>
                    <p className="header-subtitle" style={{ fontSize: '0.9rem', opacity: 0.7 }}>Manage registered respondents and parties.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { if (isAdding) setEditingId(null); setIsAdding(!isAdding); }} style={{ 
                    marginLeft: 'auto',
                    padding: '0 1.25rem', 
                    height: '2.75rem', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    fontSize: '0.85rem', 
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Register Respondent</>}
                </button>
            </div>

        {isAdding ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingId ? 'Edit Respondent Details' : 'New Respondent Registration'}</h3>
                </div>

                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div className="input-group">
                        <label className="label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name (Last Name, First Name MI)" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label">Residential Address</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="House No., Street, Purok, Barangay" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label className="label">Contact Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="09XX-XXX-XXXX" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">Gender</label>
                            <div style={{ position: 'relative' }}>
                                <UserCircle size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <select className="input-field" style={{ paddingLeft: '3rem' }} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="Male" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Male</option>
                                    <option value="Female" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Female</option>
                                    <option value="Other" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">Age</label>
                            <div style={{ position: 'relative' }}>
                                <Hash size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <input type="number" className="input-field" style={{ paddingLeft: '3rem' }} min={1} value={formData.age} onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start', minWidth: '200px' }}>
                        {editingId ? 'Update Information' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        ) : (
            <>
                <div style={{ 
                    padding: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    borderRadius: '16px', 
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-sm)', 
                    border: '1px solid var(--border)', 
                    marginBottom: '1.25rem',
                    maxWidth: '500px'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} size={18} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Pangitaa pinaagi sa ngalan o address..."
                            style={{ paddingLeft: '2.75rem', height: '2.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid var(--border)', background: 'var(--bg-dark)', width: '100%' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                            <thead>
                                 <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Respondent Name</th>
                                    <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Residential Address</th>
                                    <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</th>
                                    <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Info</th>
                                    <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                                        <td style={{ padding: '0.875rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{r.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <span>{r.address}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Phone size={14} style={{ color: '#a855f7' }} />
                                                <span>{r.contact || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontWeight: '800', color: '#a855f7' }}>{r.gender}</span>
                                                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>{r.age} YRS</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button 
                                                    className="btn" 
                                                    style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a855f7', border: '1px solid rgba(139, 92, 246, 0.1)' }} 
                                                    onClick={() => handleEdit(r)}
                                                    title="Edit respondent"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    className="btn" 
                                                    style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.1)' }} 
                                                    title="View case history"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                            <Users size={48} style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Respondents Found</h3>
                            <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto' }}>Try adjusting your search or register a new respondent to the system.</p>
                        </div>
                    )}
                </div>
            </>
        )}
    </div>
);
};

export default Respondents;
