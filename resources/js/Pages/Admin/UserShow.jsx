import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function UserShow({ auth, managedUser }) {
    const [activeTab, setActiveTab] = useState('profile');

    const formattedJoinDate = new Date(managedUser.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const totalJoined = managedUser.registrations?.length || 0;
    const completedRaces = managedUser.registrations?.filter(r => r.status === 'finished').length || 0;
    const organizedEvents = managedUser.created_events?.length || 0;

    const isPrivileged = managedUser.role === 'admin' || managedUser.role === 'organizer';

    const getStatusStyle = (status) => {
        switch (status) {
            case 'finished':
                return 'bg-green-100 text-green-600 border border-green-200';
            case 'checked_in':
                return 'bg-blue-100 text-blue-600 border border-blue-200';
            default:
                return 'bg-yellow-100 text-yellow-600 border border-yellow-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="p-2.5 bg-white border border-gray-150 rounded-2xl shadow-sm text-gray-500 hover:text-[#FF5722] hover:border-[#FF5722]/30 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37] uppercase">USER DETAILS</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Admin Management System</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`User - ${managedUser.name}`} />

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                
                {/* Profile Header Summary Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0A1D37] to-[#1f3b5e] text-white p-8 md:p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-72 h-72 rounded-full bg-[#FF5722]/10 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#FF5722] to-[#ff8a65] flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-[#000]/30 border-4 border-white/10 shrink-0">
                            {managedUser.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                                <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase leading-none">{managedUser.name}</h1>
                                <div>
                                    <span className={`inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                                        managedUser.role === 'admin' ? 'bg-[#FF5722] text-white shadow-lg shadow-orange-600/30' :
                                        managedUser.role === 'organizer' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                        'bg-white/10 text-gray-200 border border-white/15'
                                    }`}>
                                        {managedUser.role}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-300 font-semibold">{managedUser.email}</p>
                            <p className="text-xs text-white/60 font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Joined on {formattedJoinDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#0A1D37]">{totalJoined}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Events</p>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-green-50 text-green-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#0A1D37]">{completedRaces}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Finished Races</p>
                        </div>
                    </div>

                    {/* Stat Card 3 (Only relevant for organizers/admins) */}
                    <div className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-6 ${!isPrivileged ? 'opacity-50' : ''}`}>
                        <div className="p-4 rounded-2xl bg-orange-50 text-[#FF5722]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#0A1D37]">{isPrivileged ? organizedEvents : 0}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Organised Events</p>
                        </div>
                    </div>
                </div>

                {/* Tabs bar */}
                <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-lg flex gap-2 w-max max-w-full">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'profile'
                                ? 'bg-[#0A1D37] text-white shadow-md'
                                : 'text-gray-500 hover:text-[#FF5722] hover:bg-gray-50'
                        }`}
                    >
                        Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab('joined')}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'joined'
                                ? 'bg-[#0A1D37] text-white shadow-md'
                                : 'text-gray-500 hover:text-[#FF5722] hover:bg-gray-50'
                        }`}
                    >
                        Joined Events ({totalJoined})
                    </button>
                    {isPrivileged && (
                        <button
                            onClick={() => setActiveTab('created')}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                activeTab === 'created'
                                    ? 'bg-[#0A1D37] text-white shadow-md'
                                    : 'text-gray-500 hover:text-[#FF5722] hover:bg-gray-50'
                            }`}
                        >
                            Organised Events ({organizedEvents})
                        </button>
                    )}
                </div>

                {/* Tabs Content */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[300px]">
                    {activeTab === 'profile' && (
                        <div className="p-8 md:p-10 space-y-8">
                            <div>
                                <h3 className="text-xl font-black italic text-[#0A1D37] uppercase tracking-tight mb-6">User Profile Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">User Reference ID</p>
                                        <p className="text-gray-700 font-bold">USR-{managedUser.id.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Role</p>
                                        <p className="text-gray-700 font-black uppercase tracking-wide">{managedUser.role}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</p>
                                        <p className="text-gray-700 font-semibold">{managedUser.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                                        <p className="text-gray-700 font-semibold">{managedUser.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Created At</p>
                                        <p className="text-gray-700 font-semibold">{new Date(managedUser.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Database Update</p>
                                        <p className="text-gray-700 font-semibold">{new Date(managedUser.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'joined' && (
                        <div>
                            {totalJoined > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Event Title</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Distance</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Registration Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Finish Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {managedUser.registrations.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        {reg.event.banner_url ? (
                                                            <img 
                                                                src={`/storage/${reg.event.banner_url}`} 
                                                                alt="" 
                                                                className="h-10 w-16 object-cover rounded-lg shadow-sm border border-gray-100"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-100">
                                                                No Banner
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-black italic text-base text-[#0A1D37] leading-tight">{reg.event.title}</p>
                                                            <p className="text-xs text-gray-400 font-semibold">{new Date(reg.event.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-[#0A1D37]">{reg.event.distance} KM</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-semibold text-gray-600 capitalize">{reg.gender}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(reg.status)}`}>
                                                        {reg.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-gray-700 font-mono">{reg.finish_time || '-- : -- : --'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-16 flex flex-col items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <p className="text-gray-400 font-bold italic text-lg mb-1">No joined events</p>
                                    <p className="text-sm text-gray-400 max-w-sm text-center">This user has not registered for any events yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'created' && isPrivileged && (
                        <div>
                            {organizedEvents > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Event Details</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Distance</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Max Participants</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {managedUser.created_events.map((event) => (
                                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        {event.banner_url ? (
                                                            <img 
                                                                src={`/storage/${event.banner_url}`} 
                                                                alt="" 
                                                                className="h-10 w-16 object-cover rounded-lg shadow-sm border border-gray-100"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-100">
                                                                No Banner
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-black italic text-base text-[#0A1D37] leading-tight">{event.title}</p>
                                                            <p className="text-xs text-gray-400 font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-[#0A1D37]">{event.distance} KM</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-semibold text-gray-600 truncate max-w-[200px] inline-block">{event.location}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-gray-700">{event.max_participants || 'Unlimited'} pax</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-16 flex flex-col items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    <p className="text-gray-400 font-bold italic text-lg mb-1">No organised events</p>
                                    <p className="text-sm text-gray-400 max-w-sm text-center">This user has not created or organized any events yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
