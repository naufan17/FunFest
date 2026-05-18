import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Users({ auth, users, filters }) {
    const [confirmingAdminCreation, setConfirmingAdminCreation] = useState(false);
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [role, setRole] = useState(filters?.role || '');

    const { delete: deleteUser, processing: deleting } = useForm();
    
    const { 
        data: createData, 
        setData: setCreateData, 
        post: createAdmin, 
        processing: creating, 
        errors: createErrors, 
        reset: resetCreate 
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Debounce search and role filter
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters?.search || '') || role !== (filters?.role || '')) {
                const params = {};
                if (search) params.search = search;
                if (role) params.role = role;
                
                router.get(
                    route('admin.users.index'),
                    params,
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, role]);

    const openCreateModal = () => {
        setConfirmingAdminCreation(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setConfirmingUserDeletion(true);
    };

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        createAdmin(route('admin.users.store'), {
            onSuccess: () => {
                closeModal();
                resetCreate();
            },
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteUser(route('admin.users.destroy', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setConfirmingAdminCreation(false);
        setConfirmingUserDeletion(false);
        setSelectedUser(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">USER MANAGEMENT</h2>
                    <PrimaryButton onClick={openCreateModal} size="lg" className="shadow-xl">
                        Create New Admin
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="mb-6 bg-white p-8 rounded-3xl shadow-md">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
                    <div className="flex-1">
                        <TextInput
                            type="text"
                            className="w-full shadow-sm"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722] rounded-xl shadow-sm p-2.5"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="organizer">Organizer</option>
                            <option value="participant">Participant</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Role</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-black italic text-base text-[#0A1D37]">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                            user.role === 'admin' ? 'bg-[#0A1D37] text-white shadow-md shadow-blue-900/20' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                                        <Link
                                            href={route('admin.users.show', user.id)}
                                            className="group relative p-2 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 inline-flex items-center"
                                            title="View Details"
                                        >
                                            <svg 
                                                className="w-4 h-4" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                                />
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                                />
                                            </svg>
                                            <span className="sr-only">View Details</span>
                                        </Link>

                                        {user.id !== auth.user.id && (
                                            <button 
                                                onClick={() => openDeleteModal(user)}
                                                className="group relative p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 inline-flex items-center"
                                                title="Delete User"
                                            >
                                                <svg 
                                                    className="w-4 h-4" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth="2" 
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                                    />
                                                </svg>
                                                <span className="sr-only">Delete User</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 font-bold italic">
                                    No users found matching "{search}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {users.links && users.data.length > 0 && (
                    <div className="p-8 border-t border-gray-100 flex justify-center gap-2 flex-wrap">
                        {users.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                                    link.active 
                                        ? 'bg-[#0A1D37] text-white shadow-lg' 
                                        : !link.url 
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Create Admin Modal */}
            <Modal show={confirmingAdminCreation} onClose={closeModal} maxWidth="xl">
                <form onSubmit={handleCreateAdmin} className="p-10">
                    <h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37] mb-2 uppercase">
                        Create New Admin
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Register a new administrative account for the RunFest platform.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full rounded-2xl border-gray-100 bg-gray-50/50 focus:border-[#FF5722] focus:ring-[#FF5722]"
                                value={createData.name}
                                onChange={(e) => setCreateData('name', e.target.value)}
                                required
                                isFocused
                                placeholder="Enter full name"
                            />
                            <InputError message={createErrors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full rounded-2xl border-gray-100 bg-gray-50/50 focus:border-[#FF5722] focus:ring-[#FF5722]"
                                value={createData.email}
                                onChange={(e) => setCreateData('email', e.target.value)}
                                required
                                placeholder="admin@runfest.com"
                            />
                            <InputError message={createErrors.email} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full rounded-2xl border-gray-100 bg-gray-50/50 focus:border-[#FF5722] focus:ring-[#FF5722]"
                                    value={createData.password}
                                    onChange={(e) => setCreateData('password', e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                <InputError message={createErrors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    className="mt-1 block w-full rounded-2xl border-gray-100 bg-gray-50/50 focus:border-[#FF5722] focus:ring-[#FF5722]"
                                    value={createData.password_confirmation}
                                    onChange={(e) => setCreateData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                <InputError message={createErrors.password_confirmation} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-10">
                        <SecondaryButton onClick={closeModal} size="md" type="button">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={creating} size="md" className="shadow-xl">
                            {creating ? 'Creating...' : 'Create Account'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete User Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleDelete} className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-red-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-black italic tracking-tight text-[#0A1D37] uppercase">
                            Delete User
                        </h2>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-8">
                        Are you sure you want to delete <span className="text-[#0A1D37] font-bold">{selectedUser?.name}</span>? This action is permanent and will remove all their associated data from the platform.
                    </p>

                    <div className="flex justify-end gap-4 mt-10">
                        <SecondaryButton onClick={closeModal} size="md" type="button">
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="submit" disabled={deleting} size="md">
                            Permanently Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
