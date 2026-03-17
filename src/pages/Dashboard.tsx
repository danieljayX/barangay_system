import React, { useState, useEffect } from 'react';
import { BarChart2, Users, FileText, Clock, TrendingUp, Calendar, ChevronRight, Folder, Shield, Gavel, Activity, AlertCircle, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
    onAction: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAction }) => {
    const { cases, hearings } = useAppContext();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getDay();
    const currentDay = currentTime.getDate();

    const totalCases = cases?.length || 0;
    const pendingCases = cases?.filter(c => c.status === 'Pending').length || 0;
    const ongoingCases = cases?.filter(c => c.status === 'Ongoing').length || 0;
    const settledCases = cases?.filter(c => c.status === 'Settled').length || 0;
    const settledRate = totalCases > 0 ? Math.round((settledCases / totalCases) * 100) : 0;

    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const todaysHearings = hearings?.filter(h => h.hearingDate === today) || [];
    const tomorrowsHearings = hearings?.filter(h => h.hearingDate === tomorrow) || [];
    const totalAlerts = todaysHearings.length + tomorrowsHearings.length;
    


    const getHearingDetails = (caseId: string) => {
        const c = cases.find(x => x.id === caseId);
        return {
            title: c ? `${c.complainantName} vs ${c.respondentName}` : 'Unknown Case',
            sub: c ? c.complaintType : 'N/A'
        };
    };

    const stats = [
        { 
            label: 'Total Cases', 
            value: totalCases, 
            icon: <FileText size={20} />, 
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            bgGlow: 'rgba(99, 102, 241, 0.12)',
            iconBg: 'rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            trend: `${totalCases} total filed`
        },
        { 
            label: 'Pending Cases', 
            value: pendingCases, 
            icon: <Clock size={20} />, 
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            bgGlow: 'rgba(245, 158, 11, 0.12)',
            iconBg: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            trend: pendingCases > 0 ? `${pendingCases} needs attention` : 'All clear!'
        },
        { 
            label: 'Ongoing Mediation', 
            value: ongoingCases, 
            icon: <Gavel size={20} />, 
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            bgGlow: 'rgba(139, 92, 246, 0.12)',
            iconBg: 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            trend: 'Active mediation'
        },
        { 
            label: 'Settled Cases', 
            value: settledCases, 
            icon: <Shield size={20} />, 
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            bgGlow: 'rgba(16, 185, 129, 0.12)',
            iconBg: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            trend: `${settledRate}% success rate`
        },
    ];

    const chartData = [
        { name: 'Jan', cases: 4, amt: 4 },
        { name: 'Feb', cases: 7, amt: 7 },
        { name: 'Mar', cases: totalCases, amt: totalCases },
    ];

    const greeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Maayong Buntag';
        if (hour < 18) return 'Maayong Hapon';
        return 'Maayong Gabii';
    };

    return (
        <div className="page-container animate-fade-in" style={{ position: 'relative' }}>
            {/* Ambient Glow Effects */}
            <div style={{
                position: 'fixed', top: '0', right: '10%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'fixed', bottom: '10%', left: '5%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
                filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none'
            }}></div>

            {/* Header Section */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ 
                            fontSize: '0.75rem', fontWeight: '800', color: '#3d6b4d', textTransform: 'uppercase', 
                            letterSpacing: '0.35em', marginBottom: '0.5rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <Activity size={14} />
                            Dashboard Overview
                        </div>
                        <h1 style={{ 
                            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: '800', marginBottom: '0.2rem', letterSpacing: '-0.03em',
                            color: 'var(--text-main)'
                        }}>
                            {greeting()}, Admin! 👋
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px' }}>
                            Welcome to <span style={{ color: '#3d6b4d', fontWeight: '700' }}>LTIS</span> — Lupong Tagapamayapa Information System
                        </p>
                    </div>

                    {/* Alerts / Today's & Tomorrow's Schedule */}
                    {totalAlerts > 0 && (
                        <div className="animate-slide-up" style={{ 
                            flex: 1, 
                            maxWidth: '450px',
                            background: 'rgba(59, 130, 246, 0.05)',
                            border: '1px solid rgba(59, 130, 246, 0.1)',
                            borderRadius: '16px',
                            padding: '0.75rem 1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#3b82f6', fontWeight: '800', fontSize: '0.85rem' }}>
                                    <Bell size={18} className="animate-bounce" />
                                    Upcoming Hearings (Today & Tomorrow)
                                </div>
                                <span style={{ background: '#3b82f6', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: '900' }}>
                                    {totalAlerts}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {[...todaysHearings, ...tomorrowsHearings].slice(0, 3).map((h, i) => {
                                    const details = getHearingDetails(h.caseId);
                                    const isToday = h.hearingDate === today;
                                    return (
                                        <div key={i} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            background: 'var(--bg-card)', 
                                            padding: '0.5rem 0.75rem', 
                                            borderRadius: '10px',
                                            border: isToday ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: isToday ? '#ef4444' : '#3b82f6', textTransform: 'uppercase' }}>
                                                        {isToday ? 'TODAY' : 'TOMORROW'}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>{details.title}</span>
                                                </div>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginLeft: '0.2rem' }}>Nature: {details.sub}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#3b82f6', fontWeight: '900', fontSize: '0.75rem' }}>
                                                <Clock size={12} />
                                                {h.hearingTime}
                                            </div>
                                        </div>
                                    );
                                })}
                                {totalAlerts > 3 && (
                                    <button onClick={() => onAction('hearings')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', textAlign: 'left', padding: '0 0.5rem' }}>
                                        View {totalAlerts - 3} more hearings...
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Live Clock Card */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '14px', padding: '0.75rem 1.25rem', color: 'var(--text-main)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid var(--border)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
                        minWidth: '140px'
                    }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)' }}>
                            Live Clock
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)' }}>
                            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
                        </div>
                        <div style={{ fontSize: '0.6rem', fontWeight: '600', color: 'var(--text-dim)' }}>
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                width: '100%'
            }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{
                        position: 'relative', overflow: 'hidden',
                        background: 'var(--bg-card)',
                        border: `2px solid ${stat.color}40`,
                        borderRadius: '20px', padding: '1.25rem',
                        boxShadow: `0 6px 20px ${stat.color}12`,
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '145px'
                    }}>
                        {/* More visible side glow */}
                        <div style={{
                            position: 'absolute', top: '-15%', right: '-15%', width: '130px', height: '130px',
                            background: `radial-gradient(circle, ${stat.color}35 0%, transparent 75%)`,
                            pointerEvents: 'none', zIndex: 0
                        }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: stat.gradient, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 12px ${stat.color}35`
                            }}>
                                {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <div style={{
                                fontSize: '0.7rem', fontWeight: '800', color: stat.color,
                                background: `${stat.color}15`, padding: '0.35rem 0.75rem', borderRadius: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                border: `1px solid ${stat.color}25`
                            }}>
                                {stat.trend}
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ 
                                fontSize: '0.8rem', 
                                fontWeight: '800', 
                                color: 'var(--text-main)', 
                                marginBottom: '0.2rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.03em',
                                opacity: 0.85
                            }}>{stat.label}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                                <span style={{ 
                                    fontSize: '2.1rem', 
                                    fontWeight: '900', 
                                    letterSpacing: '-0.03em', 
                                    color: 'var(--text-main)',
                                    lineHeight: '1'
                                }}>{stat.value}</span>
                                <span style={{ fontSize: '0.9rem', color: stat.color, fontWeight: '700', textTransform: 'lowercase' }}>records</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Calendar + Chart Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Calendar */}
                <div style={{
                    background: 'var(--bg-card)', borderRadius: '22px', padding: '1rem 1.25rem',
                    border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                }}>
                    {/* Calendar Header Glow */}
                    <div style={{
                        position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                        width: '200px', height: '100px',
                        background: 'radial-gradient(circle, rgba(61,107,77,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', position: 'relative' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                <Calendar size={16} style={{ color: '#3d6b4d' }} />
                                <h2 style={{ fontSize: '1rem', fontWeight: '900', margin: 0 }}>Calendar</h2>
                            </div>
                            <div style={{
                                fontSize: '0.8rem', color: '#3d6b4d', fontWeight: '800',
                                background: 'rgba(61,107,77,0.1)', padding: '0.3rem 0.75rem', borderRadius: '10px',
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem'
                            }}>
                                🕒 {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </div>
                        </div>
                    </div>

                    {/* Month Navigation */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem',
                        background: 'var(--bg-darker)', borderRadius: '12px', padding: '0.4rem 0.75rem'
                    }}>
                        <button className="btn-ghost" style={{ padding: '0.35rem', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button className="btn-ghost" style={{ padding: '0.35rem', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', textAlign: 'center' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} style={{
                                fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-dim)',
                                textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '0.5rem'
                            }}>{d}</div>
                        ))}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const isToday = day === currentDay;
                            return (
                                <div key={i} style={{
                                    padding: '0.4rem 0',
                                    fontSize: '0.72rem',
                                    fontWeight: isToday ? '900' : '600',
                                    borderRadius: '10px',
                                    background: isToday ? 'linear-gradient(135deg, #3d6b4d 0%, #2d5a3e 100%)' : 'transparent',
                                    color: isToday ? 'white' : 'var(--text-main)',
                                    boxShadow: isToday ? '0 4px 16px rgba(61,107,77,0.35)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}>
                                    {day}
                                    {isToday && (
                                        <div style={{
                                            position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)',
                                            width: '4px', height: '4px', borderRadius: '50%',
                                            background: '#a7f3d0'
                                        }}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chart Section */}
                <div style={{
                    background: 'var(--bg-card)', borderRadius: '22px', padding: '1rem 1.25rem',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <BarChart2 size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1rem', fontWeight: '900', margin: 0 }}>Case Filing Trend</h2>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', margin: 0 }}>Monthly overview</p>
                            </div>
                        </div>
                        <div style={{
                            fontSize: '0.7rem', fontWeight: '700', color: '#6366f1',
                            background: 'rgba(99,102,241,0.1)', padding: '0.3rem 0.8rem',
                            borderRadius: '20px', border: '1px solid rgba(99,102,241,0.15)'
                        }}>
                            📊 Monthly
                        </div>
                    </div>
                    <div style={{ height: '180px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3d6b4d" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#3d6b4d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                                        borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        padding: '0.75rem 1rem'
                                    }}
                                    labelStyle={{ fontWeight: 800, marginBottom: '0.25rem' }}
                                />
                                <Area type="monotone" dataKey="cases" stroke="#3d6b4d" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" dot={{ r: 5, fill: '#3d6b4d', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#3d6b4d', stroke: '#a7f3d0', strokeWidth: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Case Filings */}
            <div style={{
                background: 'var(--bg-card)', borderRadius: '22px', padding: '1.25rem',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            background: 'rgba(16,185,129,0.12)', color: '#34d399',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Users size={16} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '900', margin: 0 }}>Recent Case Filings</h2>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', margin: 0 }}>Bag-o lang nga nahimong kaso</p>
                        </div>
                    </div>
                    <button onClick={() => onAction('cases')} style={{
                        background: 'linear-gradient(135deg, #3d6b4d 0%, #2d5a3e 100%)',
                        border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: '700',
                        display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
                        padding: '0.4rem 1rem', borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(61,107,77,0.25)',
                        transition: 'transform 0.2s'
                    }}>
                        All Cases <ChevronRight size={12} />
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>Complainant</th>
                                <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>Respondent</th>
                                <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>Nature</th>
                                <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>Status</th>
                                <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800', textAlign: 'right' }}>Date Filed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases?.slice(0, 5).map((c, i) => (
                                <tr key={i} style={{
                                    borderBottom: i === Math.min(4, (cases?.length || 1) - 1) ? 'none' : '1px solid var(--border)',
                                    cursor: 'pointer', transition: 'background 0.2s'
                                }} className="table-row-hover" onClick={() => onAction('cases')}>
                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #3d6b4d 0%, #2d5a3e 100%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: '900', color: 'white',
                                                boxShadow: '0 2px 8px rgba(61,107,77,0.25)'
                                            }}>
                                                {c.complainantName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>{c.complainantName || 'Unknown'}</div>
                                                {c.complainantAddress && <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '1px' }}>{c.complainantAddress}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>{c.respondentName || 'Unknown'}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                        <span style={{
                                            fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600',
                                            background: 'var(--bg-darker)', padding: '0.25rem 0.6rem', borderRadius: '8px'
                                        }}>
                                            {c.complaintType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '8px',
                                            fontSize: '0.68rem',
                                            fontWeight: '800',
                                            letterSpacing: '0.02em',
                                            background: c.status === 'Settled' ? 'rgba(16, 185, 129, 0.12)' :
                                                       c.status === 'Ongoing' ? 'rgba(139, 92, 246, 0.12)' :
                                                       'rgba(245, 158, 11, 0.12)',
                                            color: c.status === 'Settled' ? '#34d399' :
                                                   c.status === 'Ongoing' ? '#a78bfa' :
                                                   '#fbbf24',
                                            border: `1px solid ${c.status === 'Settled' ? 'rgba(16,185,129,0.2)' :
                                                    c.status === 'Ongoing' ? 'rgba(139,92,246,0.2)' :
                                                    'rgba(245,158,11,0.2)'}`
                                        }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                                        {new Date(c.dateFiled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                            {(!cases || cases.length === 0) && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                        Walay case records pa. Mag-file ug bag-o!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
