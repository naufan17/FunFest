import { Link } from '@inertiajs/react';
import Logo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-white">
            {/* Left Side: Image Content */}
            <div className="relative hidden w-1/2 overflow-hidden bg-[#0A1D37] md:flex items-center justify-center">
                <img 
                    src="/images/hero.png" 
                    className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
                    alt="RunFest marathon"
                />
                <div className="relative z-10 p-12 text-white">
                    <h2 className="mb-6 text-5xl font-black italic tracking-tight leading-tight">
                        THE RACE IS<br />
                        <span className="text-[#FF5722]">ONLY STARTING.</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-md">
                        Join the community of thousands of runners and organizers. Your journey to the finish line starts here.
                    </p>
                </div>
                {/* Decorative slant */}
                <div className="absolute top-0 right-0 h-full w-16 bg-white skew-x-[-4deg] translate-x-8"></div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-12 flex justify-center md:justify-start">
                        <Link href="/">
                            <Logo className="h-10" />
                        </Link>
                    </div>

                    <div className="rounded-3xl bg-white p-2 md:p-0">
                        {children}
                    </div>
                </div>
                
                {/* Mobile Footer */}
                <div className="mt-8 text-center text-sm text-gray-400 md:hidden">
                    © 2026 RunFest. Join the Fest.
                </div>
            </div>
        </div>
    );
}
