import React, { useState } from 'react';
import { Users, Plus, Pencil, FileText, Search, X, User, MapPin, Phone, UserCircle, Hash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Complainant } from '../types';

const Complainants: React.FC = () => {
    const { complainants, setComplainants } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Complainant, 'id'>>({
        name: '', address: '', contact: '', gender: 'Male', age: 25
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setComplainants(complainants.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
            setEditingId(null);
        } else {
            const newComplainant: Complainant = { ...formData, id: Math.random().toString(36).substr(2, 9).toUpperCase() };
            setComplainants([...complainants, newComplainant]);
        }
        setIsAdding(false);
        setFormData({ name: '', address: '', contact: '', gender: 'Male', age: 25 });
    };

    const handleEdit = (c: Complainant) => {
        setFormData({
            name: c.name,
            address: c.address,
            contact: c.contact,
            gender: c.gender,
            age: c.age
        });
        setEditingId(c.id);
        setIsAdding(true);
    };

    const filtered = complainants.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="section-header" style={{ alignItems: 'center' }}>
                <div className="header-title-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', color: 'var(--primary)' }}>
                            <Users size={22} />
                        </div>
                        <h1 className="header-title" style={{ fontSize: '2rem', marginBottom: '0' }}>Complainants List</h1>
                    </div>
                    <p className="header-subtitle" style={{ fontSize: '0.9rem', opacity: 0.7 }}>Manage registered complainants and primary parties.</p>
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
                    {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Register Complainant</>}
                </button>
            </div>

            {isAdding ? (
                <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingId ? 'Edit Complainant Details' : 'New Complainant Registration'}</h3>
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
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complainant Name</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Residential Address</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Info</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(c => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                                            <td style={{ padding: '0.875rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                <span>{c.address}</span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Phone size={14} style={{ color: 'var(--primary-light)' }} />
                                                    <span>{c.contact || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary-light)' }}>{c.gender}</span>
                                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>{c.age} YRS</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                    <button 
                                                        className="btn" 
                                                        style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.1)' }} 
                                                        onClick={() => handleEdit(c)}
                                                        title="Edit citizen"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn" 
                                                        style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.1)' }} 
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
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Citizens Found</h3>
                                <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto' }}>Try adjusting your search or register a new citizen to the system.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Complainants;
