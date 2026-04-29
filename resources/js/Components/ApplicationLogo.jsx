export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center gap-2 ${props.className}`}>
            <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 45H30" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
                <path d="M5 55H25" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
                <path d="M15 65H35" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
                <path d="M70 25C72.7614 25 75 22.7614 75 20C75 17.2386 72.7614 15 70 15C67.2386 15 65 17.2386 65 20C65 22.7614 67.2386 25 70 25Z" fill="#0A1D37" />
                <path d="M60 35L45 55L55 75L75 60L65 45L80 35H60Z" fill="#0A1D37" />
            </svg>
            <span className="text-2xl font-black tracking-tighter italic">
                <span className="text-[#0A1D37]">Run</span>
                <span className="text-[#FF5722]">Fest</span>
            </span>
        </div>
    );
}
