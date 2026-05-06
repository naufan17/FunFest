import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Toast from '@/Components/Toast';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' });

    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-[#0A1D37]">
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-8 w-auto" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user && (
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="font-bold uppercase tracking-widest text-xs"
                                    >
                                        Dashboard
                                    </NavLink>
                                )}
                                <NavLink
                                    href={route('events.index')}
                                    active={route().current('events.*')}
                                    className="font-bold uppercase tracking-widest text-xs"
                                >
                                    Events
                                </NavLink>
                                {user?.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.*')}
                                        className="font-bold uppercase tracking-widest text-xs text-[#FF5722]"
                                    >
                                        Admin: Users
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#0A1D37] transition duration-150 ease-in-out hover:border-[#FF5722] focus:outline-none"
                                                >
                                                    {user.name}
                                                    <span className="ml-2 inline-block px-2 py-0.5 text-[10px] bg-gray-100 rounded text-gray-500 uppercase">{user.role}</span>
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')} className="text-sm font-bold hover:text-[#FF5722]">Log in</Link>
                                    <Link href={route('register')} className="rounded-full bg-[#FF5722] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#e64a19] shadow-lg shadow-orange-200">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {user && <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>}
                        <ResponsiveNavLink href={route('events.index')} active={route().current('events.*')}>Events</ResponsiveNavLink>
                        {user?.role === 'admin' && (
                            <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.*')}>Admin: Users</ResponsiveNavLink>
                        )}
                    </div>
                    {user ? (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-bold text-[#0A1D37]">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                            </div>
                        </div>
                    ) : (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('login')}>Log in</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>Sign Up</ResponsiveNavLink>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {toast.message && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ message: '', type: 'success' })} 
                />
            )}
        </div>
    );
}
