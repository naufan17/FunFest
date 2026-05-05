import React from 'react';
import { Link } from '@inertiajs/react';

export default function Button({
    type,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    as: Component = 'button',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-black uppercase tracking-widest transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-25';
    
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
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        >
            {children}
        </Component>
    );
}
