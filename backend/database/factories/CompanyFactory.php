<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'location' => $this->faker->city,
            'area' => $this->faker->word,
            'radius' => $this->faker->randomElement(['5km', '10km', '15km']),
            'requires_hours' => $this->faker->boolean(40), 
            'start_time' => $this->faker->optional()->time('H:i'),
            'end_time' => $this->faker->optional()->time('H:i'),
            'hr_id' => User::factory()->hr(), 
        ];
    }
}
