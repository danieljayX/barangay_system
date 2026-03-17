import React from 'react';
import { Printer, CheckCircle, Clock, AlertCircle, FileText, Download, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Reports: React.FC = () => {
    const { cases, complainants, respondents } = useAppContext();

    const getComplainantName = (id: string) => complainants.find(c => c.id === id)?.name || 'Unknown Citizen';
    const getRespondentName = (id: string) => respondents.find(r => r.id === id)?.name || 'Unknown Citizen';

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        const headers = ['Case ID', 'Date Filed', 'Time Filed', 'Docket No', 'O.R.', 'Complainant', 'Respondent', 'Nature of Case', 'Status', 'Due Date', 'Remarks (Complainant)', 'Remarks (Respondent)'];
        
        const rows = cases.map(c => [
            c.id,
            c.dateFiled,
            c.timeFiled || '',
            c.docketNo || '',
            c.officialReceipt || '',
            getComplainantName(c.complainantId),
            getRespondentName(c.respondentId),
            c.complaintType,
            c.status,
            c.dispositionDate || '',
            c.remarksComplainant || '',
            c.remarksRespondent || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `barangay_cases_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reportSections = [
        {
            title: 'Settled Cases',
            data: cases.filter(c => c.status === 'Settled'),
            icon: <CheckCircle size={24} color="var(--success)" />,
            description: 'Cases successfully resolved through mediation.'
        },
        {
            title: 'Ongoing Mediation',
            data: cases.filter(c => c.status === 'Ongoing'),
            icon: <AlertCircle size={24} color="var(--primary)" />,
            description: 'Cases currently undergoing active mediation.'
        },
        {
            title: 'Pending Cases',
            data: cases.filter(c => c.status === 'Pending'),
            icon: <Clock size={24} color="#fbbf24" />,
            description: 'Newly filed cases awaiting assessment.'
        },
    ];

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
            {/* Ambient Atmosphere */}
            <div style={{
                position: 'fixed',
                top: '5%',
                left: '20%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, var(--success) 0%, transparent 65%)',
                opacity: 0.04,
                filter: 'blur(100px)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>
            <style>{`
                @media print {
                    aside, button, .no-print {
                        display: none !important;
                    }
                    main {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .glass-panel {
                        background: white !important;
                        color: black !important;
                        border: 1px solid #1e293b !important;
                        box-shadow: none !important;
                        backdrop-filter: none !important;
                        margin-bottom: 2rem !important;
                        page-break-inside: avoid;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    tr {
                        border-bottom: 1px solid #e2e8f0 !important;
                    }
                    td, th {
                        color: black !important;
                    }
                    h1, h2, h3 {
                        color: #0f172a !important;
                    }
                    p {
                        color: #475569 !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.35em' }}>Data Insights</span>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '1000',
                        marginBottom: '0.25rem',
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, var(--text-main), var(--success))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Reports Overview
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '500px' }}>View comprehensive data and statistics of barangay cases.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={handlePrint} style={{
                        padding: '0 1.5rem',
                        height: '2.75rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #3d6b4d, #2d5a3e)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 6px 15px rgba(61,107,77,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Printer size={16} /> PRINT OFFICIAL SUMMARY
                    </button>
                    <button className="btn btn-ghost" onClick={handleExportCSV} style={{
                        padding: '0 1.25rem',
                        height: '2.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-card)'
                    }}>
                        <Download size={16} /> CSV
                    </button>
                </div>
            </header>

            {/* Formal Printable Summary (Visible only in Print or via styles) */}
            <div className="print-only" style={{ display: 'none' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>REPUBLIC OF THE PHILIPPINES</h2>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>OFFICE OF THE LUPONG TAGAPAMAYAPA</h3>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>BARANGAY LUPON INFORMATION SYSTEM (LTIS)</p>
                    <div style={{ margin: '1.5rem 0', height: '2px', background: '#000' }}></div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '1000', margin: '1rem 0' }}>CASE STATUS SUMMARY REPORT</h1>
                    <p style={{ fontSize: '0.85rem' }}>As of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ border: '2px solid #000', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Overall Statistics</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Cases Filed:</span> <strong>{cases.length}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>Total Settled:</span> <strong>{cases.filter(c => c.status === 'Settled').length}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}><span>Ongoing Mediation:</span> <strong>{cases.filter(c => c.status === 'Ongoing').length}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}><span>Pending / New:</span> <strong>{cases.filter(c => c.status === 'Pending').length}</strong></div>
                        </div>
                    </div>
                    <div style={{ border: '2px solid #000', padding: '1.5rem', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Success Rate</h4>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '1000', color: 'var(--success)' }}>
                                {cases.length > 0 ? Math.round((cases.filter(c => c.status === 'Settled').length / cases.length) * 100) : 0}%
                            </div>
                            <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>Resolution Efficiency</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #000', marginBottom: '0.5rem' }}></div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '800' }}>PANGKAT SECRETARY</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #000', marginBottom: '0.5rem' }}></div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '800' }}>PUNONG BARANGAY / LUPON CHAIRMAN</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }} className="no-print">
                {reportSections.map((section, idx) => (
                    <div key={idx} className="glass-panel" style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                background: 'var(--bg-darker)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border)'
                            }}>
                                {React.cloneElement(section.icon as React.ReactElement, { size: 16 })}
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '1000', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.data.length}</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.1rem', color: 'var(--text-main)' }}>{section.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: '1.4' }}>{section.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {reportSections.map((section, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-darker)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ color: 'var(--primary)' }}>{section.icon}</div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{section.title} List</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Records as of {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-dim)', background: 'var(--glass)', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            TOTAL: {section.data.length}
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-darker)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Docket / O.R. #</th>
                                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Filed</th>
                                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complainant</th>
                                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Respondent</th>
                                    <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nature of Case</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.data.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                                        <td style={{ padding: '0.75rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                                                    <FileText size={14} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.75rem' }}>{c.docketNo || `#${c.id.slice(0, 6)}`}</div>
                                                    {c.officialReceipt && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>O.R.: {c.officialReceipt}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(c.dateFiled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td style={{ padding: '0.75rem 1.25rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.complainantName}</div>
                                            {c.complainantAddress && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.complainantAddress}</div>}
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.respondentName}</div>
                                            {c.respondentAddress && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.respondentAddress}</div>}
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem' }}>
                                            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-dark)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary-light)', border: '1px solid var(--border)' }}>
                                                {c.complaintType}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {section.data.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No data records found for this category.</p>
                        </div>
                    )}
                </div>
            ))}

            <footer className="no-print" style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
                <p style={{ color: '--text-dim', fontSize: '0.875rem' }}>Official Barangay Report Generation Tool • Barangay Lupon Tagapamayapa System</p>
            </footer>
        </div>
    );
};

export default Reports;
