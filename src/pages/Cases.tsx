import React, { useState } from 'react';
import { Plus, Search, Pencil, Filter, FileText, Eye, X, CheckCircle, Printer, CalendarDays, MapPin, Phone, FolderCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Case, CaseStatus } from '../types';
import { getKPForm7Template, getKPForm16Template } from '../utils/kpFormTemplates';

const Cases: React.FC = () => {
    const { cases, setCases, hearings, complainants, respondents } = useAppContext();

    const handlePrintLogbook = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const filteredForPrint = cases.filter((c: Case) => {
            const matchesSearch = c.complainantName ? c.complainantName.toLowerCase().includes(filter.search.toLowerCase()) : false;
            const matchesStatus = filter.status === 'All' || c.status === filter.status as CaseStatus;
            const matchesMonth = filter.month === 'All' || new Date(c.dateFiled).getMonth().toString() === filter.month;
            const matchesYear = filter.year === 'All' || new Date(c.dateFiled).getFullYear().toString() === filter.year;
            return matchesSearch && matchesStatus && matchesMonth && matchesYear;
        });

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const selectedYear = filter.year !== 'All' ? filter.year : new Date().getFullYear().toString();
        const monthText = filter.month !== 'All' ? ` FOR ${monthNames[parseInt(filter.month)].toUpperCase()} ${selectedYear}` : ` FOR ${selectedYear}`;

        const formatTime = (time: string) => {
            if (!time) return '';
            try {
                const [hours, minutes] = time.split(':');
                const hourNum = parseInt(hours);
                const ampm = hourNum >= 12 ? 'PM' : 'AM';
                const hour12 = hourNum % 12 || 12;
                return `${hour12}:${minutes} ${ampm}`;
            } catch (e) {
                return time;
            }
        };

        const rows = (filteredForPrint || []).map(c => `
            <tr>
                <td>${new Date(c.dateFiled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${c.timeFiled ? '<br/><span style="color:#888">' + formatTime(c.timeFiled) + '</span>' : ''}</td>
                <td>${c.docketNo ? 'Docket: ' + c.docketNo : '---'}${c.officialReceipt ? '<br/>O.R.: ' + c.officialReceipt : ''}</td>
                <td><strong>${c.complainantName || '---'}</strong>${c.complainantAddress ? '<br/><span style="color:#777;font-size:9px">' + c.complainantAddress + '</span>' : ''}</td>
                <td><strong>${c.respondentName || '---'}</strong>${c.respondentAddress ? '<br/><span style="color:#777;font-size:9px">' + c.respondentAddress + '</span>' : ''}</td>
                <td>${c.complaintType}</td>
                <td><span style="padding:4px 8px;border-radius:6px;background:${c.status === 'Settled' ? '#d1fae5' : c.status === 'Ongoing' ? '#e0e7ff' : '#fef3c7'};color:${c.status === 'Settled' ? '#065f46' : c.status === 'Ongoing' ? '#3730a3' : '#92400e'};font-weight:bold;font-size:9px">${c.status}</span></td>
                <td>${c.dispositionDate ? new Date(c.dispositionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</td>
                <td>${c.remarksComplainant || c.remarksRespondent || '---'}</td>
            </tr>
        `).join('');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Logbook of Case - Barangay Tablon</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px 40px; color: #000; }
                    .print-header { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid #3d6b4d; padding-bottom: 15px; }
                    .print-header img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 5px; }
                    .print-header-text { text-align: center; }
                    .header-top { font-size: 11px; margin: 0; color: #444; }
                    .header-main { font-size: 18px; font-weight: 800; margin: 2px 0; text-transform: uppercase; color: #000; }
                    .header-sub { font-size: 13px; font-weight: 600; margin: 0; color: #333; }
                    .title-box { margin-top: 15px; text-align: center; }
                    .title-box h1 { font-size: 20px; text-transform: uppercase; margin: 0; color: #1a1a1a; letter-spacing: 1px; }
                    p.date { text-align: right; font-size: 10px; margin: 10px 0; color: #666; font-style: italic; }
                    table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 10px; }
                    th { background: #3d6b4d; color: white; padding: 12px 8px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.5px; }
                    td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; line-height: 1.4; }
                    tr:nth-child(even) td { background: #f9fafb; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <img src="logo.png" alt="Barangay Seal" />
                    <div class="print-header-text">
                        <p class="header-top">Republic of the Philippines</p>
                        <p class="header-top">Province of Misamis Oriental</p>
                        <p class="header-top">City of Cagayan de Oro</p>
                        <p class="header-main">BARANGAY TABLON</p>
                        <p class="header-sub">OFFICE OF THE LUPONG TAGAPAMAYAPA</p>
                    </div>
                    <div class="title-box">
                        <h1>LOGBOOK OF CASE${monthText}</h1>
                        <p style="margin: 2px 0; font-size: 11px; color: #555;">Official Barangay Records</p>
                    </div>
                </div>
                <p class="date">Date Printed: ${new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 12%">Date & Time Filed</th>
                            <th style="width: 12%">Docket No. / O.R. #</th>
                            <th style="width: 18%">Complainant</th>
                            <th style="width: 18%">Respondent</th>
                            <th style="width: 15%">Nature of Complaint</th>
                            <th style="width: 8%">Status</th>
                            <th style="width: 10%">Disposition</th>
                            <th style="width: 7%">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    const handlePrintKPForm = (c: Case, type: 'summon' | 'settlement') => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let remark = '';
        if (type === 'summon') {
            remark = prompt("Enter specific remark for this Summon (optional):") || '';
        } else {
            // Check if there's an existing settlement remark
            remark = prompt("Enter Agreement Details for this Settlement:", c.remarksRespondent || c.remarksComplainant || '') || '';
        }

        const html = type === 'summon' ? getKPForm7Template(c, remark) : getKPForm16Template(c, remark);
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState({ search: '', status: 'All', month: 'All', year: 'All' });
    const [viewingCase, setViewingCase] = useState<Case | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<Case, 'id'>>({
        docketNo: '',
        officialReceipt: '',
        complainantId: '',
        complainantName: '',
        complainantAddress: '',
        complainantAge: '',
        complainantContact: '',
        respondentId: '',
        respondentName: '',
        respondentAddress: '',
        respondentAge: '',
        respondentContact: '',
        complaintType: '',
        description: '',
        incidentLocation: '',
        dateFiled: new Date().toISOString().split('T')[0],
        timeFiled: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        dispositionDate: '',
        remarksComplainant: '',
        remarksRespondent: '',
        status: 'Pending'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.complainantName || !formData.respondentName || !formData.complaintType || !formData.description) {
            setError('Please complete all required information before submitting.');
            return;
        }

        // Auto-resolve typed names to existing IDs if possible
        let finalComplainantId = formData.complainantId;
        const existingComplainant = complainants.find(c => c.name.toLowerCase() === formData.complainantName.toLowerCase() || c.id === formData.complainantId);
        if (existingComplainant) finalComplainantId = existingComplainant.id;

        let finalRespondentId = formData.respondentId;
        const existingRespondent = respondents.find(r => r.name.toLowerCase() === formData.respondentName.toLowerCase() || r.id === formData.respondentId);
        if (existingRespondent) finalRespondentId = existingRespondent.id;

        if (editingId) {
            setCases(cases.map(c => c.id === editingId ? { ...formData, id: editingId, complainantId: finalComplainantId, respondentId: finalRespondentId } : c));
            setEditingId(null);
        } else {
            const newCase: Case = { 
                ...formData, 
                complainantId: finalComplainantId,
                respondentId: finalRespondentId,
                id: 'CASE-' + Math.random().toString(36).substr(2, 6).toUpperCase() 
            };
            setCases([...cases, newCase]);
        }
        
        setIsAdding(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        
        setFormData({
            docketNo: '',
            officialReceipt: '',
            complainantId: '',
            complainantName: '',
            complainantAddress: '',
            complainantAge: '',
            complainantContact: '',
            respondentId: '',
            respondentName: '',
            respondentAddress: '',
            respondentAge: '',
            respondentContact: '',
            complaintType: '',
            description: '',
            incidentLocation: '',
            dateFiled: new Date().toISOString().split('T')[0],
            timeFiled: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).replace(/^0/, ''),
            dispositionDate: '',
            remarksComplainant: '',
            remarksRespondent: '',
            status: 'Pending'
        });
    };

    const handleEdit = (c: Case) => {
        setFormData({
            docketNo: c.docketNo || '',
            officialReceipt: c.officialReceipt || '',
            complainantId: c.complainantId || '',
            complainantName: c.complainantName || '',
            complainantAddress: c.complainantAddress || '',
            complainantAge: c.complainantAge || '',
            complainantContact: c.complainantContact || '',
            respondentId: c.respondentId || '',
            respondentName: c.respondentName || '',
            respondentAddress: c.respondentAddress || '',
            respondentAge: c.respondentAge || '',
            respondentContact: c.respondentContact || '',
            complaintType: c.complaintType,
            description: c.description,
            incidentLocation: c.incidentLocation,
            dateFiled: c.dateFiled,
            timeFiled: c.timeFiled || '',
            dispositionDate: c.dispositionDate || '',
            remarksComplainant: c.remarksComplainant || '',
            remarksRespondent: c.remarksRespondent || '',
            status: c.status
        });
        setEditingId(c.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
 
    const handleUpdateStatus = (caseId: string, newStatus: CaseStatus) => {
        setCases(cases.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
        if (viewingCase && viewingCase.id === caseId) {
            setViewingCase({ ...viewingCase, status: newStatus });
        }
    };

    const filtered = cases.filter((c: Case) => {
        const matchesSearch = c.complainantName ? c.complainantName.toLowerCase().includes(filter.search.toLowerCase()) : false;
        const matchesStatus = filter.status === 'All' || c.status === filter.status as CaseStatus;
        const matchesMonth = filter.month === 'All' || new Date(c.dateFiled).getMonth().toString() === filter.month;
        const matchesYear = filter.year === 'All' || new Date(c.dateFiled).getFullYear().toString() === filter.year;
        return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
            {/* Ambient Atmosphere */}
            <div style={{
                position: 'fixed',
                top: '5%',
                right: '5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
            
            <div style={{
                position: 'fixed',
                bottom: '10%',
                left: '2%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div className="section-header" style={{ alignItems: 'center' }}>
                <div className="header-title-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <FolderCheck size={28} />
                        </div>
                        <h1 className="header-title" style={{ fontSize: '2.5rem', marginBottom: '0' }}>Case Management</h1>
                    </div>
                    <p className="header-subtitle" style={{ fontSize: '1.1rem', opacity: 0.8 }}>Efficiently track, organize, and resolve barangay legal matters.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', alignItems: 'center' }}>
                    {!isAdding && (
                        <button className="btn btn-ghost" onClick={handlePrintLogbook} style={{ padding: '0 1.25rem', height: '2.75rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem' }}>
                            <Printer size={16} /> Print Logbook
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => { if (isAdding) setEditingId(null); setIsAdding(!isAdding); }} style={{ padding: '0 1.5rem', height: '2.75rem', borderRadius: '12px', fontWeight: '800', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.2)', border: 'none' }}>
                        {isAdding ? <><X size={18} /> Cancel Process</> : <><Plus size={18} /> Create New Case</>}
                    </button>
                </div>
            </div>

            {isAdding ? (
                <div className="animate-fade-in" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{
                        background: '#3d6b4d',
                        padding: '0.4rem 1rem',
                        textAlign: 'center',
                        color: 'white',
                    }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                            Case Logbook
                        </h2>
                    </div>

                    <div style={{ padding: '1rem' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Docket No</label>
                                    <input type="text" className="input-field" 
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.docketNo} onChange={e => setFormData({ ...formData, docketNo: e.target.value })} 
                                        placeholder="Docket #" />
                                </div>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Receipt (O.R.)</label>
                                    <input type="text" className="input-field" 
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.officialReceipt} onChange={e => setFormData({ ...formData, officialReceipt: e.target.value })} 
                                        placeholder="O.R. #" />
                                </div>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Date Filed</label>
                                    <input type="date" className="input-field" required
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.dateFiled} onChange={e => setFormData({ ...formData, dateFiled: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Time Filed</label>
                                    <input type="time" className="input-field" 
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.timeFiled} onChange={e => setFormData({ ...formData, timeFiled: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>

                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#3d6b4d', marginBottom: '0.5rem' }}>Names of Parties</h3>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ borderRight: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                                        <div style={{ padding: '0.4rem 0.75rem', background: 'rgba(0,0,0,0.05)', fontWeight: '800', color: 'var(--text-main)', fontSize: '0.75rem' }}>COMPLAINANT</div>
                                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div className="input-group">
                                                <label className="label" style={{ fontSize: '0.65rem', fontWeight: '800', marginBottom: '0.1rem' }}>NAME</label>
                                                <input list="complainants-list" className="input-field" required
                                                    style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                    value={formData.complainantName} onChange={e => {
                                                        const name = e.target.value;
                                                        const existing = complainants.find((c: any) => c.name === name);
                                                        setFormData({ 
                                                            ...formData, 
                                                            complainantName: name,
                                                            complainantAddress: existing ? existing.address : formData.complainantAddress,
                                                            complainantAge: existing ? String(existing.age) : formData.complainantAge,
                                                            complainantContact: existing ? existing.contact : formData.complainantContact
                                                        });
                                                    }}
                                                    placeholder="Name" />
                                                <input type="text" className="input-field" 
                                                    style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', marginTop: '0.3rem', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                    value={formData.complainantAddress} onChange={e => setFormData({ ...formData, complainantAddress: e.target.value })}
                                                    placeholder="Address" />
                                            </div>
                                            <div className="input-group">
                                                <label className="label" style={{ fontSize: '0.65rem', fontWeight: '800', marginBottom: '0.1rem' }}>AGE & CONTACT</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.4rem' }}>
                                                    <input type="text" className="input-field"
                                                        style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                        value={formData.complainantAge} onChange={e => setFormData({ ...formData, complainantAge: e.target.value })}
                                                        placeholder="Age" />
                                                    <input type="text" className="input-field"
                                                        style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                        value={formData.complainantContact} onChange={e => setFormData({ ...formData, complainantContact: e.target.value })}
                                                        placeholder="Cellphone #" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.02)' }}>
                                        <div style={{ padding: '0.4rem 0.75rem', background: 'rgba(0,0,0,0.05)', fontWeight: '800', color: 'var(--text-main)', fontSize: '0.75rem' }}>RESPONDENT</div>
                                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div className="input-group">
                                                <label className="label" style={{ fontSize: '0.65rem', fontWeight: '800', marginBottom: '0.1rem' }}>NAME</label>
                                                <input list="respondents-list" className="input-field" required
                                                    style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                    value={formData.respondentName} onChange={e => {
                                                        const name = e.target.value;
                                                        const existing = respondents.find((r: any) => r.name === name);
                                                        setFormData({ 
                                                            ...formData, 
                                                            respondentName: name,
                                                            respondentAddress: existing ? existing.address : formData.respondentAddress,
                                                            respondentAge: existing ? String(existing.age) : formData.respondentAge,
                                                            respondentContact: existing ? existing.contact : formData.respondentContact
                                                        });
                                                    }}
                                                    placeholder="Name" />
                                                <input type="text" className="input-field" 
                                                    style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', marginTop: '0.3rem', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                    value={formData.respondentAddress} onChange={e => setFormData({ ...formData, respondentAddress: e.target.value })}
                                                    placeholder="Address" />
                                            </div>
                                            <div className="input-group">
                                                <label className="label" style={{ fontSize: '0.65rem', fontWeight: '800', marginBottom: '0.1rem' }}>AGE & CONTACT</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.4rem' }}>
                                                    <input type="text" className="input-field"
                                                        style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                        value={formData.respondentAge} onChange={e => setFormData({ ...formData, respondentAge: e.target.value })}
                                                        placeholder="Age" />
                                                    <input type="text" className="input-field"
                                                        style={{ height: '2.3rem', padding: '0 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)' }}
                                                        value={formData.respondentContact} onChange={e => setFormData({ ...formData, respondentContact: e.target.value })}
                                                        placeholder="Cellphone #" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Nature of Case</label>
                                    <select className="input-field" required
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.complaintType} onChange={e => setFormData({ ...formData, complaintType: e.target.value })}>
                                        <option value="">Select Nature</option>
                                        <option value="Debt Dispute">Debt Dispute</option>
                                        <option value="Boundary Dispute">Boundary Dispute</option>
                                        <option value="Property Damage">Property Damage</option>
                                        <option value="Noise Complaint">Noise Complaint</option>
                                        <option value="Harassment">Harassment</option>
                                        <option value="Threat">Threat</option>
                                        <option value="Oral Defamation">Oral Defamation</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Disposition (Due Date)</label>
                                    <input type="date" className="input-field"
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.dispositionDate} onChange={e => setFormData({ ...formData, dispositionDate: e.target.value })} />
                                </div>
                            </div>

                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Remarks (Complainant side)</label>
                                    <input type="text" className="input-field"
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.remarksComplainant} onChange={e => setFormData({ ...formData, remarksComplainant: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>Remarks (Respondent side)</label>
                                    <input type="text" className="input-field"
                                        style={{ height: '2.2rem', padding: '0 0.75rem', borderRadius: '6px', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-main)' }}
                                        value={formData.remarksRespondent} onChange={e => setFormData({ ...formData, remarksRespondent: e.target.value })} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>Detailed Facts / Description</label>
                                <textarea className="input-field"
                                    style={{ height: '80px', resize: 'none', borderRadius: '8px', padding: '0.6rem', background: 'var(--bg-darker)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                                    required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter full description of the dispute..." />
                            </div>

                            {error && (
                                <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                                <button type="submit" className="btn" style={{ 
                                    padding: '0.5rem 2.5rem', 
                                    borderRadius: '8px', 
                                    fontSize: '0.9rem', 
                                    fontWeight: '800', 
                                    background: '#3d6b4d',
                                    color: 'white',
                                    border: 'none',
                                    boxShadow: '0 6px 12px rgba(61, 107, 77, 0.2)'
                                }}>
                                    {editingId ? 'Update Case' : 'Save Case'}
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} style={{ padding: '0 1.25rem', fontWeight: '700', fontSize: '0.85rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ 
                        padding: '0.75rem', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center', 
                        borderRadius: '16px', 
                        background: 'var(--bg-card)',
                        boxShadow: 'var(--shadow-sm)', 
                        border: '1px solid var(--border)', 
                        marginBottom: '1rem',
                        gap: '1rem'
                    }}>
                        <div style={{ flex: 1, position: 'relative', maxWidth: '450px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ 
                                    paddingLeft: '2.75rem', 
                                    height: '2.75rem', 
                                    borderRadius: '12px', 
                                    fontSize: '0.9rem', 
                                    fontWeight: '600',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-dark)',
                                    width: '100%'
                                }}
                                placeholder="Pangitaa pinaagi sa complainant o kinaiyahan..."
                                value={filter.search}
                                onChange={e => setFilter({ ...filter, search: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                background: 'var(--bg-dark)',
                                height: '2.75rem', 
                                padding: '0 1rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }} className="filter-chip">
                                <CalendarDays size={16} style={{ color: 'var(--success)' }} />
                                <select
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: 'var(--text-main)', 
                                        outline: 'none', 
                                        fontSize: '0.85rem', 
                                        fontWeight: '700', 
                                        cursor: 'pointer'
                                    }}
                                    value={filter.month}
                                    onChange={e => setFilter({ ...filter, month: e.target.value })}
                                >
                                    <option value="All" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>📅 All Months</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                                        <option key={m} value={i.toString()} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                background: 'var(--bg-dark)',
                                height: '2.75rem', 
                                padding: '0 1rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }} className="filter-chip">
                                 <CalendarDays size={16} style={{ color: 'var(--primary)' }} />
                                 <select
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: 'var(--text-main)', 
                                        outline: 'none', 
                                        fontSize: '0.85rem', 
                                        fontWeight: '700', 
                                        cursor: 'pointer'
                                    }}
                                    value={filter.year}
                                    onChange={e => setFilter({ ...filter, year: e.target.value })}
                                 >
                                    <option value="All" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>📅 All Years</option>
                                    {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map(y => (
                                        <option key={y} value={y} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{y}</option>
                                    ))}
                                 </select>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                background: 'var(--bg-dark)',
                                height: '2.75rem', 
                                padding: '0 1rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }} className="filter-chip">
                                <Filter size={16} style={{ color: 'var(--primary)' }} />
                                <select
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: 'var(--text-main)', 
                                        outline: 'none', 
                                        fontSize: '0.85rem', 
                                        fontWeight: '700', 
                                        cursor: 'pointer'
                                    }}
                                    value={filter.status}
                                    onChange={e => setFilter({ ...filter, status: e.target.value })}
                                >
                                    <option value="All" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>✨ All Status</option>
                                    <option value="Pending" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>🟠 Pending</option>
                                    <option value="Ongoing" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>🔵 Ongoing</option>
                                    <option value="Settled" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>🟢 Settled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', minWidth: '1100px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-darker)' }}>
                                        <th style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Date & Time</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Docket / OR</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Complainant</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Respondent</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Nature</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Status</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>Disposition</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((c: Case) => (
                                        <tr key={c.id} style={{ transition: 'all 0.2s', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                                            <td style={{ padding: '1.25rem 1rem', whiteSpace: 'nowrap' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white' }}>
                                                    {new Date(c.dateFiled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                                                    {(() => {
                                                        const time = c.timeFiled;
                                                        if (!time) return '---';
                                                        try {
                                                            const [hours, minutes] = time.split(':');
                                                            const hourNum = parseInt(hours);
                                                            const ampm = hourNum >= 12 ? 'PM' : 'AM';
                                                            const hour12 = hourNum % 12 || 12;
                                                            return `${hour12}:${minutes} ${ampm}`;
                                                        } catch (e) {
                                                            return time;
                                                        }
                                                    })()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                {c.docketNo ? <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)' }}>{c.docketNo}</div> : <div style={{ color: 'rgba(255,255,255,0.3)' }}>---</div>}
                                                {c.officialReceipt && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>OR: {c.officialReceipt}</div>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.complainantName}</div>
                                                {c.complainantAddress && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.complainantAddress}</div>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.respondentName}</div>
                                                {c.respondentAddress && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.respondentAddress}</div>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--bg-darker)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                                    {c.complaintType}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: c.status === 'Settled' ? 'rgba(16, 185, 129, 0.1)' : c.status === 'Ongoing' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: c.status === 'Settled' ? '#10b981' : c.status === 'Ongoing' ? '#3b82f6' : '#f59e0b',
                                                    border: `1px solid ${c.status === 'Settled' ? 'rgba(16, 185, 129, 0.2)' : c.status === 'Ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                                }}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                {c.dispositionDate ? new Date(c.dispositionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setViewingCase(c); }}
                                                        style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        className="action-btn"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
                                                        style={{ padding: '8px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', color: '#eab308', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        className="action-btn"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'transparent' }}>
                                <div style={{ 
                                    width: '64px', 
                                    height: '64px', 
                                    background: 'var(--bg-darker)', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    margin: '0 auto 1.5rem',
                                    color: 'var(--text-dim)'
                                }}>
                                    <Search size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No records found</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
            {/* Case Details Modal */}
            {viewingCase && (
                <div className="modal-backdrop" onClick={() => setViewingCase(null)}>
                    <div className="modal-content glass-panel" style={{
                        maxWidth: '720px',
                        padding: '0',
                        overflow: 'hidden',
                        background: 'var(--bg-dark)',
                        border: '1px solid var(--border)'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div style={{ 
                            padding: '1.5rem 2rem', 
                            background: 'linear-gradient(to bottom, var(--primary-bg) 0%, transparent 100%)',
                            borderBottom: '1px solid var(--border)',
                            position: 'relative'
                        }}>
                             <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'var(--bg-darker)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '10px', borderRadius: '12px' }} onClick={() => setViewingCase(null)}>
                                <X size={20} />
                            </button>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px' }}>Case #{viewingCase.id}</span>
                                {viewingCase.docketNo && <span style={{ padding: '4px 12px', background: 'var(--bg-darker)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>Docket: {viewingCase.docketNo}</span>}
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{viewingCase.complaintType}</h2>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="glass-card" style={{ padding: '1.75rem', background: 'var(--bg-card)' }}>
                                    <label className="label" style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Complainant</label>
                                    <p style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.4rem', color: 'var(--text-main)' }}>{viewingCase.complainantName}</p>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: '1.6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {viewingCase.complainantAddress}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {viewingCase.complainantContact || 'No Contact'}</div>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: '1.75rem', background: 'var(--bg-card)' }}>
                                    <label className="label" style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Respondent</label>
                                    <p style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.4rem', color: 'var(--text-main)' }}>{viewingCase.respondentName}</p>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: '1.6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {viewingCase.respondentAddress}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {viewingCase.respondentContact || 'No Contact'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <FileText size={18} />
                                    </div>
                                    <label className="label" style={{ marginBottom: '0' }}>Incident Description & Context</label>
                                </div>
                                <p style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{viewingCase.description}</p>
                                {viewingCase.incidentLocation && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} /> Location: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{viewingCase.incidentLocation}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {viewingCase.status === 'Pending' && (
                                        <button className="btn btn-primary" style={{ padding: '0 1.25rem', height: '2.75rem', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)', fontSize: '0.85rem' }} 
                                            onClick={() => handleUpdateStatus(viewingCase.id, 'Ongoing')}>
                                            Start Mediation
                                        </button>
                                    )}
                                    {viewingCase.status !== 'Settled' && (
                                         <button className="btn" style={{ padding: '0 1.25rem', height: '2.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.85rem' }}
                                             onClick={() => handleUpdateStatus(viewingCase.id, 'Settled')}>
                                             ✓ Settled
                                         </button>
                                    )}
                                    <button 
                                        className="btn" 
                                        style={{ padding: '0 1.25rem', height: '2.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                        onClick={() => handlePrintKPForm(viewingCase, 'summon')}
                                    >
                                        <Printer size={14} /> KP Form 7
                                    </button>
                                </div>
                                 <button className="btn btn-ghost" onClick={() => setViewingCase(null)} style={{ padding: '0 1.5rem', height: '2.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Success Toast Notification */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: 'var(--success)',
                    color: 'white',
                    padding: '1.25rem 2.5rem',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    zIndex: 2000,
                    animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>Registered Successfully!</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>The case is officially recorded.</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cases;
