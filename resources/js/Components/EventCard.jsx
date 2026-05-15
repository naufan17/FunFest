import React from 'react';
import { Link } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function EventCard({ event }) {
    const isIncoming = event.date >= new Date().toISOString().split('T')[0];

    return (
        <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="relative h-48 bg-gray-200">
                {event.banner_url ? (
                    <img src={event.banner_url} className="h-full w-full object-cover" alt={event.title} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1D37] to-[#1a3a63]">
                        <span className="text-4xl">🏃</span>
                    </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0A1D37] backdrop-blur">
                        {event.distance}
                    </span>
                    {isIncoming ? (
                        <span className="rounded-full bg-green-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur shadow-lg shadow-green-500/20">
                            Incoming
                        </span>
                    ) : (
                        <span className="rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur shadow-lg shadow-red-500/20">
                            Outdated
                        </span>
                    )}
                </div>
            </div>
            <div className="p-8">
                <div className="mb-4 flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                </div>
                <h3 className="mb-4 text-xl font-black italic tracking-tight text-[#0A1D37] group-hover:text-[#FF5722] transition-colors">
                    {event.title}
                </h3>
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px]">👤</div>
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[10px] font-bold text-gray-400">+{event.registrations_count}</div>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{event.max_participants - event.registrations_count} slots left</span>
                </div>
                <Button
                    as={Link}
                    href={route('events.show', event.id)}
                    variant="secondary"
                    className="w-full"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}
