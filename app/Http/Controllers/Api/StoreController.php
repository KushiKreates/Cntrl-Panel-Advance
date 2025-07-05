<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShopProduct;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Return a single product for checkout.
     */
    public function show($id)
    {
        $p = ShopProduct::findOrFail($id);

        return response()->json([
            'product' => [
                'id'            => (string)$p->id,
                'type'          => $p->type,
                'display'       => $p->display,
                'description'   => $p->description,
                'price'         => (float)$p->price,
                'quantity'      => $p->quantity,
                'currency_code' => $p->currency_code,
                'disabled'      => (int)$p->disabled,
                'created_at'    => $p->created_at,
                'updated_at'    => $p->updated_at,
            ],
        ]);
    }
}