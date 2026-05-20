import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function Dashboard({ auth, stats, recentActivity, myActivities = [], myEvents = [] }) {
    const isAdmin = auth.user.role === 'admin';
    const isOrganizer = auth.user.role === 'organizer';
    const isParticipant = auth.user.role === 'participant';

    const eventsData = myEvents?.data || (Array.isArray(myEvents) ? myEvents : []);
    const eventsCount = myEvents?.total !== undefined ? myEvents.total : eventsData.length;

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
                                <h3 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-[#FF5722]">User Influx</h3>
                                <div className="space-y-6">
                                    {recentActivity.latestUsers.map((u) => (
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
                            {/* {recentActivity.paginatedUsers.links && recentActivity.paginatedUsers.data.length > 0 && (
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
                            )} */}
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
                    {/* Reminder Banner for Incoming Races */}
                    {myActivities.length > 0 && (
                        (() => {
                            // Find the next upcoming race (by soonest event date in the future)
                            const now = new Date();
                            const upcomingRegs = myActivities.filter(reg => new Date(reg.event.date) > now && reg.status !== 'finished');
                            if (!upcomingRegs.length) return null;
                            const nextRace = upcomingRegs.reduce((soonest, reg) => {
                                const raceDate = new Date(reg.event.date);
                                return raceDate < new Date(soonest.event.date) ? reg : soonest;
                            }, upcomingRegs[0]);
                            return (
                                <div className="mb-8 flex items-center gap-6 rounded-3xl bg-[#FF5722] text-white px-8 py-6 shadow-xl border-l-8 border-[#0A1D37] animate-pulse-slow">
                                    <div className="text-5xl md:text-6xl font-black italic mr-4">🏁</div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black uppercase tracking-widest text-orange-100 mb-1">Incoming Race Reminder</div>
                                        <div className="text-lg md:text-2xl font-black italic tracking-tight">{nextRace.event.title}</div>
                                        <div className="mt-1 text-sm md:text-base font-bold flex flex-wrap gap-4 items-center">
                                            <span>📅 {new Date(nextRace.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span>⏰ {nextRace.event.race_start_time ? nextRace.event.race_start_time.substring(0, 5) : '06:00'}</span>
                                            <span>📍 {nextRace.event.location}</span>
                                            <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-black ml-2">{nextRace.event.distance} KM</span>
                                        </div>
                                    </div>
                                    <Button as={Link} href={route('events.show', nextRace.event_id)} size="md" variant="secondary" className=" ml-4">View Details</Button>
                                </div>
                            );
                        })()
                    )}

                    <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#0A1D37] to-[#1a3a63] p-12 text-white shadow-2xl">
                        <div className="relative z-10 md:w-2/3">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5722]">Welcome Back, Runner</h2>
                            <h1 className="mt-2 text-6xl font-black italic tracking-tighter">READY FOR THE NEXT CHALLENGE?</h1>
                            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">You've got races coming up. Stay focused, stay hydrated, and keep pushing your limits.</p>
                            <div className="mt-10 flex gap-4">
                                <Button as={Link} href={route('events.index')} size="lg" className="shadow-xl shadow-orange-500/40">
                                    Explore Races
                                </Button>
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
                                    <div key={reg.id} className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                        {/* Top Banner Area */}
                                        <div className="relative h-40 bg-gray-100 overflow-hidden">
                                            {reg.event.banner_url ? (
                                                <img 
                                                    src={`/storage/${reg.event.banner_url}`} 
                                                    alt="" 
                                                    className="h-full w-full object-cover transition-transform duration-550 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-[#0A1D37] to-[#1f3b5e] flex items-center justify-center text-white text-5xl font-black italic">
                                                    RUN
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-6 left-6">
                                               <span className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-md border ${
                                                   reg.status === 'finished' ? 'bg-green-500 text-white border-green-400' :
                                                   reg.status === 'checked_in' ? 'bg-blue-500 text-white border-blue-400' : 
                                                   'bg-[#FF5722] text-white border-orange-400'
                                               }`}>
                                                   {reg.status.replace('_', ' ')}
                                               </span>
                                            </div>

                                            {/* Distance Overlay */}
                                            <div className="absolute bottom-4 right-6 bg-[#0A1D37] text-white font-black italic text-xs px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg">
                                                {reg.event.distance} KM
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <h4 className="text-2xl font-black italic tracking-tighter text-[#0A1D37] leading-none mb-2 group-hover:text-[#FF5722] transition-colors">{reg.event.title}</h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <span>📅 {new Date(reg.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="truncate max-w-[150px]">📍 {reg.event.location}</span>
                                                </p>
                                            </div>

                                            {/* Detail specifications */}
                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 text-left">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Gender Selected</p>
                                                    <p className="text-sm font-black text-[#0A1D37] capitalize">{reg.gender}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Race Start</p>
                                                    <p className="text-sm font-black text-[#0A1D37]">{reg.event.race_start_time ? reg.event.race_start_time.substring(0, 5) : '06:00'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Cut-off Time</p>
                                                    <p className="text-sm font-black text-[#0A1D37]">{reg.event.cut_off_time ? reg.event.cut_off_time.substring(0, 5) : '02:00'} hrs</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Finish Time</p>
                                                    <p className={`text-sm font-black font-mono ${reg.finish_time ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {reg.finish_time || '--:--:--'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link href={route('events.show', reg.event_id)} className="flex items-center justify-center gap-2 w-full py-3 bg-[#0A1D37] hover:bg-[#FF5722] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-md transition-all duration-300">
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
                        <Button
                            as={Link}
                            href={route('events.create')}
                            variant="secondary"
                            size="lg"
                            className="shadow-2xl"
                        >
                            + NEW EVENT
                        </Button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <section className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm">
                            <div className="mb-10 flex items-center justify-between">
                                <h3 className="text-xl font-black italic uppercase tracking-wider text-[#0A1D37]">Active Events</h3>
                                <span className="rounded-full bg-gray-100 px-4 py-1 text-[10px] font-black text-gray-400">{eventsCount} TOTAL</span>
                            </div>

                            {eventsData.length > 0 ? (
                                <div className="space-y-6">
                                    {eventsData.map((e) => {
                                        const totalCap = e.max_participants || 0;
                                        const regCount = e.registrations_count || 0;
                                        const progressPercent = totalCap > 0 ? Math.min(100, Math.round((regCount / totalCap) * 100)) : 100;

                                        return (
                                            <div key={e.id} className="group rounded-[2rem] border border-gray-100 bg-gray-50/30 p-6 md:p-8 transition-all duration-300 hover:bg-white hover:shadow-xl space-y-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        {e.banner_url ? (
                                                            <img 
                                                                src={`/storage/${e.banner_url}`} 
                                                                alt="" 
                                                                className="h-12 w-20 object-cover rounded-xl shadow-sm border border-gray-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-20 rounded-xl bg-gradient-to-br from-[#0A1D37] to-[#1f3b5e] flex items-center justify-center text-white text-xs font-black italic shrink-0">
                                                                RUN
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-lg font-black italic text-[#0A1D37] leading-tight group-hover:text-[#FF5722] transition-colors">{e.title}</h4>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                                <span>📅 {new Date(e.date).toLocaleDateString()}</span>
                                                                <span>•</span>
                                                                <span className="truncate max-w-[120px]">📍 {e.location}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
                                                        <span className="font-black text-xs text-[#0A1D37] bg-white border border-gray-100 shadow-sm px-3.5 py-1.5 rounded-xl shrink-0">
                                                            {e.distance} KM
                                                        </span>
                                                        <Link href={route('events.show', e.id)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0A1D37] hover:border-[#FF5722] hover:text-[#FF5722] transition-all">Manage</Link>
                                                    </div>
                                                </div>

                                                {/* Event specifics grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t border-gray-100/70 text-left text-xs">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Race Start</p>
                                                        <p className="font-bold text-[#0A1D37]">{e.race_start_time ? e.race_start_time.substring(0, 5) : '06:00'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Cut-off Time</p>
                                                        <p className="font-bold text-[#0A1D37]">{e.cut_off_time ? e.cut_off_time.substring(0, 5) : '02:00'} hrs</p>
                                                    </div>
                                                    <div className="col-span-2 sm:col-span-1">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Capacity Progression</p>
                                                        <p className="font-bold text-[#0A1D37]">
                                                            {regCount} / {totalCap || 'Unlimited'} Pax
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                {totalCap > 0 && (
                                                    <div className="space-y-1.5">
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                                            <div 
                                                                className="bg-gradient-to-r from-[#0A1D37] to-[#FF5722] h-full rounded-full transition-all duration-500" 
                                                                style={{ width: `${progressPercent}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <span>Registration Fill Rate</span>
                                                            <span className="text-[#FF5722]">{progressPercent}%</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Pagination Links */}
                                    {myEvents.links && myEvents.links.length > 3 && (
                                        <div className="mt-8 flex flex-wrap justify-center gap-1.5 border-t border-gray-100 pt-6">
                                            {myEvents.links.map((link, idx) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span 
                                                            key={idx}
                                                            className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed select-none"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        preserveScroll
                                                        className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
                                                            link.active
                                                                ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-md shadow-orange-500/10'
                                                                : 'bg-white text-[#0A1D37] border-gray-200 hover:border-[#FF5722] hover:text-[#FF5722]'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
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
                                <Button as={Link} href={route('guide')} variant="ghost" size="sm" className="mt-8 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                                    Read Guide
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
