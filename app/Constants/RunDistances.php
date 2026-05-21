<?php

namespace App\Constants;

class RunDistances
{
    // Default run distances
    const DEFAULT_DISTANCES = [
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

    // Distance categories
    const DISTANCE_CATEGORIES = [
        'Sprint' => '1K',
        'Short Run' => '3K',
        'Popular 5K' => '5K',
        'Long Run' => '10K',
        'Half Marathon' => '21K (Half Marathon)',
        'Marathon' => '42.2K (Marathon)',
        'Ultra 50K' => 'Ultra 50K',
        'Ultra 100K' => 'Ultra 100K',
    ];

    /**
     * Get all default distances
     */
    public static function getAll(): array
    {
        return self::DEFAULT_DISTANCES;
    }

    /**
     * Check if a distance is valid
     */
    public static function isValid(string $distance): bool
    {
        return in_array($distance, self::DEFAULT_DISTANCES, true);
    }

    /**
     * Get distance categories
     */
    public static function getCategories(): array
    {
        return self::DISTANCE_CATEGORIES;
    }
}
