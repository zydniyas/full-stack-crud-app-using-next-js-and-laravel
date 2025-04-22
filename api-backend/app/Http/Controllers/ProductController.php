<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = auth()->id();
        $products = Product::WHERE('user_id', $user_id)->get();

        return response()->json([
            'status' => true,
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request
        $validatedData = $request->validate([
            'title' => 'required',
            'discription' => 'nullable',
            'price' => 'nullable|numeric',
            'banner_image' => 'nullable|string',
        ]);

        // Add user_id to data
        $validatedData['user_id'] = auth()->id();

        // Handle file upload
        if ($request->hasFile('banner_image')) {
            $validatedData['banner_image'] = $request->file('banner_image')->store('products', 'public');
        }

        // Create the product
        Product::create($validatedData);

        // Return success response
        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'status' => true,
            'message' => ' prodcut data found',
            'product' => $product

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'required',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'banner_image' => 'nullable|string',
        ]);

        if ($request->hasFile('banner_image')) {
            $validatedData['banner_image'] = $request->file('banner_image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully'
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete($product);

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
