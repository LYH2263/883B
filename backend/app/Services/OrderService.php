<?php

namespace App\Services;

use App\Models\Order;

class OrderService
{
    public function getAll()
    {
        return Order::latest()->get();
    }

    public function create(array $data)
    {
        return Order::create($data);
    }
}
