import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const schema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    distance: z.string().min(1, 'Distance is required'),
    date: z.string().min(1, 'Race date is required'),
    location: z.string().min(1, 'Location is required'),
    max_participants: z.coerce.number().min(1, 'Must have at least 1 participant'),
    registration_start: z.string().min(1, 'Registration start is required'),
    registration_end: z.string().min(1, 'Registration end is required'),
    race_start_time: z.string().min(1, 'Start time is required'),
    cut_off_time: z.string().min(1, 'Cut-off time is required'),
    organizer_name: z.string().min(1, 'Organizer name is required'),
    contact: z.string().min(1, 'Contact info is required'),
    categories: z.array(z.string()).min(1, 'Select at least one category'),
    banner_image: z.any().optional(),
});

export default function Create() {
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
            categories: [],
        }
    });

    const selectedCategories = watch('categories');

    const onSubmit = (data) => {
        setProcessing(true);
        const submitData = { ...data };
        if (submitData.banner_image && submitData.banner_image.length > 0) {
            submitData.banner_image = submitData.banner_image[0];
        } else {
            delete submitData.banner_image;
        }

        router.post(route('events.store'), submitData, {
            onFinish: () => setProcessing(false),
            onError: (err) => {
                setProcessing(false);
                setBackendErrors(err);
            },
        });
    };

    const toggleCategory = (gender) => {
        const categories = [...selectedCategories];
        const newCategories = categories.includes(gender)
            ? categories.filter(c => c !== gender)
            : [...categories, gender];
        setValue('categories', newCategories, { shouldValidate: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">HOST A NEW EVENT</h2>}
        >
            <Head title="Create Event" />

            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Basic Info */}
                        <div className="space-y-6 md:col-span-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">General Information</h3>
                            <div>
                                <InputLabel htmlFor="title" value="Event Title" />
                                <TextInput id="title" className="mt-1 block w-full" {...register('title')} />
                                <InputError message={errors.title?.message || backendErrors.title} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea 
                                    id="description" 
                                    className="mt-1 block w-full rounded-xl border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722]" 
                                    rows="4" 
                                    {...register('description')}
                                ></textarea>
                                <InputError message={errors.description?.message || backendErrors.description} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="banner_image" value="Event Banner Image (Optional)" />
                                <input 
                                    id="banner_image" 
                                    type="file" 
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#FF5722] hover:file:bg-orange-100" 
                                    {...register('banner_image')}
                                />
                                <InputError message={errors.banner_image?.message || backendErrors.banner_image} className="mt-2" />
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Race Logistics</h3>
                            <div>
                                <InputLabel htmlFor="distance" value="Distance (e.g. 5K, 10K, Marathon)" />
                                <TextInput id="distance" className="mt-1 block w-full" {...register('distance')} />
                                <InputError message={errors.distance?.message || backendErrors.distance} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="date" value="Race Date" />
                                <TextInput id="date" type="date" className="mt-1 block w-full" {...register('date')} />
                                <InputError message={errors.date?.message || backendErrors.date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="location" value="Location" />
                                <TextInput id="location" className="mt-1 block w-full" {...register('location')} />
                                <InputError message={errors.location?.message || backendErrors.location} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Timing & Limits</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Max Participants" />
                                    <TextInput type="number" className="mt-1 block w-full" {...register('max_participants')} />
                                    <InputError message={errors.max_participants?.message || backendErrors.max_participants} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Race Start Time" />
                                    <TextInput type="time" className="mt-1 block w-full" {...register('race_start_time')} />
                                    <InputError message={errors.race_start_time?.message || backendErrors.race_start_time} className="mt-2" />
                                </div>
                             </div>
                             <div>
                                <InputLabel value="Cut-off Time" />
                                <TextInput type="time" className="mt-1 block w-full" {...register('cut_off_time')} />
                                <InputError message={errors.cut_off_time?.message || backendErrors.cut_off_time} className="mt-2" />
                             </div>
                        </div>

                        {/* Registration Dates */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Registration Window</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Starts" />
                                    <TextInput type="date" className="mt-1 block w-full" {...register('registration_start')} />
                                    <InputError message={errors.registration_start?.message || backendErrors.registration_start} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Ends" />
                                    <TextInput type="date" className="mt-1 block w-full" {...register('registration_end')} />
                                    <InputError message={errors.registration_end?.message || backendErrors.registration_end} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Gender Categories</h3>
                            <div className="flex gap-4">
                                {['male', 'female'].map(gender => (
                                    <button
                                        key={gender}
                                        type="button"
                                        onClick={() => toggleCategory(gender)}
                                        className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                                            selectedCategories.includes(gender) 
                                            ? 'bg-[#0A1D37] text-white shadow-lg shadow-blue-900/20' 
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.categories?.message || backendErrors.categories} className="mt-2" />
                        </div>

                        {/* Contact */}
                        <div className="space-y-6 md:col-span-2">
                             <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Organizer Details</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Organizer Name" />
                                    <TextInput className="mt-1 block w-full" {...register('organizer_name')} />
                                    <InputError message={errors.organizer_name?.message || backendErrors.organizer_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Contact (Email/Phone)" />
                                    <TextInput className="mt-1 block w-full" {...register('contact')} />
                                    <InputError message={errors.contact?.message || backendErrors.contact} className="mt-2" />
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <PrimaryButton className="px-12 py-4 text-sm" disabled={processing}>
                            Publish Event
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
