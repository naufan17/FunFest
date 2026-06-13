import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import ParticipantTable from '@/Components/ParticipantTable';
import LeaderboardTable from '@/Components/LeaderboardTable';

import ResultInputModal from '@/Components/ResultInputModal';

export default function Show({ auth, event, participants, leaderboard, isOwner, isRegistered, registration, filters, statistics }) {
    const isAdmin = auth.user?.role === 'admin';
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'participants', 'leaderboard'
    const [resultModal, setResultModal] = useState({ show: false, regId: null });

    const today = new Date().toISOString().split('T')[0];
    const isOutdated = event.date < today;
    const isRegistrationOpen = today >= event.registration_start && today <= event.registration_end;
    const registrationStatusText = today < event.registration_start ? 'Opening Soon' : (today > event.registration_end ? 'Closed' : 'Open');
    const isFull = participants.total >= event.max_participants;
    
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    };
    const isParticipant = auth.user.role === 'participant';

    const { data, setData, post: joinEvent, processing: joining, errors: joinErrors, transform } = useForm({ gender: '' });
    const { patch: updateRegistration, processing: updating } = useForm({ status: '', finish_time: '' });

    const handleJoin = (gender) => {
        // Sync with backend validation: gender must be required and in:male,female
        if (!gender || !['male', 'female'].includes(gender)) {
            return; // Basic frontend validation
        }

        transform((data) => ({
            ...data,
            gender: gender,
        }));

        joinEvent(route('events.join', event.id), {
            preserveScroll: true
        });
    };

    const handleStatusUpdate = (regId, status) => {
        router.patch(route('registrations.update', regId), { status }, {
            preserveScroll: true
        });
    };

    const handleResultInput = (regId) => {
        setResultModal({ show: true, regId });
    };

    const confirmResult = (time) => {
        router.patch(route('registrations.update', resultModal.regId), { status: 'finished', finish_time: time }, {
            preserveScroll: true,
            onSuccess: () => setResultModal({ show: false, regId: null })
        });
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

                    {isOwner && (
                        <div className="flex gap-2">
                            <Button as={Link} href={route('events.edit', event.id)} variant="white" size="lg">
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
                        {['info', 'participants', 'leaderboard', ...(statistics ? ['statistics'] : [])].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'border-b-2 border-[#FF5722] text-[#FF5722]' : 'text-gray-400 hover:text-gray-600'
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
                                        <li className="flex justify-between border-b border-gray-200 pb-2">
                                            <span className="text-gray-400">Status</span> 
                                            <span className={`font-bold ${isRegistrationOpen ? 'text-green-600' : 'text-orange-500'}`}>{registrationStatusText}</span>
                                        </li>
                                        {today < event.registration_start ? (
                                            <li className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="text-gray-400">Opening Date</span> 
                                                <span className="font-bold">{formatDate(event.registration_start)}</span>
                                            </li>
                                        ) : (
                                            <li className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="text-gray-400">Closing Date</span> 
                                                <span className="font-bold">{formatDate(event.registration_end)}</span>
                                            </li>
                                        )}
                                        <li className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-400">Participants</span> <span className="font-bold">{participants.total} / {event.max_participants}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'participants' && (
                        <ParticipantTable
                            event={event}
                            participants={participants}
                            filters={filters}
                            isOwner={isOwner}
                            isAdmin={isAdmin}
                            onStatusUpdate={handleStatusUpdate}
                            onResultInput={handleResultInput}
                            processing={updating}
                        />
                    )}

                    {activeTab === 'leaderboard' && (
                        <LeaderboardTable leaderboard={leaderboard} />
                    )}

                    {activeTab === 'statistics' && statistics && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black italic tracking-tight uppercase">Participant Statistics</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-2xl bg-gray-50 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Total Registrations</h4>
                                    <p className="text-5xl font-black text-[#FF5722]">{statistics.total}</p>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 text-center">By Gender</h4>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Male ♂</span>
                                        <span className="text-2xl font-black">{statistics.gender.male}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Female ♀</span>
                                        <span className="text-2xl font-black">{statistics.gender.female}</span>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 text-center">By Status</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Registered</span>
                                            <span className="text-xl font-black text-gray-700">{statistics.status.registered}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Checked In</span>
                                            <span className="text-xl font-black text-blue-600">{statistics.status.checked_in}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Finished</span>
                                            <span className="text-xl font-black text-green-600">{statistics.status.finished}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Registration Card */}
                {!isOwner && !isAdmin && isParticipant && (
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
                                        {(joinErrors?.error || joinErrors?.gender) && (
                                            <div className="mt-4 rounded-xl bg-red-500/20 p-4 border border-red-500/50">
                                                <p className="text-xs font-bold text-red-200">{joinErrors.error || joinErrors.gender}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {event.categories.map(cat => {
                                            const userGender = auth.user?.gender;
                                            const isGenderMismatch = userGender && userGender !== cat.gender;
                                            const isDisabled = joining || isOutdated || isFull || isGenderMismatch || !isRegistrationOpen;

                                            return (
                                                <div key={cat.id} className="relative">
                                                    <Button
                                                        onClick={() => {
                                                            if (!auth.user) {
                                                                window.location.href = route('login');
                                                            } else if (!isDisabled) {
                                                                handleJoin(cat.gender);
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        variant={isDisabled ? 'ghost' : 'white'}
                                                        className={`w-full py-4 text-lg transition-all ${isGenderMismatch ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                    >
                                                        {cat.gender === 'male' ? '♂' : '♀'} JOIN AS {cat.gender.toUpperCase()}
                                                    </Button>
                                                    {isGenderMismatch && (
                                                        <div className="mt-1 flex items-center justify-center gap-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400/70">
                                                                {cat.gender} only — your profile is {userGender}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                        {isOutdated ? (
                                            <span className="text-red-400 text-[16px] font-semibold">Event is closed</span>
                                        ) : !isRegistrationOpen ? (
                                            <span className="text-orange-400 text-[16px] font-semibold">Registration {registrationStatusText}</span>
                                        ) : isFull ? (
                                            <span className="text-red-400 text-[16px] font-semibold">Event is full</span>
                                        ) : (
                                            <>
                                                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                                {event.max_participants - (event.registrations?.length || 0)} slots remaining
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <ResultInputModal
                show={resultModal.show}
                onClose={() => setResultModal({ show: false, regId: null })}
                onConfirm={confirmResult}
                processing={updating}
            />
        </AuthenticatedLayout>
    );
}
