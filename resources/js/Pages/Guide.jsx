import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function Guide({ auth }) {
    return (
        <AuthenticatedLayout>
            <Head title="Management Tips - Engage Your Community" />

            <div className="max-w-4xl mx-auto space-y-12 pb-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#0A1D37] to-[#1a3a63] p-8 md:p-16 text-white shadow-2xl">
                    <div className="relative z-10">
                        <Link href={route('dashboard')} className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5722] hover:text-white transition-colors mb-6 inline-block">
                            ← BACK TO DASHBOARD
                        </Link>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300 mt-2">Management Tips</h2>
                        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter leading-tight">ENGAGE YOUR <br className="hidden md:block"/>COMMUNITY</h1>
                        <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl">
                            A great race isn't just about the finish line; it's about the journey and the community you build along the way.
                        </p>
                    </div>
                    <div className="absolute right-[-10%] top-[-10%] text-[15rem] md:text-[20rem] font-black italic opacity-5 pointer-events-none select-none">TIPS</div>
                </div>

                {/* Content Section */}
                <div className="grid gap-8">
                    {/* Tip 1 */}
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-12 shadow-sm transition-all hover:shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 flex h-32 w-32 items-center justify-center rounded-full bg-orange-50 text-6xl opacity-20 transition-transform group-hover:scale-110">
                            📣
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tight text-[#0A1D37] mb-4">1. COMMUNICATE EARLY AND OFTEN</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Don't leave your runners guessing! Use the quick actions panel to send updates. Send a welcome email when they register, a reminder 2 weeks out, and a final logistics email 48 hours before the race. Include parking details, packet pickup times, and weather expectations.
                            </p>
                        </div>
                    </div>

                    {/* Tip 2 */}
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-12 shadow-sm transition-all hover:shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50 text-6xl opacity-20 transition-transform group-hover:scale-110">
                            📱
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tight text-[#0A1D37] mb-4">2. LEVERAGE SOCIAL MEDIA</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Create a specific hashtag for your event. Feature runner profiles, showcase the course terrain, and run pre-race giveaways. Social proof is the best way to hit your registration caps faster for next year's events!
                            </p>
                        </div>
                    </div>

                    {/* Tip 3 */}
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-12 shadow-sm transition-all hover:shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 flex h-32 w-32 items-center justify-center rounded-full bg-green-50 text-6xl opacity-20 transition-transform group-hover:scale-110">
                            🏅
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tight text-[#0A1D37] mb-4">3. STREAMLINE RACE DAY LOGISTICS</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Your check-in process must be flawless. Use your Organizer Dashboard to instantly mark participants as "Checked In" as they arrive. When runners cross the finish line, input their official times immediately so they can see their results dynamically updated in real-time.
                            </p>
                            <Button as={Link} href={route('dashboard')} size="md" className="shadow-xl">
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
