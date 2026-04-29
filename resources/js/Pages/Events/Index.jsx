import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, events }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">ALL EVENTS</h2>
                        <p className="text-gray-500 mt-1">Discover your next challenge</p>
                    </div>
                    {auth.user && auth.user.role !== 'participant' && (
                        <Link
                            href={route('events.create')}
                            className="rounded-full bg-[#FF5722] px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                        >
                            Host Event
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Events" />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.map((e) => (
                    <div key={e.id} className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="relative h-48 bg-gray-200">
                            {e.banner_url ? (
                                <img src={e.banner_url} className="h-full w-full object-cover" alt={e.title} />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1D37] to-[#1a3a63]">
                                    <span className="text-4xl">🏃</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0A1D37] backdrop-blur">
                                {e.distance}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="mb-4 flex items-center justify-between text-xs font-bold text-gray-400">
                                <span>📅 {e.date}</span>
                                <span>📍 {e.location}</span>
                            </div>
                            <h3 className="mb-4 text-xl font-black italic tracking-tight text-[#0A1D37] group-hover:text-[#FF5722] transition-colors">
                                {e.title}
                            </h3>
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px]">👤</div>
                                    ))}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[10px] font-bold text-gray-400">+{e.registrations_count}</div>
                                </div>
                                <span className="text-xs font-bold text-gray-500">{e.max_participants - e.registrations_count} slots left</span>
                            </div>
                            <Link
                                href={route('events.show', e.id)}
                                className="block w-full rounded-full bg-[#0A1D37] py-3 text-center text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-black"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-2xl font-black italic text-gray-300">NO EVENTS FOUND</p>
                    <p className="text-gray-400 mt-2">Be the first to host one!</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
