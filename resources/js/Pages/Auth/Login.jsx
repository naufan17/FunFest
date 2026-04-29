import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional(),
});

export default function Login({ status, canResetPassword }) {
    const [processing, setProcessing] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        }
    });

    const onSubmit = (data) => {
        setProcessing(true);
        router.post(route('login'), data, {
            onFinish: () => setProcessing(false),
            onError: (err) => {
                setProcessing(false);
                setBackendErrors(err);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-tight">WELCOME BACK</h1>
                <p className="text-gray-500">Log in to your RunFest account</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        autoComplete="username"
                        {...register('email')}
                    />
                    <InputError message={errors.email?.message || backendErrors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        {...register('password')}
                    />
                    <InputError message={errors.password?.message || backendErrors.password} className="mt-2" />
                </div>

                <div className="mt-6 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            {...register('remember')}
                        />
                        <span className="ms-2 text-sm text-gray-500 font-medium">
                            Keep me logged in
                        </span>
                    </label>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Sign In
                    </PrimaryButton>

                    <div className="flex items-center justify-between">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-gray-400 hover:text-[#FF5722] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                        <Link
                            href={route('register')}
                            className="text-sm font-bold text-[#FF5722] hover:underline"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
