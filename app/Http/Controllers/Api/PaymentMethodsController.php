<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ExtensionHelper;
use App\Helpers\PaymentGateway;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

            $methods = [];
            // only load gateways if product has a payable price
            if ($shopProduct->getTotalPrice() > 0) {
                $extensions = PaymentGateway::availableFor($shopProduct);
                foreach ($extensions as $ext) {
                    $name     = basename($ext);
                    $settings = ExtensionHelper::getExtensionSettings($name);
                    if (! $settings->enabled) {
                        continue;
                    }
                    $gateway = new \stdClass();
                    // user‐friendly name
                    $gateway->name  = ExtensionHelper::getExtensionConfig($name, 'name') ?? $name;
                    // logo path
                    $gateway->image = asset('images/Extensions/PaymentGateways/' . strtolower($name) . '_logo.png');
                    $methods[]      = $gateway;
                }
            }

            return response()->json([
                'paymentMethods' => $methods,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("PaymentMethodsController: product {$productId} not found");
            return response()->json([
                'error' => 'Product not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error("PaymentMethodsController error: " . $e->getMessage());
            return response()->json([
                'error' => 'Unable to fetch payment methods'
            ], 500);
        }
    }
}