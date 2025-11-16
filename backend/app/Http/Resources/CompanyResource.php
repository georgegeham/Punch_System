<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'location'       => $this->location,
            'area'           => $this->area,
            'radius'         => $this->radius,
            'requires_hours' => $this->requires_hours,
            'start_time'     => $this->start_time,
            'end_time'       => $this->end_time,
            'hr_id'          => $this->hr_id,
            'created_at'     => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
