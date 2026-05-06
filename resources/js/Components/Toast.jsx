import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

export default function Toast({ message, type = 'success', onClose }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300); // Wait for transition
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const icons = {
        success: (
            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            <Transition
                show={show}
                enter="transition ease-out duration-300"
                enterFrom="transform translate-y-4 opacity-0 scale-95"
                enterTo="transform translate-y-0 opacity-100 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="transform translate-y-0 opacity-100 scale-100"
                leaveTo="transform translate-y-4 opacity-0 scale-95"
            >
                <div className="pointer-events-auto flex items-center gap-4 rounded-3xl border border-white/10 bg-[#0A1D37] p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                        {icons[type]}
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5722]">
                            {type === 'success' ? 'Notification' : 'Error'}
                        </p>
                        <p className="text-sm font-bold text-white mt-1">
                            {message}
                        </p>
                    </div>
                    <button 
                        onClick={() => setShow(false)}
                        className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-white/20 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </Transition>
        </div>
    );
}
