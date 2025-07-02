<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use App\Http\Controllers;
use App\Http\Controllers\Client;

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

    // add more routes here, all share auth:sanctum
});