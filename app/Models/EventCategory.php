<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventCategory extends Model
{
    protected $fillable = [
        'event_id',
        'gender',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
