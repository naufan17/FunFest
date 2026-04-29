import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-xl font-black italic tracking-tight text-[#0A1D37] uppercase">
                    Profile Information
                </h2>
                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-8 max-w-2xl">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400" />
                    <TextInput
                        id="name"
                        className="mt-2 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-[10px] font-black uppercase tracking-widest text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100">
                        <p className="text-sm font-bold text-[#FF5722]">
                            Your email address is unverified.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 text-xs font-black uppercase tracking-widest text-[#0A1D37] hover:underline"
                        >
                            Re-send verification email →
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-[10px] font-black uppercase text-green-600">
                                A new verification link has been sent.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <PrimaryButton className="px-10 py-3 text-xs" disabled={processing}>SAVE CHANGES</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600">
                            Profile Updated Successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
