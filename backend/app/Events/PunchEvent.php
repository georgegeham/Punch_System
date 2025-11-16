<?php

namespace App\Events;

use App\Models\Punch;
use App\Models\User;
use App\Repositories\EmployeeRepository;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PunchEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $punch;
    protected $companyId;
    public function __construct(User $user)
    {
        $this->companyId = $user->company_id;
        $punchData = Punch::join('users', 'punches.employee_id', '=', 'users.id')
            ->where('users.company_id', $user->company_id)
            ->select('punches.*', 'users.name as employee_name', 'users.email as employee_email')
            ->latest('punches.created_at')
            ->first();

        // Convert to array to preserve custom attributes
        $this->punch = $punchData ? $punchData->toArray() : null;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('company-' . $this->companyId),
        ];
    }
}
