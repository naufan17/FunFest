<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EventService
{
    public function create(array $data, int $userId): Event
    {
        return DB::transaction(function () use ($data, $userId) {
            $bannerUrl = null;
            if (isset($data['banner_image']) && $data['banner_image']) {
                $path = $data['banner_image']->store('events', 'public');
                $bannerUrl = Storage::url($path);
            }
            
            $event = Event::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'distance' => $data['distance'],
                'location' => $data['location'],
                'date' => $data['date'],
                'race_start_time' => $data['race_start_time'],
                'cut_off_time' => $data['cut_off_time'],
                'max_participants' => $data['max_participants'],
                'registration_start' => $data['registration_start'],
                'registration_end' => $data['registration_end'],
                'organizer_name' => $data['organizer_name'],
                'contact' => $data['contact'],
                'banner_url' => $bannerUrl,
                'created_by' => $userId,
            ]);

            foreach ($data['categories'] as $gender) {
                $event->categories()->create(['gender' => $gender]);
            }

            return $event;
        });
    }

    public function update(Event $event, array $data): Event
    {
        $dataToUpdate = collect($data)->except(['banner_image', 'categories'])->toArray();

        if (isset($data['banner_image'])) {
            if ($event->banner_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $event->banner_url));
            }
            $path = $data['banner_image']->store('events', 'public');
            $dataToUpdate['banner_url'] = Storage::url($path);
        }

        $event->update($dataToUpdate);

        return $event;
    }

    public function delete(Event $event): bool
    {
        return $event->delete();
    }
}
