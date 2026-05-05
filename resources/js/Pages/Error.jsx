import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Error({ status }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
        401: '401: Unauthorized',
        429: '429: Too Many Requests',
        405: '405: Method Not Allowed',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers. Our team is on the track fixing it!',
        404: 'Sorry, the page you are looking for could not be found. Maybe it took a wrong turn?',
        403: 'Sorry, you are forbidden from accessing this page. This area is for authorized personnel only.',
        401: 'Please log in to access this page. The race is waiting!',
        429: 'Whoa there, speedster! You are making too many requests. Catch your breath and try again.',
        405: 'Sorry, the method used for this request is not allowed. Did you take a shortcut?',
    }[status];

    const icon = {
        503: '🚧',
        500: '💥',
        404: '🏜️',
        403: '🚫',
        401: '🔑',
        429: '🛑',
        405: '🚫',
    }[status];

    return (
        <div className="min-h-screen bg-[#0A1D37] flex items-center justify-center px-6 py-12">
            <Head title={title} />
            
            <div className="max-w-xl w-full text-center">
                {/* Visual Element */}
                <div className="mb-8 relative inline-block">
                    <div className="text-9xl font-black italic text-white/5 absolute -top-12 -left-12 select-none">
                        {status}
                    </div>
                    <div className="text-8xl relative z-10 animate-bounce">
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-5xl font-black italic tracking-tighter text-white mb-4 leading-none uppercase">
                    {title}
                </h1>
                
                <p className="text-xl text-gray-400 font-medium mb-12 max-w-md mx-auto leading-relaxed">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto rounded-full bg-[#FF5722] px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all duration-300"
                    >
                        Back to Home
                    </Link>
                    
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto rounded-full bg-white/5 border border-white/10 px-10 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>

                {/* Subtle Branding */}
                <div className="mt-20 flex items-center justify-center gap-2 opacity-20">
                    <span className="h-px w-8 bg-white"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">RunFest</span>
                    <span className="h-px w-8 bg-white"></span>
                </div>
            </div>

            {/* Decorative Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF5722]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
