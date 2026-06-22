import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import EventCard from '@/Components/EventCard';

export default function Index({ auth, events, filters, distances }) {
    const [searchVal, setSearchVal] = useState(filters?.search || '');
    const [distanceVal, setDistanceVal] = useState(filters?.distance || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchVal !== (filters?.search || '')) {
                router.get(
                    route('events.index'),
                    {
                        ...filters,
                        search: searchVal,
                        page: 1,
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

    const handleDistanceChange = (val) => {
        setDistanceVal(val);
        router.get(
            route('events.index'),
            {
                ...filters,
                distance: val,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-start">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-[#0A1D37]">ALL EVENTS</h2>
                        <p className="text-gray-500 mt-1">Discover your next challenge</p>
                    </div>
                </div>
            }
        >
            <Head title="Events" />

            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100/70 shadow-sm mb-6 md:mb-8">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input 
                        type="text" 
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search events by title, description or location..."
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#0A1D37] placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] shadow-sm transition-all"
                    />
                </div>
                {/* Filters Dropdown */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <select
                        value={distanceVal}
                        onChange={(e) => handleDistanceChange(e.target.value)}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-black uppercase text-[#0A1D37] focus:outline-none focus:border-[#FF5722] shadow-sm transition-all"
                    >
                        <option value="">All Distances</option>
                        {distances.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>

                    {(searchVal || distanceVal) && (
                        <button
                            onClick={() => {
                                setSearchVal('');
                                setDistanceVal('');
                                router.get(
                                    route('events.index'),
                                    { page: 1 },
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

            <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {events.data.map((e) => (
                    <EventCard key={e.id} event={e} />
                ))}
            </div>

            {events.data.length === 0 && (
                <div className="py-16 md:py-24 text-center">
                    <p className="text-xl md:text-2xl font-black italic text-gray-300">NO EVENTS FOUND</p>
                    <p className="text-gray-400 mt-2">Be the first to host one!</p>
                </div>
            )}

            {events.links && events.data.length > 0 && (
                <div className="mt-8 md:mt-12 flex justify-center gap-1.5 md:gap-2 flex-wrap">
                    {events.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                                link.active 
                                    ? 'bg-[#0A1D37] text-white shadow-lg' 
                                    : !link.url 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#FF5722]'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
