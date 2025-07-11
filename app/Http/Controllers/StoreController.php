<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function index()
    {
        $currentStoreId = session('store_id');
        $stores = Store::select('id','name', 'address', 'contact_number', 'created_at','sale_prefix', 'current_sale_number')->get();
        return Inertia::render('Store/Store', [
            'stores' => $stores,
            'current_store_id' => $currentStoreId,
            'pageLabel'=>'Stores',
        ]);
    }

    public function store(Request $request)
    {
        // 3. Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:50',
            'sale_prefix' => 'max:5',
            'current_sale_number' => 'required|integer|min:0',
        ]);

        // 4. Save the data to the database
        Store::create($validatedData);

        return Redirect::route('store')->with('success', 'Store created successfully!');
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:50',
            'sale_prefix' => 'max:5',
            'current_sale_number' => 'required|integer|min:0',
        ]);

        // Log activity for sale_prefix if it has changed
        if ($store->sale_prefix != $request->sale_prefix) {
            activity()
                ->performedOn($store)
                ->causedBy(Auth::user())
                ->withProperties(['old_sale_prefix' => $store->sale_prefix, 'new_sale_prefix' => $request->sale_prefix])
                ->log('Updated sale prefix');
        }

        // Log activity for current_sale_number if it has changed
        if ($store->current_sale_number != $request->current_sale_number) {
            activity()
                ->performedOn($store)
                ->causedBy(Auth::user())
                ->withProperties(['old_sale_number' => $store->current_sale_number, 'new_sale_number' => $request->current_sale_number])
                ->log('Updated current sale number');
        }

        // Update the store record
        $store->update($validatedData);

        // Redirect with success message
        return Redirect::route('store')->with('success', 'Store updated successfully!');
    }

    public function changeSelectedStore(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'store_id' => 'required|integer|exists:stores,id', // Ensure store_id is valid
        ]);

        // Set the store_id in the session
        session(['store_id' => $request->store_id]);

        // Optionally return a response
        return response()->json(['message' => 'Store ID updated successfully.']);
    }

}
