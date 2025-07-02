<?php
namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Settings\WebsiteSettings;
use Illuminate\Http\JsonResponse;

class MotdController extends Controller
{
    /**
     * Return the Message-of-the-Day JSON
     */
    public function getMotd(WebsiteSettings $website_settings): JsonResponse
    {
        return response()->json([
            'enabled'  => (bool) $website_settings->motd_enabled,
            'message'  => $website_settings->motd_message,
            'app_name' => config('app.name', 'MOTD'),
        ]);
    }
}