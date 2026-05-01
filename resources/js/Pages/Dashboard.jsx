import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recentActivity, myActivities = [], myEvents = [] }) {
    const isAdmin = auth.user.role === 'admin';
    const isOrganizer = auth.user.role === 'organizer';
    const isParticipant = auth.user.role === 'participant';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* --- ADMIN DASHBOARD (COMMAND CENTER) --- */}
            {isAdmin && (
                <div className="space-y-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5722]">System Overview</h2>
                            <h1 className="text-5xl font-black italic tracking-tighter text-[#0A1D37]">COMMAND CENTER</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Server Status</p>
                            <p className="text-sm font-black text-green-500 uppercase flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Operational
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { label: 'Platform Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-50' },
                            { label: 'Active Events', value: stats.totalEvents, icon: '🏁', color: 'bg-orange-50' },
                            { label: 'Registrations', value: stats.totalRegistrations, icon: '📝', color: 'bg-green-50' },
                        ].map((s) => (
                            <div key={s.label} className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm transition-all hover:shadow-xl group">
                                <div className={`absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full text-4xl opacity-10 transition-transform group-hover:scale-125 ${s.color}`}>
                                    {s.icon}
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                                <p className="mt-4 text-6xl font-black italic tracking-tighter text-[#0A1D37]">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-10 lg:grid-cols-2">
                         <section className="rounded-[2.5rem] bg-[#0A1D37] p-10 text-white shadow-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-[#FF5722]">User Influx (Paginated)</h3>
                                <div className="space-y-6">
                                    {recentActivity.paginatedUsers.data.map((u) => (
                                        <div key={u.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-bold">{u.name}</p>
                                                <p className="text-xs text-gray-400 uppercase tracking-widest">{u.email}</p>
                                            </div>
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest">{u.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Pagination */}
                            {recentActivity.paginatedUsers.links && recentActivity.paginatedUsers.data.length > 0 && (
                                <div className="mt-8 pt-4 border-t border-white/10 flex justify-center gap-2 flex-wrap">
                                    {recentActivity.paginatedUsers.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                                link.active 
                                                    ? 'bg-[#FF5722] text-white shadow-lg' 
                                                    : !link.url 
                                                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                         </section>

                         <section className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
                            <h3 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-[#0A1D37]">Global Event Feed</h3>
                            <div className="space-y-6">
                                {recentActivity.latestEvents.map((e) => (
                                    <div key={e.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-black italic text-[#0A1D37]">{e.title}</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase">{e.date}</p>
                                        </div>
                                        <Link href={route('events.show', e.id)} className="text-[#FF5722] text-xs font-black uppercase tracking-widest hover:underline">Log →</Link>
                                    </div>
                                ))}
                            </div>
                         </section>
                    </div>
                </div>
            )}

            {/* --- PARTICIPANT DASHBOARD (RUNNER FLOW) --- */}
            {isParticipant && (
                <div className="space-y-12">
                    <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#0A1D37] to-[#1a3a63] p-12 text-white shadow-2xl">
                        <div className="relative z-10 md:w-2/3">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5722]">Welcome Back, Runner</h2>
                            <h1 className="mt-2 text-6xl font-black italic tracking-tighter">READY FOR THE NEXT CHALLENGE?</h1>
                            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">You've got races coming up. Stay focused, stay hydrated, and keep pushing your limits.</p>
                            <div className="mt-10 flex gap-4">
                                <Link href={route('events.index')} className="rounded-full bg-[#FF5722] px-10 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/40 transition-transform hover:scale-105 active:scale-95">Explore Races</Link>
                                <button className="rounded-full border-2 border-white/20 bg-white/5 px-10 py-4 text-xs font-black uppercase tracking-widest backdrop-blur-sm hover:bg-white/10">Training Log</button>
                            </div>
                        </div>
                        <div className="absolute right-[-10%] top-[-20%] text-[20rem] font-black italic opacity-5 pointer-events-none select-none">RUN</div>
                    </div>

                    <div>
                        <div className="mb-8 flex items-end justify-between">
                            <h3 className="text-2xl font-black italic tracking-tight text-[#0A1D37]">MY ACTIVE RACES</h3>
                            <Link href={route('events.index')} className="text-xs font-black uppercase tracking-widest text-[#FF5722] hover:underline">View All →</Link>
                        </div>
                        
                        {myActivities.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {myActivities.map((reg) => (
                                    <div key={reg.id} className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-2xl">
                                        <div className="relative h-32 bg-gray-100">
                                             <div className="absolute inset-0 bg-gradient-to-br from-[#0A1D37] to-[#FF5722] opacity-10"></div>
                                             <div className="absolute top-6 left-6">
                                                <span className={`rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                                    reg.status === 'finished' ? 'bg-green-500 text-white' :
                                                    reg.status === 'checked_in' ? 'bg-blue-500 text-white' : 'bg-[#FF5722] text-white'
                                                }`}>
                                                    {reg.status.replace('_', ' ')}
                                                </span>
                                             </div>
                                        </div>
                                        <div className="p-8">
                                            <h4 className="text-2xl font-black italic tracking-tighter text-[#0A1D37] leading-none mb-2 group-hover:text-[#FF5722] transition-colors">{reg.event.title}</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">📅 {reg.event.date} • {reg.event.location}</p>
                                            <Link href={route('events.show', reg.event_id)} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0A1D37] hover:gap-4 transition-all">
                                                RACE DETAILS <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[3rem] border-4 border-dashed border-gray-100 p-20 text-center">
                                <p className="text-4xl mb-4">🏃‍♂️</p>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Your calendar is empty</p>
                                <Link href={route('events.index')} className="mt-6 inline-block text-[#FF5722] font-black italic text-xl hover:underline">FIND YOUR FIRST RACE NOW</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- ORGANIZER HUB (BUSINESS & MANAGEMENT) --- */}
            {isOrganizer && (
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5722]">Event Director</h2>
                            <h1 className="text-5xl font-black italic tracking-tighter text-[#0A1D37]">ORGANIZER HUB</h1>
                        </div>
                        <Link
                            href={route('events.create')}
                            className="rounded-2xl bg-[#0A1D37] px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-black hover:-translate-y-1 active:translate-y-0"
                        >
                            + NEW EVENT
                        </Link>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <section className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm">
                            <div className="mb-10 flex items-center justify-between">
                                <h3 className="text-xl font-black italic uppercase tracking-wider text-[#0A1D37]">Active Events</h3>
                                <span className="rounded-full bg-gray-100 px-4 py-1 text-[10px] font-black text-gray-400">{myEvents.length} TOTAL</span>
                            </div>

                            {myEvents.length > 0 ? (
                                <div className="space-y-6">
                                    {myEvents.map((e) => (
                                        <div key={e.id} className="flex items-center justify-between rounded-2xl bg-gray-50/50 p-6 transition-all hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-black italic text-[#0A1D37]">{e.title}</h4>
                                                <div className="mt-1 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    <span>📅 {e.date}</span>
                                                    <span className="text-[#FF5722]">🏃 {e.registrations_count} Runners</span>
                                                </div>
                                            </div>
                                            <Link href={route('events.show', e.id)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0A1D37] hover:border-[#FF5722] hover:text-[#FF5722]">Manage</Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No active events</p>
                                    <Link href={route('events.create')} className="mt-4 inline-block text-[#FF5722] font-black hover:underline">Create your first event →</Link>
                                </div>
                            )}
                        </section>

                        <section className="space-y-8">
                            <div className="rounded-[3rem] bg-[#FF5722] p-10 text-white shadow-xl shadow-orange-500/20">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">Management Tips</h3>
                                <p className="mt-4 text-2xl font-black italic tracking-tight">ENGAGE YOUR COMMUNITY</p>
                                <p className="mt-4 text-sm text-orange-50 font-medium leading-relaxed opacity-80">Check your participant lists regularly and ensure all race logistics are updated at least 48 hours before the start time.</p>
                                <button className="mt-8 rounded-full bg-white/20 px-6 py-3 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm hover:bg-white/30">Read Guide</button>
                            </div>
                            <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Quick Actions</h3>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    {['Export Data', 'Send Updates', 'Review Categories', 'Promote Race'].map(act => (
                                        <button key={act} className="rounded-2xl border border-gray-50 bg-gray-50/50 p-4 text-left hover:bg-gray-50 transition-colors">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0A1D37]">{act}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
