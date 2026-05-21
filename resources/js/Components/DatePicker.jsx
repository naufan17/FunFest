import { useState, useEffect, useRef, useMemo } from 'react';

export default function DatePicker({ value = '', onChange, label = '', error = null, minDate = null, maxDate = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef(null);

    // Parse the value to date - handle undefined and null
    const selectedDate = value ? new Date(value) : null;

    // Memoize minDate and maxDate to prevent recalculation on every render
    const memoizedMinDate = useMemo(() => minDate, [minDate]);
    const memoizedMaxDate = useMemo(() => maxDate, [maxDate]);

    // Get the first day of the month and number of days
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Fill empty spaces for days before month starts
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Fill in the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    // Handle date selection
    const handleDateSelect = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const formattedDate = newDate.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    // Handle previous month
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    // Handle next month
    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    // Format date for display
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'Select Date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Check if date is valid (within min/max range)
    const isDateDisabled = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        
        if (memoizedMinDate && dateStr < memoizedMinDate) return true;
        if (memoizedMaxDate && dateStr > memoizedMaxDate) return true;
        return false;
    };

    // Check if date is selected
    const isDateSelected = (day) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        );
    };

    // Check if date is today
    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    // Close calendar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // If selected date changes externally, update current month view
    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
        }
    }, [value]);

    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="relative w-full" ref={calendarRef}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full rounded-xl border shadow-sm transition-all duration-200 flex items-center justify-between p-2.5
                    ${error 
                        ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
                        : isOpen
                        ? 'border-[#FF5722] focus:border-[#FF5722] focus:ring-[#FF5722]'
                        : 'border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722] hover:border-[#FF5722]'
                    } bg-white text-[#0A1D37]
                `}
            >
                <span className="flex items-center gap-2 text-sm">
                    <span className="text-base">📅</span>
                    <span>{formatDisplayDate(value)}</span>
                </span>
                <span className={`transition-transform text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Calendar Popup */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 p-4">
                    {/* Month/Year Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#FF5722] font-bold"
                        >
                            ◀
                        </button>
                        <div className="text-center font-black text-lg text-[#0A1D37] min-w-[200px]">
                            {monthYear}
                        </div>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[#FF5722] font-bold"
                        >
                            ▶
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs font-black text-gray-500 py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => day && !isDateDisabled(day) && handleDateSelect(day)}
                                disabled={!day || isDateDisabled(day)}
                                className={`
                                    p-2 text-sm font-bold rounded-lg transition-all
                                    ${!day ? 'invisible' : ''}
                                    ${isDateDisabled(day)
                                        ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                        : isDateSelected(day)
                                        ? 'bg-[#FF5722] text-white shadow-lg font-black'
                                        : isToday(day)
                                        ? 'bg-blue-100 text-blue-700 font-black border-2 border-blue-500'
                                        : 'text-[#0A1D37] hover:bg-orange-50 hover:text-[#FF5722]'
                                    }
                                `}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                        <span>🔵 Today</span>
                        <span>🟠 Selected</span>
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
    );
}
