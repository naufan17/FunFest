<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Event extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'distance',
        'date',
        'location',
        'max_participants',
        'registration_start',
        'registration_end',
        'race_start_time',
        'cut_off_time',
        'organizer_name',
        'contact',
        'banner_url',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categories(): HasMany
    {
        return $this->hasMany(EventCategory::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }
}
