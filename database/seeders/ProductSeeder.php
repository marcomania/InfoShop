<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductBatch;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Contact;
use App\Models\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path to your CSV file
        $filePath = database_path('seeders\products.csv');  // Update this path if necessary

        // Open the file for reading
        if (($handle = fopen($filePath, 'r')) !== false) {
            // Read the header row to get the column names
            $headers = fgetcsv($handle, 0, ';');
            $headers[0] = preg_replace('/[\x{FEFF}]/u', '', $headers[0]); // elimina BOM
            $headers = array_map('trim', $headers);

            DB::beginTransaction();
            try {
                $collections = ['Cama', 'Abrigo/Casual', 'Formal', 'Otros'];

                foreach ($collections as $name) {
                    Collection::create([
                        'collection_type' => 'category',
                        'name' => $name,
                        'slug' => Str::slug($name), // Convierte a minúsculas y reemplaza espacios por guiones
                    ]);
                }                

                // Loop through each row in the CSV file
                while (($row = fgetcsv($handle, 0, ';')) !== false) {
                    // Map the row to an associative array using headers
                    $data = array_combine($headers, $row);

                    // Step 1: Insert into the `products` table
                    // Insert the product and get the product_id
                    $product = Product::create([
                        'barcode' => $data['barcode'],        // barcode
                        'name' => $data['name'],              // name
                        'is_featured' => (boolean) $data['is_featured'], // is_featured (default to 0)
                        'unit' => $data['unit'],
                        'category_id' => $data['category_id'],
                        'is_stock_managed' => false,
                        'quantity' => 0,
                        'alert_quantity' => -1,
                        'created_by' => 1, // Admin user ID, adjust as necessary
                    ]);

                    $contact = Contact::where('name', $data['supplier'])->first();
                    $contactId = $contact ? $contact->id : null;

                    // Step 2: Insert into the `product_batches` table
                    // Insert the batch and get the batch_id
                    $batch = ProductBatch::create([
                        'product_id' => $product->id,           // product_id from the products table
                        'batch_number' => $data['batch_number'],  // batch_number
                        'cost' => (float) str_replace(',', '', $data['cost']),              // cost
                        'price' => (float) str_replace(',', '', $data['price']),            // price
                        'contact_id' => $contactId,
                        'is_featured' => (boolean) $data['is_featured'], 
                        'created_by' => 1,                    // created_by
                    ]);

                    // Step 3: Insert into the `product_stocks` table
                    // Insert the stock data using product_id and batch_id
                    ProductStock::create([
                        'store_id' => 1,                      // store_id (1 in your case)
                        'product_id' => $product->id,         // product_id (from products table)
                        'batch_id' => $batch->id,             // batch_id (from product_batches table)
                        'quantity' => 0,
                        'created_by' => 1,                    // created_by
                    ]);
                }

                // Commit the transaction if everything was successful
                DB::commit();
            } catch (\Exception $e) {
                // Rollback the transaction if an error occurs
                DB::rollBack();
                $this->command->error('Error while seeding: ' . $e->getMessage());
            }

            // Close the file after processing
            fclose($handle);
        }

        $this->command->info('Products, product_batches, and product_stocks tables seeded from CSV!');
    }
}
