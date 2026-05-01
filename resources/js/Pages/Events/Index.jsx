import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, events }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-start">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">ALL EVENTS</h2>
                        <p className="text-gray-500 mt-1">Discover your next challenge</p>
                    </div>
                </div>
            }
        >
            <Head title="Events" />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.data.map((e) => (
                    <div key={e.id} className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
                        <div className="relative h-48 bg-gray-200">
                            {e.banner_url ? (
                                <img src={e.banner_url} className="h-full w-full object-cover" alt={e.title} />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1D37] to-[#1a3a63]">
                                    <span className="text-4xl">🏃</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0A1D37] backdrop-blur">
                                    {e.distance}
                                </span>
                                {e.date >= new Date().toISOString().split('T')[0] ? (
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

            {events.data.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-2xl font-black italic text-gray-300">NO EVENTS FOUND</p>
                    <p className="text-gray-400 mt-2">Be the first to host one!</p>
                </div>
            )}

            {events.links && events.data.length > 0 && (
                <div className="mt-12 flex justify-center gap-2">
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
