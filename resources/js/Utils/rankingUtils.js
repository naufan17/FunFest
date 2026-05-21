/**
 * Calculate rankings based on finish times (ascending - fastest is rank 1)
 * @param {Array} registrations - Array of registration objects with finish_time
 * @returns {Array} - Registrations with added ranking and eventRole properties
 */
export const calculateRankings = (registrations) => {
    // Filter only finished registrations and sort by finish_time
    const finishedRegs = registrations.filter(reg => reg.status === 'finished' && reg.finish_time);
    
    // Sort by finish time (ascending - faster times first)
    const sorted = [...finishedRegs].sort((a, b) => {
        return timeToSeconds(a.finish_time) - timeToSeconds(b.finish_time);
    });
    
    // Add ranking to each registration
    return registrations.map(reg => {
        const finishedIndex = sorted.findIndex(r => r.id === reg.id);
        return {
            ...reg,
            ranking: finishedIndex >= 0 ? finishedIndex + 1 : null,
            eventRole: finishedIndex >= 0 ? getRoleFromRank(finishedIndex + 1) : 'Participant',
        };
    });
};

/**
 * Calculate gender-specific rankings
 * @param {Array} registrations - Array of registration objects
 * @returns {Array} - Registrations with added genderRanking and genderEventRole properties
 */
export const calculateGenderRankings = (registrations) => {
    const finishedRegs = registrations.filter(reg => reg.status === 'finished' && reg.finish_time);
    
    // Group by gender
    const byGender = {};
    finishedRegs.forEach(reg => {
        if (!byGender[reg.gender]) byGender[reg.gender] = [];
        byGender[reg.gender].push(reg);
    });
    
    // Sort each gender group by finish time
    Object.keys(byGender).forEach(gender => {
        byGender[gender].sort((a, b) => timeToSeconds(a.finish_time) - timeToSeconds(b.finish_time));
    });
    
    // Add gender-specific ranking
    return registrations.map(reg => {
        const genderGroup = byGender[reg.gender];
        const genderIndex = genderGroup ? genderGroup.findIndex(r => r.id === reg.id) : -1;
        
        return {
            ...reg,
            genderRanking: genderIndex >= 0 ? genderIndex + 1 : null,
            genderEventRole: genderIndex >= 0 ? getRoleFromRank(genderIndex + 1) : 'Participant',
        };
    });
};

/**
 * Convert time string (HH:MM:SS) to total seconds
 */
const timeToSeconds = (timeStr) => {
    if (!timeStr) return Infinity;
    const parts = timeStr.split(':').map(p => parseInt(p, 10));
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
};

/**
 * Get event role based on rank position
 */
const getRoleFromRank = (rank) => {
    const roles = {
        1: '🥇 1st Place',
        2: '🥈 2nd Place',
        3: '🥉 3rd Place',
    };
    return roles[rank] || `#${rank} Place`;
};

/**
 * Get event role with emoji only
 */
export const getRoleBadge = (rank) => {
    if (!rank) return '🏃 Participant';
    const badges = {
        1: '🥇',
        2: '🥈',
        3: '🥉',
    };
    return badges[rank] || '🏃';
};

/**
 * Format finish time for display
 */
export const formatFinishTime = (timeStr) => {
    return timeStr || '--:--:--';
};
