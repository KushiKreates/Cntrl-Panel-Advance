<?php

namespace App\Http\Controllers;

use App\Models\ShopProduct;
use App\Settings\GeneralSettings;
use App\Settings\UserSettings;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /** 
     * Display a listing of the resource.
     */
    public function index(UserSettings $user_settings, GeneralSettings $general_settings)
    {
        $isStoreEnabled = $general_settings->store_enabled;

        //Required Verification for creating a server
        if ($user_settings->force_email_verification && !Auth::user()->hasVerifiedEmail()) {
            return redirect()->route('profile.index')->with('error', __('You are required to verify your email address before you can purchase credits.'));
        }

        //Required Verification for creating a server
        if ($user_settings->force_discord_verification && !Auth::user()->discordUser) {
            return redirect()->route('profile.index')->with('error', __('You are required to link your discord account before you can purchase Credits'));
        }

        return view('store.index')->with([
            'products' => ShopProduct::where('disabled', '=', false)->orderBy('type', 'asc')->orderBy('price', 'asc')->get(),
            'isStoreEnabled' => $isStoreEnabled,
            'credits_display_name' => $general_settings->credits_display_name
        ]);
    }

    /**
     * Get store data as JSON.
     * 
     * @param UserSettings $user_settings
     * @param GeneralSettings $general_settings
     * @return JsonResponse
     */
    public function getStoreData(UserSettings $user_settings, GeneralSettings $general_settings): JsonResponse
    {
        $isStoreEnabled = $general_settings->store_enabled;

        // Required Verification for creating a server
        if ($user_settings->force_email_verification && !Auth::user()->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'You are required to verify your email address before you can purchase credits.',
                'redirect' => route('profile.index')
            ], 403);
        }

        // Required Verification for creating a server
        if ($user_settings->force_discord_verification && !Auth::user()->discordUser) {
            return response()->json([
                'success' => false,
                'message' => 'You are required to link your discord account before you can purchase Credits',
                'redirect' => route('profile.index')
            ], 403);
        }

        $products = ShopProduct::where('disabled', false)
            ->orderBy('type', 'asc')
            ->orderBy('price', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products,
                'isStoreEnabled' => $isStoreEnabled,
                'credits_display_name' => $general_settings->credits_display_name
            ]
        ]);
    }
}
