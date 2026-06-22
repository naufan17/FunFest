import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePicker from '@/Components/DatePicker';
import TimePicker from '@/Components/TimePicker';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useMemo } from 'react';
import { DEFAULT_RUN_DISTANCES } from '@/Constants/appConstants';

const schema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title must not exceed 255 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    distance: z.string().min(1, 'Distance is required'),
    date: z.string().min(1, 'Race date is required').refine((val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
    }, { message: 'Race date must be a future date' }),
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
}).refine((data) => {
    if (!data.registration_start || !data.registration_end) return true;
    return new Date(data.registration_end) >= new Date(data.registration_start);
}, {
    message: 'Registration end date must be after or equal to start date',
    path: ['registration_end'],
});

export default function Create() {
    const [processing, setProcessing] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    // Memoize minDate to prevent recalculation on every render
    const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            distance: '',
            date: '',
            location: '',
            max_participants: '',
            registration_start: '',
            registration_end: '',
            race_start_time: '',
            cut_off_time: '',
            organizer_name: '',
            contact: '',
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
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12">
                    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
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
                                    rows="8" 
                                    {...register('description')}
                                ></textarea>
                                <InputError message={errors.description?.message || backendErrors.description} className="mt-2" />
                            </div>
                            <div className="w-fit">
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
                                <InputLabel htmlFor="distance" value="Distance" />
                                <select 
                                    id="distance" 
                                    className="mt-1 block w-full rounded-xl border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722]"
                                    {...register('distance')}
                                >
                                    <option value="">-- Select or enter custom distance --</option>
                                    {DEFAULT_RUN_DISTANCES.map((dist) => (
                                        <option key={dist} value={dist}>{dist}</option>
                                    ))}
                                </select>
                                <InputError message={errors.distance?.message || backendErrors.distance} className="mt-2" />
                                <p className="text-xs text-gray-400 mt-2">💡 Select from common distances or leave blank to enter a custom one</p>
                            </div>
                            <div>
                                <DatePicker
                                    label="Race Date"
                                    value={watch('date') || ''}
                                    onChange={(value) => setValue('date', value, { shouldValidate: true })}
                                    error={errors.date?.message || backendErrors.date}
                                    minDate={minDate}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="location" value="Location" />
                                <TextInput id="location" className="mt-1 block w-full" {...register('location')} />
                                <InputError message={errors.location?.message || backendErrors.location} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Timing & Limits</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Max Participants" />
                                    <TextInput type="number" className="mt-1 block w-full" {...register('max_participants')} />
                                    <InputError message={errors.max_participants?.message || backendErrors.max_participants} className="mt-2" />
                                </div>
                                <div>
                                    <TimePicker
                                        label="Race Start Time"
                                        value={watch('race_start_time') || ''}
                                        onChange={(value) => setValue('race_start_time', value, { shouldValidate: true })}
                                        error={errors.race_start_time?.message || backendErrors.race_start_time}
                                    />
                                </div>
                             </div>
                             <div>
                                <TimePicker
                                    label="Cut-off Time"
                                    value={watch('cut_off_time') || ''}
                                    onChange={(value) => setValue('cut_off_time', value, { shouldValidate: true })}
                                    error={errors.cut_off_time?.message || backendErrors.cut_off_time}
                                />
                             </div>
                        </div>

                        {/* Registration Dates */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Registration Window</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <DatePicker
                                        label="Registration Starts"
                                        value={watch('registration_start') || ''}
                                        onChange={(value) => setValue('registration_start', value, { shouldValidate: true })}
                                        error={errors.registration_start?.message || backendErrors.registration_start}
                                        minDate={minDate}
                                    />
                                </div>
                                <div>
                                    <DatePicker
                                        label="Registration Ends"
                                        value={watch('registration_end') || ''}
                                        onChange={(value) => setValue('registration_end', value, { shouldValidate: true })}
                                        error={errors.registration_end?.message || backendErrors.registration_end}
                                        minDate={watch('registration_start') || minDate}
                                    />
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
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
