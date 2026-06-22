import React from 'react';

export default function LeaderboardTable({ leaderboard }) {
    const genders = ['male', 'female'];

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
                {genders.map(gender => (
                    <div key={gender} className="rounded-2xl md:rounded-3xl border border-gray-100 bg-white p-5 md:p-8">
                        <h4 className="mb-4 md:mb-6 text-base md:text-xl font-black italic tracking-tight uppercase text-[#0A1D37] border-b border-gray-50 pb-3 md:pb-4">
                            {gender} LEADERBOARD (TOP 10)
                        </h4>
                        <div className="space-y-4">
                            {leaderboard[gender].map((r, i) => (
                                <div key={r.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-base md:text-xl font-black italic text-[#0A1D37]">#{i + 1}</span>
                                        <span className="font-bold text-sm md:text-base">{r.user.name}</span>
                                    </div>
                                    <span className="font-mono font-black text-[#FF5722]">{r.finish_time}</span>
                                </div>
                            ))}
                            {leaderboard[gender].length === 0 && (
                                <p className="text-gray-400 italic text-sm">No results yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
