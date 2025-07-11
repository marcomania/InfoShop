<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{
    public function index()
    {
        $imageUrl = '';
        if (app()->environment('production')) $imageUrl = 'public/';

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl . $settingArray['shop_logo'];
        $settingArray['tinymce'] = asset('tinymce/tinymce.min.js');
        // Render the 'Settings' component with data
        return Inertia::render('Settings/Settings', [
            'settings' => $settingArray,
            'pageLabel' => 'Settings',
        ]);
    }

    public function quoteTemplate()
    {
        $imageUrl = '';
        if (app()->environment('production')) $imageUrl = 'public/';
        $id = 2;

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl . $settingArray['shop_logo'];
        $sale = \App\Models\Sale::select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'stores.address',
            'contacts.name', // Customer name from contacts
            'sales.created_by',
            'invoice_number',
            'stores.sale_prefix',
            'stores.contact_number',
            'sales.created_at'
        )
            ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
            ->join('stores', 'sales.store_id', '=', 'stores.id')
            ->where('sales.id', $id)
            ->first();

        $user = \App\Models\User::find($sale->created_by);

        $salesItems = \App\Models\SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.discount',
            'products.name',
        )
            ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
            ->where('sale_items.sale_id', $id)
            ->get();

        $templateName = 'quote-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/QuoteTemplate', [
            'pageLabel' => 'Quote Template',
            'template' => $content,
            'sale' => $sale,
            'salesItems' => $salesItems,
            'settings' => $settingArray,
            'user_name' => $user->name,
            'template_name' => $templateName,
        ]);
    }

    public function receiptTemplate()
    {
        $imageUrl = '';
        if (app()->environment('production')) $imageUrl = 'public/';
        $id = 2;

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl . $settingArray['shop_logo'];
        $sale = \App\Models\Sale::select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'stores.address',
            'contacts.name', // Customer name from contacts
            'sales.created_by',
            'invoice_number',
            'stores.sale_prefix',
            'stores.contact_number',
            'sales.created_at'
        )
            ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
            ->join('stores', 'sales.store_id', '=', 'stores.id')
            ->where('sales.id', $id)
            ->first();

        $user = \App\Models\User::find($sale->created_by);

        $salesItems = \App\Models\SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.discount',
            'products.name',
        )
            ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
            ->where('sale_items.sale_id', $id)
            ->get();

        $templateName = 'receipt-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/QuoteTemplate', [
            'pageLabel' => 'Receipt Template',
            'template' => $content,
            'sale' => $sale,
            'salesItems' => $salesItems,
            'settings' => $settingArray,
            'user_name' => $user->name,
            'template_name' => $templateName,
        ]);
    }

    public function barcodeTemplate()
    {
        $imageUrl = '';
        if (app()->environment('production')) $imageUrl = 'public/';

        $settings = Setting::whereIn('meta_key', [
            'show_barcode_store',
            'show_barcode_product_price',
            'show_barcode_product_name',
            'barcode_settings',
            'shop_logo',
        ])->get();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl . $settingArray['shop_logo'];

        $templateName = 'barcode-template.html'; // or get this from the request
        $templatePath = storage_path("app/public/templates/{$templateName}");
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        $product = [
            'name' => 'ABC Product - XML',       // Product name
            'barcode' => '8718719850268',    // Product barcode
            'price' => 1000           // Price from the product batch
        ];

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/BarcodeTemplate', [
            'pageLabel' => 'Barcode Template',
            'template' => $content,
            'barcode_settings' => $settingArray,
            'product' => $product,
            'template_name' => $templateName,
        ]);
    }

    public function customCSS()
    {
        $templatePath = public_path('css/custom.css');
        $content = File::exists($templatePath) ? File::get($templatePath) : '';

        // $templatePath = resource_path('views/templates/quote-template.html');
        // $content = File::exists($templatePath) ? File::get($templatePath) : '';

        return Inertia::render('Settings/CustomCSS', [
            'pageLabel' => 'Custom CSS',
            'customCSS' => $content,
        ]);
    }

    public function updateCustomCSS(Request $request)
    {
        $validated = $request->validate([
            'template' => 'required|string',
        ]);

        $filePath = public_path('css/custom.css');
        file_put_contents($filePath, $request->template);

        return response()->json(['message' => 'Template updated successfully!'], 200);
    }
    public function updateTemplate(Request $request)
    {
        $validated = $request->validate([
            'template' => 'required|string',
            'template_name' => 'required'
        ]);

        //$templateName = 'quote-template.html'; // or get this from the request
        $templateName = $request->template_name;
        $templatePath = storage_path("app/public/templates/{$templateName}");
        // $templatePath = storage_path('views/templates/quote-template.html');
        File::put($templatePath, $validated['template']);

        return response()->json(['message' => 'Template updated successfully!'], 200);
    }

    public function update(Request $request)
    {
        $setting_type = $request->setting_type;
        $settingsData = $request->only(['sale_receipt_note', 'shop_name', 'sale_print_padding_right', 'sale_print_padding_left', 'sale_print_font', 'show_barcode_store', 'show_barcode_product_price', 'show_barcode_product_name', 'show_receipt_shop_name', 'sale_receipt_second_note',]);

        if ($setting_type == 'shop_information') {
            $request->validate([
                'shop_name' => 'required|string',
                'shop_logo' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        } 
        else if ($setting_type == "receipt") 
        {
            
        } 
        else if ($setting_type == "barcode") 
        {
            $settingsData['show_barcode_store'] = $request->has('show_barcode_store') ? 'on' : 'off';
            $settingsData['show_barcode_product_price'] = $request->has('show_barcode_product_price') ? 'on' : 'off';
            $settingsData['show_barcode_product_name'] = $request->has('show_barcode_product_name') ? 'on' : 'off';

            // Add barcode settings JSON string to settingsData if it exists
            if ($request->has('barcodeSettings')) {
                $settingsData['barcode_settings'] = $request->input('barcodeSettings');
            }
        }
        else if ($setting_type == 'misc_settings') {
            $miscSettings = [
                'optimize_image_size' => $request->input('optimize_image_size'),
                'optimize_image_width' => $request->input('optimize_image_width'),
                'cheque_alert' => $request->input('cheque_alert'),
                'product_alert' => $request->input('product_alert'),
                'cart_first_focus' => $request->input('cart_first_focus'),
            ];
            $settingsData['misc_settings'] = json_encode($miscSettings);
        } 
        else if ($setting_type == 'modules') 
        {
            $settingsData['modules'] = $request->input('modules');
        } 
        else if ($setting_type == 'mail_settings') 
        {
            $miscSettings['mail_host'] = $request->input('mail_host');
            $miscSettings['mail_port'] = $request->input('mail_port');
            $miscSettings['mail_username'] = $request->input('mail_username');
            $miscSettings['mail_password'] = $request->input('mail_password');
            $miscSettings['mail_encryption'] = $request->input('mail_encryption');
            $miscSettings['mail_from_address'] = $request->input('mail_from_address');
            $miscSettings['mail_from_name'] = $request->input('mail_from_name');
            $miscSettings['admin_email'] = $request->input('admin_email');
            $settingsData['mail_settings'] = json_encode($miscSettings);
        }
        else if ($setting_type == 'telegram_settings')
        {
            $miscSettings['token'] = $request->input('token');
            $miscSettings['chat_id'] = $request->input('chat_id');
            $settingsData['telegram_settings'] = json_encode($miscSettings);
        }
        else if ($setting_type == 'loyalty_points_settings')
        {
            $loyaltyPointsSettings = [
                'amount_per_point' => $request->input('amount_per_point'), // 50 Rs = 1 point
                'max_points_per_purchase' => $request->input('max_points_per_purchase'), // Max points per purchase
                'points_expiration_days' => $request->input('points_expiration_days'), // Days before points expire
                'min_points_for_redeem' => $request->input('min_points_for_redeem'), // Min points for redemption
            ];
            $settingsData['loyalty_points_settings'] = json_encode($loyaltyPointsSettings);
        }

        foreach ($settingsData as $metaKey => $metaValue) {
            if ($metaValue !== null) { // Ensure the value is not null before updating
                Setting::updateOrCreate(
                    ['meta_key' => $metaKey],
                    ['meta_value' => $metaValue]
                );
            }
        }

        // Handle image upload if a file is present
        if ($request->hasFile('shop_logo')) {
            $image = $request->file('shop_logo');

            // Retrieve the current shop logo path from the database
            $currentImage = Setting::where('meta_key', 'shop_logo')->first();

            if ($currentImage) {
                $currentImagePath = public_path($currentImage->meta_value);

                // Check if the file exists and delete it
                if (file_exists($currentImagePath)) {
                    unlink($currentImagePath);
                }
            }

            $folderPath = 'uploads/' . date('Y') . '/' . date('m');
            $imageUrl = $image->store($folderPath, 'public');

            // Update the 'shop_logo' setting in the database with the image path
            Setting::updateOrCreate(
                ['meta_key' => 'shop_logo'],
                ['meta_value' => 'storage/' . $imageUrl]
            );
        }

        // Handle image upload if a file is present for app_icon
        if ($request->hasFile('app_icon')) {
            $image = $request->file('app_icon');

            // Retrieve the current shop logo path from the database
            $currentImage = Setting::where('meta_key', 'app_icon')->first();

            if ($currentImage) {
                $currentImagePath = public_path($currentImage->meta_value);

                // Check if the file exists and delete it
                if (file_exists($currentImagePath)) {
                    unlink($currentImagePath);
                }
            }

            $folderPath = 'uploads/' . date('Y') . '/' . date('m');
            $imageUrl = $image->store($folderPath, 'public');

            // Update the 'app_icon' setting in the database with the image path
            Setting::updateOrCreate(
                ['meta_key' => 'app_icon'],
                ['meta_value' => 'storage/' . $imageUrl]
            );
        }

        return response()->json(['message' => 'Setting has been updated successfully!'], 200);
    }

    public function updateModule($action, Request $request)
    {
        $module = $request->input('module');
        $setting = Setting::where('meta_key', 'modules')->first();
        $modules = $setting ? explode(',', $setting->meta_value) : [];

        if ($action == 'activate') {
            if (!in_array($module, $modules)) {
                $modules[] = $module;
            }
        } elseif ($action == 'deactivate') {
            if (($key = array_search($module, $modules)) !== false) {
                unset($modules[$key]);
            }
        }
    
        $modules = implode(',', array_filter($modules));

        Setting::updateOrCreate(
            ['meta_key' => 'modules'],
            ['meta_value' => $modules]
        );

        return response()->json(['message' => 'Modules have been updated successfully!'], 200);
    }

    public function getTemplate(Request $request)
    {
        $templateName = $request->template_name;
        $setting = Setting::where('meta_key', $templateName)->first();
        $template = $setting && $setting->meta_value ? $setting->meta_value : '';

        return response()->json(['template' => $template], 200);
    }

    public function saveTemplate(Request $request)
    {
        $templateName = $request->template_name;
        $template = $request->template;
        Setting::updateOrCreate(
            ['meta_key' => $templateName],
            ['meta_value' => $template]
        );
        return response()->json(['message' => 'Template updated successfully!'], 200);
    }
}
