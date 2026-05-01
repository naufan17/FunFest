import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Users({ auth, users }) {
    const { patch: updateRole, delete: deleteUser } = useForm();

    const handleRoleChange = (user, newRole) => {
        if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
            updateRole(route('admin.users.role', user.id), {
                data: { role: newRole },
                preserveScroll: true
            });
        }
    };

    const handleDelete = (userId) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            deleteUser(route('admin.users.destroy', userId), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">USER MANAGEMENT</h2>}
        >
            <Head title="User Management" />

            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Role</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-8">
                                    <p className="font-black italic text-lg text-[#0A1D37]">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </td>
                                <td className="px-8 py-8">
                                    <span className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${
                                        user.role === 'admin' ? 'bg-[#0A1D37] text-white shadow-lg shadow-blue-900/20' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-8 text-right space-x-6">
                                    <button 
                                        onClick={() => handleRoleChange(user, user.role === 'admin' ? 'user' : 'admin')}
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                                    >
                                        Change Role
                                    </button>
                                    {user.id !== auth.user.id && (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline"
                                        >
                                            Delete User
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
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
        </AuthenticatedLayout>
    );
}
