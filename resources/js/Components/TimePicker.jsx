import React, { useState, useRef, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function TimePicker({ label, value, onChange, error, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    const [hours, setHours] = useState(value ? value.split(':')[0] : '07');
    const [minutes, setMinutes] = useState(value ? value.split(':')[1] : '00');

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            setHours(h);
            setMinutes(m);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHourSelect = (h) => {
        setHours(h);
        onChange(`${h}:${minutes}`);
    };

    const handleMinuteSelect = (m) => {
        setMinutes(m);
        onChange(`${hours}:${m}`);
    };

    const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 5 min intervals

    return (
        <div className="relative w-full" ref={popoverRef}>
            {label && <InputLabel value={label} />}
            <div 
                className={`mt-1 flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-colors hover:border-[#FF5722] focus:border-[#FF5722] focus:ring-[#FF5722] ${className}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value || 'Select time...'}
                </span>
                <span className="text-gray-400">🕒</span>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[200px] grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                    <div className="custom-scrollbar h-48 overflow-y-auto pr-2">
                        <div className="sticky top-0 mb-2 bg-white/90 pb-1 text-center text-xs font-black uppercase tracking-widest text-gray-400 backdrop-blur">
                            Hour
                        </div>
                        {hourOptions.map(h => (
                            <div 
                                key={h}
                                onClick={() => handleHourSelect(h)}
                                className={`mb-1 cursor-pointer rounded-lg p-2 text-center transition-colors ${hours === h ? 'bg-[#FF5722] font-bold text-white' : 'text-gray-700 hover:bg-orange-50'}`}
                            >
                                {h}
                            </div>
                        ))}
                    </div>
                    <div className="custom-scrollbar h-48 overflow-y-auto pr-2">
                        <div className="sticky top-0 mb-2 bg-white/90 pb-1 text-center text-xs font-black uppercase tracking-widest text-gray-400 backdrop-blur">
                            Minute
                        </div>
                        {minuteOptions.map(m => (
                            <div 
                                key={m}
                                onClick={() => handleMinuteSelect(m)}
                                className={`mb-1 cursor-pointer rounded-lg p-2 text-center transition-colors ${minutes === m ? 'bg-[#FF5722] font-bold text-white' : 'text-gray-700 hover:bg-orange-50'}`}
                            >
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
