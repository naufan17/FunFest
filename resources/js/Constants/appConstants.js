/**
 * Global Constants for Run Fest Application
 */

// Default run distances available
export const DEFAULT_RUN_DISTANCES = [
    '1K',
    '2K',
    '3K',
    '5K',
    '10K',
    '21K (Half Marathon)',
    '42.2K (Marathon)',
    'Ultra 50K',
    'Ultra 100K',
];

// Run distance categories for filtering
export const RUN_DISTANCE_CATEGORIES = [
    { label: 'Sprint', value: '1K', description: 'Perfect for beginners' },
    { label: 'Short Run', value: '3K', description: 'Quick workout' },
    { label: 'Popular 5K', value: '5K', description: 'Most common race' },
    { label: 'Long Run', value: '10K', description: 'Serious runners' },
    { label: 'Half Marathon', value: '21K (Half Marathon)', description: 'Elite level' },
    { label: 'Marathon', value: '42.2K (Marathon)', description: 'The ultimate challenge' },
    { label: 'Ultra 50K', value: 'Ultra 50K', description: 'Extreme endurance' },
    { label: 'Ultra 100K', value: 'Ultra 100K', description: 'Ultimate challenge' },
];

// Status constants
export const REGISTRATION_STATUS = {
    REGISTERED: 'registered',
    CHECKED_IN: 'checked_in',
    FINISHED: 'finished',
};

export const STATUS_LABELS = {
    registered: 'Registered',
    checked_in: 'Checked In',
    finished: 'Finished',
};

// Gender constants
export const GENDER_OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];

// Event category constants
export const EVENT_CATEGORIES = [
    { label: 'Men', value: 'male' },
    { label: 'Women', value: 'female' },
];

// Ranking badge colors
export const RANK_COLORS = {
    1: { emoji: '🥇', label: '1st Place', color: 'text-yellow-600' },
    2: { emoji: '🥈', label: '2nd Place', color: 'text-gray-500' },
    3: { emoji: '🥉', label: '3rd Place', color: 'text-orange-600' },
};

// Time formatting constants
export const TIME_FORMAT = 'HH:MM:SS';
