import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Button from '@/Components/Button';

export default function ParticipantTable({ event, participants, filters, isOwner, isAdmin, onStatusUpdate, onResultInput }) {
    const [searchVal, setSearchVal] = useState(filters?.search || '');

    const maskName = (name) => {
        if (isOwner || isAdmin) return name;
        return name.split(' ').map(word => word.charAt(0) + '*'.repeat(Math.max(1, word.length - 1))).join(' ');
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchVal !== (filters?.search || '')) {
                router.get(
                    route('events.show', event.id),
                    {
                        ...filters,
                        search: searchVal,
                        participants_page: 1,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchVal]);

    const handleFilterChange = (key, value) => {
        router.get(
            route('events.show', event.id),
            {
                ...filters,
                [key]: value,
                participants_page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100/70 shadow-sm">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input 
                        type="text" 
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search runner by name or email..."
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#0A1D37] placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] shadow-sm transition-all"
                    />
                </div>
                {/* Filters Dropdown */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <select
                        value={filters?.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-black uppercase text-[#0A1D37] focus:outline-none focus:border-[#FF5722] shadow-sm transition-all"
                    >
                        <option value="">All Statuses</option>
                        <option value="registered">Registered</option>
                        <option value="checked_in">Checked In</option>
                        <option value="finished">Finished</option>
                    </select>

                    <select
                        value={filters?.gender || ''}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-black uppercase text-[#0A1D37] focus:outline-none focus:border-[#FF5722] shadow-sm transition-all"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    {(searchVal || filters?.status || filters?.gender) && (
                        <button
                            onClick={() => {
                                setSearchVal('');
                                router.get(
                                    route('events.show', event.id),
                                    { participants_page: 1 },
                                    { preserveState: true, preserveScroll: true }
                                );
                            }}
                            className="rounded-2xl bg-gray-100 hover:bg-gray-200 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-all"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                <table className="w-full text-left">
                     <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Runner</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Result</th>
                            {isOwner && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {participants.data.map(reg => (
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
                                <td className="px-6 py-6 font-mono font-bold text-sm">
                                    {reg.status === 'finished' ? (
                                        <span className="text-green-600 font-black">{reg.finish_time}</span>
                                    ) : (
                                        <span className="text-gray-300">--:--:--</span>
                                    )}
                                </td>
                                {isOwner && (
                                    <td className="px-6 py-6 text-right space-x-2">
                                        {reg.status === 'registered' && (
                                            <Button onClick={() => onStatusUpdate(reg.id, 'checked_in')} variant="ghost" size="sm">
                                                Check-in
                                            </Button>
                                        )}
                                        {reg.status === 'checked_in' && (
                                            <Button onClick={() => onResultInput(reg.id)} variant="ghost" size="sm" className="text-green-600">
                                                Input Result
                                            </Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {participants.data.length === 0 && (
                    <p className="p-12 text-center text-gray-400 italic">No registrations yet.</p>
                )}

                {participants.links && participants.data.length > 0 && (
                    <div className="border-t border-gray-50 bg-gray-50/30 p-6 flex justify-center gap-2">
                        {participants.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                    link.active 
                                        ? 'bg-[#0A1D37] text-white shadow-lg' 
                                        : !link.url 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#FF5722] border border-gray-100'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
