import { Head, Link } from '@inertiajs/react';

const Logo = ({ className = "h-8" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Speed Lines */}
            <path d="M10 45H30" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
            <path d="M5 55H25" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
            <path d="M15 65H35" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
            {/* Runner Silhouette */}
            <path d="M70 25C72.7614 25 75 22.7614 75 20C75 17.2386 72.7614 15 70 15C67.2386 15 65 17.2386 65 20C65 22.7614 67.2386 25 70 25Z" fill="#0A1D37" />
            <path d="M60 35L45 55L55 75L75 60L65 45L80 35H60Z" fill="#0A1D37" />
        </svg>
        <span className="text-2xl font-black tracking-tighter italic">
            <span className="text-[#0A1D37]">Run</span>
            <span className="text-[#FF5722]">Fest</span>
        </span>
    </div>
);

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="RunFest - Join the Race, Feel the Fest" />
            <div className="min-h-screen bg-white font-sans text-[#0A1D37]">
                {/* Navigation */}
                <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Logo />
                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="font-medium hover:text-[#FF5722] transition-colors">Features</a>
                            <a href="#how-it-works" className="font-medium hover:text-[#FF5722] transition-colors">How It Works</a>
                            <a href="#about" className="font-medium hover:text-[#FF5722] transition-colors">About</a>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-[#0A1D37] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#1a3a63]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-bold hover:text-[#FF5722]">Log in</Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-[#FF5722] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#e64a19] shadow-lg shadow-orange-200"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/hero.png" 
                            className="h-full w-full object-cover brightness-[0.4]"
                            alt="Marathon runners"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D37] via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                        <div className="mb-6 inline-block rounded-full bg-[#FF5722] px-4 py-1 text-xs font-bold uppercase tracking-widest">
                            Limited slots for Summer Marathon!
                        </div>
                        <h1 className="mb-6 text-5xl font-black italic tracking-tight md:text-8xl">
                            JOIN THE RACE,<br />
                            <span className="text-[#FF5722]">FEEL THE FEST</span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-200 md:text-xl">
                            The ultimate platform for local running events. Whether you're a pro athlete or a casual jogger, find your next challenge and celebrate with the community.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('register')}
                                className="w-full rounded-full bg-[#FF5722] px-10 py-4 text-lg font-black uppercase tracking-wide text-white transition-all hover:scale-105 hover:bg-[#e64a19] sm:w-auto shadow-xl shadow-orange-500/20"
                            >
                                Get Started
                            </Link>
                            <a
                                href="#features"
                                className="w-full rounded-full border-2 border-white px-10 py-4 text-lg font-black uppercase tracking-wide text-white transition-all hover:bg-white hover:text-[#0A1D37] sm:w-auto"
                            >
                                View Events
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-black italic text-[#0A1D37]">BEYOND THE FINISH LINE</h2>
                            <p className="text-gray-500">Everything you need to organize and conquer race day.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title: "Event Management",
                                    desc: "Create and customize your events with professional tools.",
                                    icon: "📅"
                                },
                                {
                                    title: "Easy Registration",
                                    desc: "One-click signups for participants with secure payment handling.",
                                    icon: "⚡"
                                },
                                {
                                    title: "Check-in System",
                                    desc: "Streamlined on-site check-in with QR code support.",
                                    icon: "✅"
                                },
                                {
                                    title: "Leaderboard & Results",
                                    desc: "Real-time tracking and comprehensive race rankings.",
                                    icon: "🏆"
                                }
                            ].map((f, i) => (
                                <div key={i} className="group rounded-2xl bg-white p-8 transition-all hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
                                    <div className="mb-6 text-4xl">{f.icon}</div>
                                    <h3 className="mb-3 text-xl font-bold text-[#0A1D37] group-hover:text-[#FF5722] transition-colors">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid items-center gap-16 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-8 text-4xl font-black italic text-[#0A1D37]">HOW IT WORKS</h2>
                                <div className="space-y-10">
                                    {[
                                        { step: "01", title: "Create or Join", desc: "Organizers can launch an event in minutes. Participants can browse and join nearby races effortlessly." },
                                        { step: "02", title: "Check-in", desc: "Show your digital pass on race day for instant check-in. No more long queues." },
                                        { step: "03", title: "Track Results", desc: "View your finish time, ranking, and community leaderboards instantly after crossing the line." }
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="text-4xl font-black text-[#FF5722]/20">{s.step}</div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-bold text-[#0A1D37]">{s.title}</h3>
                                                <p className="text-gray-500">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 rounded-2xl bg-orange-100/50 blur-2xl"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=800" 
                                    className="relative rounded-2xl shadow-2xl"
                                    alt="Runner tracking"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Target Users & Benefits */}
                <section className="bg-[#0A1D37] py-24 text-white overflow-hidden relative" id="about">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF5722]/5 -skew-x-12 translate-x-1/2"></div>
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid gap-16 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-12 text-4xl font-black italic">WHO IS IT FOR?</h2>
                                <div className="space-y-8">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
                                        <h3 className="mb-4 text-2xl font-bold text-[#FF5722]">For Organizers</h3>
                                        <ul className="space-y-3 text-gray-300">
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Simplified event logistics</li>
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Real-time participant tracking</li>
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Automated result management</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
                                        <h3 className="mb-4 text-2xl font-bold text-[#FF5722]">For Participants</h3>
                                        <ul className="space-y-3 text-gray-300">
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Discover local races in one app</li>
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Digital check-in & race packs</li>
                                            <li className="flex items-center gap-3"><span className="text-[#FF5722]">✓</span> Instant leaderboards & history</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center text-center lg:text-left">
                                <h2 className="mb-6 text-5xl font-black italic leading-tight">BUILT FOR THE<br /><span className="text-[#FF5722]">LOCAL COMMUNITY</span></h2>
                                <p className="mb-12 text-lg text-gray-300">
                                    RunFest focuses on simplicity and engagement. We bring local races to life with professional-grade tools that are accessible to everyone.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <div className="bg-white/10 px-6 py-3 rounded-full border border-white/10">
                                        <span className="text-2xl font-bold block">50+</span>
                                        <span className="text-xs uppercase tracking-widest text-gray-400">Events Hosted</span>
                                    </div>
                                    <div className="bg-white/10 px-6 py-3 rounded-full border border-white/10">
                                        <span className="text-2xl font-bold block">10k+</span>
                                        <span className="text-xs uppercase tracking-widest text-gray-400">Active Runners</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-5xl px-6 text-center">
                        <div className="rounded-[3rem] bg-gradient-to-br from-[#FF5722] to-[#e64a19] px-6 py-20 text-white shadow-2xl">
                            <h2 className="mb-6 text-4xl font-black italic md:text-6xl">READY TO RUN?</h2>
                            <p className="mx-auto mb-10 max-w-xl text-lg text-orange-100">
                                Join thousands of runners today. Register for your first event or start organizing your own.
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-full bg-[#0A1D37] px-12 py-5 text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-black shadow-2xl"
                            >
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 py-12">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <Logo className="h-6" />
                            <div className="flex gap-8 text-sm font-bold text-gray-500">
                                <a href="#" className="hover:text-[#FF5722]">About</a>
                                <a href="#" className="hover:text-[#FF5722]">Contact</a>
                                <a href="#" className="hover:text-[#FF5722]">Terms</a>
                                <a href="#" className="hover:text-[#FF5722]">Privacy</a>
                            </div>
                            <p className="text-sm text-gray-400">© 2026 RunFest. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
