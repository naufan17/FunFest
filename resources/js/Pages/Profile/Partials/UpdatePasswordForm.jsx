import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const schema = z.object({
    current_password: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function UpdatePasswordForm({ className = '' }) {
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        }
    });

    const onSubmit = (data) => {
        setProcessing(true);
        router.put(route('password.update'), data, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setRecentlySuccessful(true);
                reset();
                setTimeout(() => setRecentlySuccessful(false), 2000);
            },
            onError: (err) => {
                setProcessing(false);
                setBackendErrors(err);
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-xl font-black italic tracking-tight text-[#0A1D37] uppercase">
                    Security & Privacy
                </h2>
                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8 max-w-2xl">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                    />
                    <TextInput
                        id="current_password"
                        type="password"
                        className="mt-2 block w-full"
                        {...register('current_password')}
                    />
                    <InputError message={errors.current_password?.message || backendErrors.current_password} className="mt-2" />
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <InputLabel 
                            htmlFor="password" 
                            value="New Password" 
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-2 block w-full"
                            {...register('password')}
                        />
                        <InputError message={errors.password?.message || backendErrors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-2 block w-full"
                            {...register('password_confirmation')}
                        />
                        <InputError message={errors.password_confirmation?.message || backendErrors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <PrimaryButton className="px-10 py-3 text-xs" disabled={processing}>UPDATE SECURITY</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600">
                            Password Secured.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
