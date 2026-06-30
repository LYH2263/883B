<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        return Category::create($data);
    }

    public function show(Category $category)
    {
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        $request->validate(['name' => 'required']);
        $data = $request->all();
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }
        $category->update($data);
        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->noContent();
    }
}
