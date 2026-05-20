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
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
    role: z.enum(['participant', 'organizer'], { errorMap: () => ({ message: 'Please select a role' }) }),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Please select a gender' }) }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function Register() {
    const [processing, setProcessing] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'participant',
            gender: '',
        }
    });

    const selectedRole = watch('role');
    const selectedGender = watch('gender');

    const onSubmit = (data) => {
        setProcessing(true);
        router.post(route('register'), data, {
            onFinish: () => setProcessing(false),
            onError: (err) => {
                setProcessing(false);
                setBackendErrors(err);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-tight">JOIN THE FEST</h1>
                <p className="text-gray-500">Create your runner profile today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        autoComplete="name"
                        {...register('name')}
                    />
                    <InputError message={errors.name?.message || backendErrors.name} className="mt-2" />
                </div>

                <div className="mt-4">
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
                        autoComplete="new-password"
                        {...register('password')}
                    />
                    <InputError message={errors.password?.message || backendErrors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        {...register('password_confirmation')}
                    />
                    <InputError
                        message={errors.password_confirmation?.message || backendErrors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel value="Register as" />
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        {[
                            { id: 'participant', label: 'Runner', desc: 'I want to join races' },
                            { id: 'organizer', label: 'Organizer', desc: 'I want to host races' }
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setValue('role', r.id, { shouldValidate: true })}
                                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                                    selectedRole === r.id 
                                    ? 'border-[#FF5722] bg-orange-50' 
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <p className={`font-black italic uppercase tracking-wider text-xs ${selectedRole === r.id ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                                    {r.label}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">{r.desc}</p>
                            </button>
                        ))}
                    </div>
                    <InputError message={errors.role?.message || backendErrors.role} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel value="Gender" />
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        {[
                            { id: 'male', label: 'Male', icon: '♂', desc: 'Male category' },
                            { id: 'female', label: 'Female', icon: '♀', desc: 'Female category' }
                        ].map((g) => (
                            <button
                                key={g.id}
                                type="button"
                                id={`gender-${g.id}`}
                                onClick={() => setValue('gender', g.id, { shouldValidate: true })}
                                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                                    selectedGender === g.id
                                    ? 'border-[#FF5722] bg-orange-50'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <p className={`font-black italic uppercase tracking-wider text-xs flex items-center gap-1 ${
                                    selectedGender === g.id ? 'text-[#FF5722]' : 'text-gray-400'
                                }`}>
                                    <span className="text-base">{g.icon}</span> {g.label}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">{g.desc}</p>
                            </button>
                        ))}
                    </div>
                    <InputError message={errors.gender?.message || backendErrors.gender} className="mt-2" />
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Create Account
                    </PrimaryButton>

                    <div className="text-center">
                        <Link
                            href={route('login')}
                            className="text-sm font-bold text-gray-400 hover:text-[#FF5722] transition-colors"
                        >
                            Already have an account? <span className="text-[#FF5722] hover:underline">Log in</span>
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
