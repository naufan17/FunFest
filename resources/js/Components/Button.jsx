import React from 'react';
import { Link } from '@inertiajs/react';

export default function Button({
    type,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    processing = false,
    children,
    as: Component = 'button',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-black uppercase tracking-widest transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-[#FF5722] text-white hover:bg-[#e64a19] focus:ring-[#FF5722] shadow-lg shadow-orange-500/20',
        secondary: 'bg-[#0A1D37] text-white hover:bg-[#0d2646] focus:ring-[#0A1D37] shadow-lg shadow-blue-900/20',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/20',
        outline: 'border-2 border-[#0A1D37] bg-transparent text-[#0A1D37] hover:bg-[#0A1D37] hover:text-white focus:ring-[#0A1D37]',
        ghost: 'bg-transparent text-[#0A1D37] hover:bg-gray-100 focus:ring-gray-200',
        white: 'bg-white text-[#0A1D37] hover:bg-gray-50 focus:ring-gray-200 shadow-sm border border-gray-200',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[10px]',
        md: 'px-6 py-3 text-xs',
        lg: 'px-8 py-4 text-sm',
    };

    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;

    return (
        <Component
            {...props}
            type={Component === 'button' ? type : undefined}
            disabled={disabled || processing}
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        >
            {processing && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </Component>
    );
}
