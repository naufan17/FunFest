import { Link } from '@inertiajs/react';
import Button from '@/Components/Button';

export default function ParticipantTable({ participants, isOwner, isAdmin, onStatusUpdate, onResultInput }) {
    const maskName = (name) => {
        if (isOwner || isAdmin) return name;
        return name.split(' ').map(word => word.charAt(0) + '*'.repeat(Math.max(1, word.length - 1))).join(' ');
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Runner</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        {isOwner && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {participants.data.map(reg => (
                        <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-6 font-bold text-[#0A1D37]">{maskName(reg.user.name)}</td>
                            <td className="px-6 py-6 text-sm text-gray-500 uppercase">{reg.gender}</td>
                            <td className="px-6 py-6">
                                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                    reg.status === 'finished' ? 'bg-green-100 text-green-700' :
                                    reg.status === 'checked_in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-[#FF5722]'
                                }`}>
                                    {reg.status.replace('_', ' ')}
                                </span>
                            </td>
                            {isOwner && (
                                <td className="px-6 py-6 text-right space-x-2">
                                    {reg.status === 'registered' && (
                                        <Button onClick={() => onStatusUpdate(reg.id, 'checked_in')} variant="ghost" size="sm">
                                            Check-in
                                        </Button>
                                    )}
                                    {reg.status === 'checked_in' && (
                                        <Button onClick={() => onResultInput(reg.id)} variant="ghost" size="sm" className="text-green-600">
                                            Input Result
                                        </Button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {participants.data.length === 0 && (
                <p className="p-12 text-center text-gray-400 italic">No registrations yet.</p>
            )}

            {participants.links && participants.data.length > 0 && (
                <div className="border-t border-gray-50 bg-gray-50/30 p-6 flex justify-center gap-2">
                    {participants.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                link.active 
                                    ? 'bg-[#0A1D37] text-white shadow-lg' 
                                    : !link.url 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#FF5722] border border-gray-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveScroll
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
