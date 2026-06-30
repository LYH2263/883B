<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        return $this->orderService->getAll();
    }

    public function store(Request $request)
    {
        $request->validate([
            'total_price' => 'required|numeric',
            'customer_name' => 'required|string|max:255',
            'created_at' => 'nullable|date'
        ]);
        
        $data = $request->all();
        
        return $this->orderService->create($data);
    }

    public function show(Order $order)
    {
        return $order;
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'customer_name' => 'string|max:255',
            'created_at' => 'date'
        ]);
        $order->update($request->only(['status', 'total_price', 'customer_name', 'created_at']));
        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }
}
