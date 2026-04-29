import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
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
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'));
    };

    const toggleCategory = (gender) => {
        const categories = [...data.categories];
        if (categories.includes(gender)) {
            setData('categories', categories.filter(c => c !== gender));
        } else {
            setData('categories', [...categories, gender]);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-black italic tracking-tight text-[#0A1D37]">HOST A NEW EVENT</h2>}
        >
            <Head title="Create Event" />

            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl">
                <form onSubmit={submit} className="p-8 md:p-12">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Basic Info */}
                        <div className="space-y-6 md:col-span-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">General Information</h3>
                            <div>
                                <InputLabel htmlFor="title" value="Event Title" />
                                <TextInput id="title" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea id="description" className="mt-1 block w-full rounded-xl border-gray-200 focus:border-[#FF5722] focus:ring-[#FF5722]" rows="4" value={data.description} onChange={(e) => setData('description', e.target.value)} required></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Race Logistics</h3>
                            <div>
                                <InputLabel htmlFor="distance" value="Distance (e.g. 5K, 10K, Marathon)" />
                                <TextInput id="distance" className="mt-1 block w-full" value={data.distance} onChange={(e) => setData('distance', e.target.value)} required />
                                <InputError message={errors.distance} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="date" value="Race Date" />
                                <TextInput id="date" type="date" className="mt-1 block w-full" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="location" value="Location" />
                                <TextInput id="location" className="mt-1 block w-full" value={data.location} onChange={(e) => setData('location', e.target.value)} required />
                                <InputError message={errors.location} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Timing & Limits</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Max Participants" />
                                    <TextInput type="number" className="mt-1 block w-full" value={data.max_participants} onChange={(e) => setData('max_participants', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel value="Race Start Time" />
                                    <TextInput type="time" className="mt-1 block w-full" value={data.race_start_time} onChange={(e) => setData('race_start_time', e.target.value)} required />
                                </div>
                             </div>
                             <div>
                                <InputLabel value="Cut-off Time" />
                                <TextInput type="time" className="mt-1 block w-full" value={data.cut_off_time} onChange={(e) => setData('cut_off_time', e.target.value)} required />
                             </div>
                        </div>

                        {/* Registration Dates */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Registration Window</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Starts" />
                                    <TextInput type="date" className="mt-1 block w-full" value={data.registration_start} onChange={(e) => setData('registration_start', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel value="Ends" />
                                    <TextInput type="date" className="mt-1 block w-full" value={data.registration_end} onChange={(e) => setData('registration_end', e.target.value)} required />
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
                                            data.categories.includes(gender) 
                                            ? 'bg-[#0A1D37] text-white shadow-lg shadow-blue-900/20' 
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.categories} className="mt-2" />
                        </div>

                        {/* Contact */}
                        <div className="space-y-6 md:col-span-2">
                             <h3 className="text-sm font-black uppercase tracking-widest text-[#FF5722]">Organizer Details</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Organizer Name" />
                                    <TextInput className="mt-1 block w-full" value={data.organizer_name} onChange={(e) => setData('organizer_name', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel value="Contact (Email/Phone)" />
                                    <TextInput className="mt-1 block w-full" value={data.contact} onChange={(e) => setData('contact', e.target.value)} required />
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
