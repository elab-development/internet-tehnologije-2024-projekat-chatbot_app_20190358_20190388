<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\SubscriptionResource;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Subscription::query();
        if ($request->boolean('only_active', false)) {
            $query->where('is_active', true);
        }
        return SubscriptionResource::collection($query->orderBy('price')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required','string','max:255','unique:subscriptions,name'],
            'price'       => ['required','numeric','min:0'],
            'interval'    => ['required', Rule::in(['monthly','yearly'])],
            'description' => ['nullable','string'],
            'is_active'   => ['boolean'],
        ]);

        $sub = Subscription::create($data);
        return (new SubscriptionResource($sub))->response()->setStatusCode(201);
    }

    public function show(Subscription $subscription)
    {
        return new SubscriptionResource($subscription);
    }

    public function update(Request $request, Subscription $subscription)
    {
        $data = $request->validate([
            'name'        => ['sometimes','string','max:255', Rule::unique('subscriptions','name')->ignore($subscription->id)],
            'price'       => ['sometimes','numeric','min:0'],
            'interval'    => ['sometimes', Rule::in(['monthly','yearly'])],
            'description' => ['nullable','string'],
            'is_active'   => ['boolean'],
        ]);

        $subscription->update($data);
        return new SubscriptionResource($subscription);
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return response()->json(['message' => 'Subscription deleted']);
    }

}
