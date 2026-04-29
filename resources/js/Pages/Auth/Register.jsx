import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-tight">JOIN THE FEST</h1>
                <p className="text-gray-500">Create your runner profile today</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
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
                                onClick={() => setData('role', r.id)}
                                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                                    data.role === r.id 
                                    ? 'border-[#FF5722] bg-orange-50' 
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <p className={`font-black italic uppercase tracking-wider text-xs ${data.role === r.id ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                                    {r.label}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">{r.desc}</p>
                            </button>
                        ))}
                    </div>
                    <InputError message={errors.role} className="mt-2" />
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
