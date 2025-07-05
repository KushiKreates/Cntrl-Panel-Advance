<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->name('api.')
                ->group(base_path('routes/api.php'));
            Route::prefix('api-client')
               // ->middleware('api')
                ->name('api.client')
                ->group(base_path('routes/api-client.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            // Change to 240 api requests per minute
            // This is to allow more requests for API clients
            // and to prevent rate limiting issues with the frontend.
            return Limit::perMinute(240)->by($request->user()?->id ?: $request->ip());
        });
        RateLimiter::for('web', function (Request $request) {
            // Chnage rate limit to 120 requests per minute for web routes
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });
    }
}
