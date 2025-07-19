<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use Illuminate\Support\Facades\File;

class ContactCsvSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders\contacts.csv');

        if (!File::exists($path)) {
            $this->command->error("CSV file not found at: $path");
            return;
        }

        $csv = array_map('str_getcsv', file($path));
        $header = array_map('trim', $csv[0]);
        unset($csv[0]); // Remove header

        foreach ($csv as $row) {
            $data = array_combine($header, $row);

            Contact::create([
                'name' => $data['name'],
                'type' => 'customer', // Forzar tipo customer
            ]);
        }

        $this->command->info("Customers loaded from CSV!");
    }
}
