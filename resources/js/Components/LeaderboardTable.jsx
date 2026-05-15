import React from 'react';

export default function LeaderboardTable({ registrations }) {
    const genders = ['male', 'female'];

    return (
        <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
                {genders.map(gender => {
                    const finishers = registrations
                        .filter(r => r.gender === gender && r.status === 'finished')
                        .sort((a, b) => a.finish_time.localeCompare(b.finish_time));

                    return (
                        <div key={gender} className="rounded-3xl border border-gray-100 bg-white p-8">
                            <h4 className="mb-6 text-xl font-black italic tracking-tight uppercase text-[#0A1D37] border-b border-gray-50 pb-4">
                                {gender} LEADERBOARD
                            </h4>
                            <div className="space-y-4">
                                {finishers.map((r, i) => (
                                    <div key={r.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black italic text-gray-200">#{i + 1}</span>
                                            <span className="font-bold">{r.user.name}</span>
                                        </div>
                                        <span className="font-mono font-black text-[#FF5722]">{r.finish_time}</span>
                                    </div>
                                ))}
                                {finishers.length === 0 && (
                                    <p className="text-gray-400 italic text-sm">No results yet.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
