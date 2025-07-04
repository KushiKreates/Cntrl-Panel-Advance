<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ExtensionHelper;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PaymentMethodsController extends Controller
{
    /**
     * Return available payment gateways for a given product.
     */
    public function index(Request $request)
    {
        try {
            $productId   = $request->query('product_id');
            $shopProduct = ShopProduct::findOrFail($productId);

            $paymentGateways = [];
            // only load gateways if there's something to pay
            if ($shopProduct->getTotalPrice() > 0) {
                $extensions = ExtensionHelper::getAllExtensionsByNamespace('PaymentGateways');
                foreach ($extensions as $ext) {
                    $name     = basename($ext);
                    $settings = ExtensionHelper::getExtensionSettings($name);
                    if (! $settings->enabled) {
                        continue;
                    }
                    $gateway            = new \stdClass();
                    $gateway->name      = ExtensionHelper::getExtensionConfig($name, 'name') ?? $name;
                    $gateway->image     = asset('images/Extensions/PaymentGateways/' . strtolower($name) . '_logo.png');
                    $paymentGateways[]  = $gateway;
                }
            }

            return response()->json([
                'paymentGateways' => $paymentGateways,
            ], 200);

        } catch (ModelNotFoundException $e) {
            Log::warning("PaymentMethodsController: product {$productId} not found");
            return response()->json([
                'error' => 'Product not found',
            ], 404);

        } catch (\Exception $e) {
            Log::error("PaymentMethodsController error: " . $e->getMessage());
            return response()->json([
                'error' => 'Unable to fetch payment methods',
            ], 500);
        }
    }
}