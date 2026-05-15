import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import EventCard from '@/Components/EventCard';

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
                    <EventCard key={e.id} event={e} />
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
