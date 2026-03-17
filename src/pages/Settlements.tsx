import React, { useState } from 'react';
import { CheckSquare, Trash2, FileCheck, X, ChevronRight, Calendar, Search, Pencil, Printer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Settlement, Case } from '../types';
import { getKPForm16Template } from '../utils/kpFormTemplates';

interface SettlementsProps {
    onNavigate?: (path: string) => void;
}

const Settlements: React.FC<SettlementsProps> = ({ onNavigate }) => {
    const { settlements, setSettlements, cases, setCases } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Settlement, 'id'>>({
        caseId: '',
        agreementDetails: '',
        settlementDate: new Date().toISOString().split('T')[0],
        result: 'Settled'
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.caseId) return;

        if (editingId) {
            setSettlements(settlements.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
            setEditingId(null);
        } else {
            const newSettlement: Settlement = { ...formData, id: Math.random().toString(36).substr(2, 9).toUpperCase() };
            setSettlements([...settlements, newSettlement]);
            
            // Mark the case as Settled
            setCases(cases.map((c: Case) => c.id === formData.caseId ? { ...c, status: 'Settled' } : c));
        }

        setIsAdding(false);
        setFormData({
            caseId: '',
            agreementDetails: '',
            settlementDate: new Date().toISOString().split('T')[0],
            result: 'Settled'
        });
    };

    const handleEdit = (s: Settlement) => {
        setFormData({
            caseId: s.caseId,
            agreementDetails: s.agreementDetails,
            settlementDate: s.settlementDate,
            result: s.result
        });
        setEditingId(s.id);
        setIsAdding(true);
    };

    const handlePrintSettlement = (s: Settlement) => {
        const caseData = cases.find(c => c.id === s.caseId);
        if (!caseData) {
            alert("Case data not found for this settlement.");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = getKPForm16Template(caseData, s.agreementDetails);
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    const filteredSettlements = settlements.filter((s: Settlement) =>
        s.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.agreementDetails.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.15rem' }}>Settled Case Documents</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Official records and agreements for resolved cases.</p>
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
                    {isAdding ? <><X size={16} /> Cancel</> : <><CheckSquare size={16} /> Register New Agreement</>}
                </button>
            </header>

            {isAdding ? (
                <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileCheck size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Official Agreement Registration</h3>
                    </div>

                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="input-group">
                            <label className="label">Select Case to Finalize</label>
                            <select className="input-field" required value={formData.caseId} onChange={e => setFormData(prev => ({ ...prev, caseId: e.target.value }))}>
                                <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select case to finalize...</option>
                                {cases.filter((c: Case) => c.status !== 'Settled').map((c: Case) => (
                                    <option key={c.id} value={c.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                                        Case #{c.id.slice(0, 8)} - {c.complaintType}
                                    </option>
                                ))}
                            </select>
                            {cases.filter((c: Case) => c.status !== 'Settled').length === 0 && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.5rem', fontWeight: '600' }}>
                                    ⚠️ No active cases for settlement. Please <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onNavigate?.('cases')}>file a case</span> first.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="input-group">
                                <label className="label">Settlement Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                    <input type="date" className="input-field" style={{ paddingLeft: '3rem' }} required value={formData.settlementDate} onChange={e => setFormData(prev => ({ ...prev, settlementDate: e.target.value }))} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="label">Resolution Type</label>
                                <select className="input-field" value={formData.result} onChange={e => setFormData(prev => ({ ...prev, result: e.target.value as 'Settled' | 'Unresolved' }))}>
                                    <option value="Settled" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Settled (Amicable Agreement)</option>
                                    <option value="Unresolved" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Unresolved (Escalate to Court)</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Agreement Terms and Details</label>
                            <textarea 
                                className="input-field" 
                                style={{ height: '150px', resize: 'vertical', minHeight: '100px' }} 
                                required 
                                value={formData.agreementDetails} 
                                onChange={e => setFormData(prev => ({ ...prev, agreementDetails: e.target.value }))} 
                                placeholder="Enter terms agreed upon by both parties..." 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start', minWidth: '220px' }}>
                            {editingId ? 'Update Settlement Record' : 'Finalize Agreement Document'}
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
                                placeholder="Search settlement records..."
                                style={{ paddingLeft: '2.75rem', height: '2.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid var(--border)', background: 'var(--bg-dark)', width: '100%' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                                <thead>
                                      <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case ID</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agreement Date</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agreement Points</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Decision</th>
                                        <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSettlements.map((s: Settlement) => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                                            <td style={{ padding: '0.875rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                                                        <FileCheck size={16} />
                                                    </div>
                                                    <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>#{s.caseId.slice(0, 8)}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.875rem 1.25rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                                {new Date(s.settlementDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.25rem' }}>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {s.agreementDetails}
                                                </p>
                                            </td>
                                            <td style={{ padding: '0.875rem 1.25rem' }}>
                                                <span style={{
                                                    padding: '0.3rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: s.result === 'Settled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: s.result === 'Settled' ? 'var(--success)' : '#fca5a5',
                                                    border: `1px solid ${s.result === 'Settled' ? 'var(--success)' : 'rgba(239,68,68,0.2)'}20`
                                                }}>
                                                    {s.result}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                    <button 
                                                        className="btn" 
                                                        style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.1)' }} 
                                                        title="Edit Settlement"
                                                        onClick={() => handleEdit(s)}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn" 
                                                        style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.1)' }} 
                                                        title="Print Official Form"
                                                        onClick={() => handlePrintSettlement(s)}
                                                    >
                                                        <Printer size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredSettlements.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                                <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>No settlement records found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Settlements;
