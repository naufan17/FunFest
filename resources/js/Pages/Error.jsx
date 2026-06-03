import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Error({ status }) {
    const title = {
        400: '400: Bad Request',
        401: '401: Unauthorized',
        403: '403: Forbidden',
        404: '404: Page Not Found',
        405: '405: Method Not Allowed',
        408: '408: Request Timeout',
        409: '409: Conflict',
        410: '410: Gone',
        413: '413: Payload Too Large',
        414: '414: URI Too Long',
        415: '415: Unsupported Media Type',
        419: '419: Page Expired',
        429: '429: Too Many Requests',
        500: '500: Server Error',
        501: '501: Not Implemented',
        502: '502: Bad Gateway',
        503: '503: Service Unavailable',
        504: '504: Gateway Timeout',
    }[status] || 'Error';

    const description = {
        400: 'Oops! Your request was invalid. Please check your input and try again.',
        401: 'Please log in to access this page. The race is waiting for you!',
        403: 'Sorry, you are forbidden from accessing this page. This area is for authorized personnel only.',
        404: 'Sorry, the page you are looking for could not be found. Maybe it took a wrong turn?',
        405: 'Sorry, the method used for this request is not allowed. Did you take a shortcut?',
        408: 'Your request took too long to complete. Please try again.',
        409: 'There is a conflict with the current state of the resource. Please try again.',
        410: 'This resource no longer exists and will not be available again.',
        413: 'Your request is too large. Please try with a smaller payload.',
        414: 'The URI you provided is too long. Please shorten it and try again.',
        415: 'The media type of your request is not supported. Please use a supported format.',
        419: 'The page expired due to inactivity. Please refresh and try again.',
        429: 'Whoa there, speedster! You are making too many requests. Catch your breath and try again.',
        500: 'Whoops, something went wrong on our servers. Our team is working to fix it!',
        501: 'This feature is not yet implemented. Check back soon!',
        502: 'Bad gateway error. Please try again in a moment.',
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        504: 'The server took too long to respond. Please try again.',
    }[status] || 'An error occurred. Please try again.';

    const icon = {
        400: '🤔',
        401: '🔑',
        403: '🚫',
        404: '🏜️',
        405: '🚫',
        408: '⏱️',
        409: '💥',
        410: '🗑️',
        413: '📦',
        414: '🔗',
        415: '📄',
        419: '⏰',
        429: '🛑',
        500: '💥',
        501: '🚀',
        502: '🌉',
        503: '🚧',
        504: '⏳',
    }[status] || '❌';

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
