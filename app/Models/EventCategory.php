<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EventCategory extends Model
{
    use HasUuids;

    protected $fillable = [
        'event_id',
        'gender',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
