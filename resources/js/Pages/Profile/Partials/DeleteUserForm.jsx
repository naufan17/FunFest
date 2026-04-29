import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8">
                <h2 className="text-xl font-black italic tracking-tight text-red-600 uppercase">
                    Danger Zone
                </h2>
                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Permanently delete your account and all associated race data.
                </p>
            </header>

            <DangerButton 
                onClick={confirmUserDeletion}
                className="rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest"
            >
                DELETE MY ACCOUNT
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10 bg-white rounded-[2.5rem] overflow-hidden">
                    <h2 className="text-3xl font-black italic tracking-tighter text-[#0A1D37] leading-none mb-4">
                        ARE YOU SURE?
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Confirm with Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-12 flex justify-end gap-4">
                        <SecondaryButton 
                            onClick={closeModal}
                            className="rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest"
                        >
                            KEEP ACCOUNT
                        </SecondaryButton>

                        <DangerButton 
                            className="rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest" 
                            disabled={processing}
                        >
                            DELETE FOREVER
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
