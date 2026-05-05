import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ auth, event, isOwner, isRegistered, registration }) {
    const isAdmin = auth.user?.role === 'admin';
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'participants', 'leaderboard'

    const isOutdated = event.date < new Date().toISOString().split('T')[0];
    const isFull = event.registrations.length >= event.max_participants;

    const maskName = (name) => {
        if (isOwner || isAdmin) return name;
        return name.split(' ').map(word => word.charAt(0) + '*'.repeat(Math.max(1, word.length - 1))).join(' ');
    };

    const { post: joinEvent, processing: joining, errors: joinErrors } = useForm({ gender: '' });
    const { patch: updateRegistration, processing: updating } = useForm({ status: '', finish_time: '' });

    const handleJoin = (gender) => {
        joinEvent(route('events.join', event.id), {
            data: { gender },
            preserveScroll: true
        });
    };

    const handleStatusUpdate = (regId, status) => {
        updateRegistration(route('registrations.update', regId), {
            data: { status },
            preserveScroll: true
        });
    };

    const handleResultInput = (regId) => {
        const time = prompt("Enter finish time (e.g. 01:23:45):");
        if (time) {
            updateRegistration(route('registrations.update', regId), {
                data: { status: 'finished', finish_time: time },
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                                {event.distance}
                            </span>
                            {isOutdated ? (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-600">
                                    OUTDATED
                                </span>
                            ) : (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-600">
                                    INCOMING
                                </span>
                            )}
                            <span className="text-xs font-bold text-gray-400">📅 {event.date}</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tight text-[#0A1D37] leading-none">{event.title}</h2>
                    </div>
                    
                    {(isOwner || isAdmin) && (
                        <div className="flex gap-2">
                            <Button as={Link} href={route('events.edit', event.id)} variant="white" size="sm">
                                Edit Event
                            </Button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={event.title} />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="flex-1 space-y-12">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['info', 'participants', 'leaderboard'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab ? 'border-b-2 border-[#FF5722] text-[#FF5722]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'info' && (
                        <div className="space-y-12">
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-xl font-black italic tracking-tight uppercase">About the Race</h3>
                                <p className="text-gray-500 leading-relaxed text-lg">{event.description}</p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-2xl bg-gray-50 p-8">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-[#FF5722] mb-4">Event Logistics</h4>
                                    <ul className="space-y-4">
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Location</span> <span className="font-bold">{event.location}</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Start Time</span> <span className="font-bold">{event.race_start_time}</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Cut-off</span> <span className="font-bold">{event.cut_off_time}</span></li>
                                    </ul>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-8">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-[#FF5722] mb-4">Registration</h4>
                                    <ul className="space-y-4">
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Status</span> <span className="font-bold text-green-600">Open</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Closing Date</span> <span className="font-bold">{event.registration_end}</span></li>
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Participants</span> <span className="font-bold">{event.registrations.length} / {event.max_participants}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'participants' && (
                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Runner</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        {(isOwner || isAdmin) && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {event.registrations.map(reg => (
                                        <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-6 font-bold text-[#0A1D37]">{maskName(reg.user.name)}</td>
                                            <td className="px-6 py-6 text-sm text-gray-500 uppercase">{reg.gender}</td>
                                            <td className="px-6 py-6">
                                                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                                    reg.status === 'finished' ? 'bg-green-100 text-green-700' :
                                                    reg.status === 'checked_in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#FF5722]'
                                                }`}>
                                                    {reg.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            {(isOwner || isAdmin) && (
                                                <td className="px-6 py-6 text-right space-x-2">
                                                    {reg.status === 'registered' && (
                                                        <Button onClick={() => handleStatusUpdate(reg.id, 'checked_in')} variant="ghost" size="sm">
                                                            Check-in
                                                        </Button>
                                                    )}
                                                    {reg.status === 'checked_in' && (
                                                        <Button onClick={() => handleResultInput(reg.id)} variant="ghost" size="sm" className="text-green-600">
                                                            Input Result
                                                        </Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {event.registrations.length === 0 && <p className="p-12 text-center text-gray-400 italic">No registrations yet.</p>}
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div className="space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                {['male', 'female'].map(gender => (
                                    <div key={gender} className="rounded-3xl border border-gray-100 bg-white p-8">
                                        <h4 className="mb-6 text-xl font-black italic tracking-tight uppercase text-[#0A1D37] border-b border-gray-50 pb-4">
                                            {gender} LEADERBOARD
                                        </h4>
                                        <div className="space-y-4">
                                            {event.registrations
                                                .filter(r => r.gender === gender && r.status === 'finished')
                                                .sort((a, b) => a.finish_time.localeCompare(b.finish_time))
                                                .map((r, i) => (
                                                    <div key={r.id} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xl font-black italic text-gray-200">#{i + 1}</span>
                                                            <span className="font-bold">{r.user.name}</span>
                                                        </div>
                                                        <span className="font-mono font-black text-[#FF5722]">{r.finish_time}</span>
                                                    </div>
                                                ))}
                                            {event.registrations.filter(r => r.gender === gender && r.status === 'finished').length === 0 && (
                                                <p className="text-gray-400 italic text-sm">No results yet.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Registration Card */}
                {!isOwner && !isAdmin && (
                    <div className="w-full lg:w-96">
                        <div className="sticky top-24 overflow-hidden rounded-[2.5rem] bg-[#0A1D37] p-8 text-white shadow-2xl">
                            {isRegistered ? (
                                <div className="space-y-8 text-center">
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight text-[#FF5722]">YOU'RE IN!</h3>
                                        <p className="text-gray-400 mt-2">Get ready for race day.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
                                        <p className="text-xs uppercase font-black tracking-widest text-gray-500 mb-2">Registration Status</p>
                                        <p className="text-2xl font-black italic uppercase text-white">{registration.status.replace('_', ' ')}</p>
                                    </div>
                                    {registration.status === 'finished' && (
                                        <div className="rounded-2xl bg-[#FF5722] p-6 shadow-xl shadow-orange-500/20">
                                            <p className="text-xs uppercase font-black tracking-widest text-orange-200 mb-2">Official Time</p>
                                            <p className="text-3xl font-black italic text-white">{registration.finish_time}</p>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 leading-relaxed">
                                        Show your profile at the check-in desk on race day to receive your race pack.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight">READY TO JOIN?</h3>
                                        <p className="text-gray-400 mt-2">Select your category below</p>
                                        {joinErrors?.error && (
                                            <div className="mt-4 rounded-xl bg-red-500/20 p-4 border border-red-500/50">
                                                <p className="text-xs font-bold text-red-200">{joinErrors.error}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {event.categories.map(cat => (
                                            <Button
                                                key={cat.id}
                                                onClick={() => {
                                                    if (!auth.user) {
                                                        window.location.href = route('login');
                                                    } else {
                                                        handleJoin(cat.gender);
                                                    }
                                                }}
                                                disabled={joining || isOutdated || isFull}
                                                variant={isOutdated || isFull ? 'ghost' : 'white'}
                                                className="w-full py-4 text-lg"
                                            >
                                                JOIN AS {cat.gender}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                        {isOutdated ? (
                                            <span className="text-red-400">Event is closed</span>
                                        ) : isFull ? (
                                            <span className="text-red-400">Event is full</span>
                                        ) : (
                                            <>
                                                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                                {event.max_participants - event.registrations.length} slots remaining
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
