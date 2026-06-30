<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create(['name' => '电子产品', 'slug' => 'electronics', 'description' => '各类电子数码产品']);
        Category::create(['name' => '图书书籍', 'slug' => 'books', 'description' => '各类图书刊物']);
        Category::create(['name' => '服装衣物', 'slug' => 'clothing', 'description' => '时尚服装配饰']);
    }
}
