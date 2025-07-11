<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use App\Http\Controllers;
use App\Http\Controllers\Client;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\PaymentMethodsController;

use App\Http\Controllers\Admin\TicketsController as AdminTicketsController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/client', function (Request $request) {
        return response()->json([
            'id'       => rand(1, 1000),
            'name'     => Str::random(8),
            'email'    => Str::random(5) . '@example.com',
            'active'   => (bool) rand(0,1),
            'joinedAt' => now()->toIso8601String(),
        ]);
    });
    Route::get('/motd', [Client\MotdController::class, 'getMotd'])
        ->name('motd.api');
        //->middleware('can:view-motd');
    
    Route::get('/store', [Controllers\StoreController::class, 'getStoreData'])->name('store.api');

    Route::get('/links', [Controllers\Admin\UsefulLinkController::class, 'getJson'])->name('store.api');

    /**
     * Queue / Cron job stream. (Debug purposes)
     */
    Route::get('/queue/stream', [Controllers\QueueStreamController::class, 'stream']);

    /**
     * Voucher API
     */
    Route::post('/vouchers/redeem', [Controllers\Api\VoucherController::class, 'redeem'])->name('voucher.redeem');

    /**
     * Payment Gateway API
     */
    Route::get('/store/product/{id}', [StoreController::class, 'show']);
    Route::get('/payment-methods',    [PaymentMethodsController::class, 'index']);

    /**
     * Servers API for client
     */
    Route::get('/servers', [Controllers\ServerController::class, 'userServersJson'])
        ->name('servers.index.json');

    /**
     * Tickets API
     * 
     * API stuff apiGetCategories
     */
    Route::get('tickets', [Controllers\TicketsController::class, 'apiIndex'])->name('tickets.api.index');
    Route::get('tickets/categories', [Controllers\TicketsController::class, 'apiGetCategories'])->name('tickets.api.index');
    Route::post('tickets', [Controllers\TicketsController::class, 'apiStore'])->name('api.tickets.store');
    Route::get('/tickets/{ticket_id}', [Controllers\TicketsController::class, 'apiShow'])->name('api.tickets.show');
    Route::post('/tickets/{ticket_id}/delete', [AdminTicketsController::class, 'apiDelete'])->name('api.tickets.delete');
    Route::post('/tickets/{ticket_id}/status', [Controllers\TicketsController::class, 'apiChangeStatus'])->name('api.tickets.changeStatus');
});