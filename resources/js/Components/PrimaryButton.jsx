export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-full border border-transparent bg-[#FF5722] px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#e64a19] focus:bg-[#e64a19] focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-offset-2 active:bg-[#d84315] shadow-lg shadow-orange-500/20 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
