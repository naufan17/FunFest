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
    banner_image: z.any().optional(),
}).refine((data) => {
    if (!data.registration_start || !data.registration_end) return true;
    return new Date(data.registration_end) >= new Date(data.registration_start);
}, {
    message: 'Registration end date must be after or equal to start date',
    path: ['registration_end'],
});

export default function Edit({ event }) {
    const [processing, setProcessing] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: event.title,
            description: event.description,
            distance: event.distance,
            date: event.date,
            location: event.location,
            max_participants: event.max_participants,
            registration_start: event.registration_start,
            registration_end: event.registration_end,
            race_start_time: event.race_start_time,
            cut_off_time: event.cut_off_time,
            organizer_name: event.organizer_name,
            contact: event.contact,
        }
    });

    const onSubmit = (data) => {
        setProcessing(true);
        const submitData = { ...data, _method: 'patch' };
        if (submitData.banner_image && submitData.banner_image.length > 0) {
            submitData.banner_image = submitData.banner_image[0];
        } else {
            delete submitData.banner_image;
        }

        router.post(route('events.update', event.id), submitData, {
            onFinish: () => setProcessing(false),
            onError: (err) => {
                setProcessing(false);
                setBackendErrors(err);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">EDIT EVENT: {event.title}</h2>}
        >
            <Head title="Edit Event" />

            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <InputLabel value="Event Title" />
                            <TextInput id="title" className="mt-1 block w-full" {...register('title')} />
                            <InputError message={errors.title?.message || backendErrors.title} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel value="Description" />
                            <textarea 
                                id="description"
                                className="mt-1 block w-full rounded-xl border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722]" 
                                rows="8" 
                                {...register('description')}
                            ></textarea>
                            <InputError message={errors.description?.message || backendErrors.description} className="mt-2" />
                        </div>
                        
                        <div className="md:col-span-2 w-fit">
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
                        
                        <div>
                            <InputLabel value="Distance" />
                            <TextInput className="mt-1 block w-full" {...register('distance')} />
                            <InputError message={errors.distance?.message || backendErrors.distance} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Race Date" />
                            <TextInput type="date" className="mt-1 block w-full" {...register('date')} />
                            <InputError message={errors.date?.message || backendErrors.date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Location" />
                            <TextInput className="mt-1 block w-full" {...register('location')} />
                            <InputError message={errors.location?.message || backendErrors.location} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Max Participants" />
                            <TextInput type="number" className="mt-1 block w-full" {...register('max_participants')} />
                            <InputError message={errors.max_participants?.message || backendErrors.max_participants} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel value="Registration Start" />
                            <TextInput type="date" className="mt-1 block w-full" {...register('registration_start')} />
                            <InputError message={errors.registration_start?.message || backendErrors.registration_start} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Registration End" />
                            <TextInput type="date" className="mt-1 block w-full" {...register('registration_end')} />
                            <InputError message={errors.registration_end?.message || backendErrors.registration_end} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Start Time" />
                            <TextInput type="time" className="mt-1 block w-full" {...register('race_start_time')} />
                            <InputError message={errors.race_start_time?.message || backendErrors.race_start_time} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Cut-off Time" />
                            <TextInput type="time" className="mt-1 block w-full" {...register('cut_off_time')} />
                            <InputError message={errors.cut_off_time?.message || backendErrors.cut_off_time} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Organizer Name" />
                            <TextInput className="mt-1 block w-full" {...register('organizer_name')} />
                            <InputError message={errors.organizer_name?.message || backendErrors.organizer_name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Contact Info" />
                            <TextInput className="mt-1 block w-full" {...register('contact')} />
                            <InputError message={errors.contact?.message || backendErrors.contact} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <PrimaryButton size="md" disabled={processing}>
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
