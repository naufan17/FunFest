import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5722]">Account Settings</h2>
                        <h1 className="text-5xl font-black italic tracking-tighter text-[#0A1D37]">USER PROFILE</h1>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0A1D37] to-[#1a3a63] flex items-center justify-center text-xl">👤</div>
                        <div>
                            <p className="font-black italic text-[#0A1D37] leading-none">{user.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#FF5722] mt-1">{user.role}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="space-y-10">
                <section className="overflow-hidden rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </section>

                <section className="overflow-hidden rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm">
                    <UpdatePasswordForm />
                </section>

                <section className="overflow-hidden rounded-[3rem] border border-red-50 bg-red-50/30 p-10 shadow-sm">
                    <DeleteUserForm />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
