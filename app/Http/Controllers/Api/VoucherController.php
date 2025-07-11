<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Auth;

class VoucherController extends Controller
{
    const ALLOWED_INCLUDES = ['users'];

    const ALLOWED_FILTERS = ['code', 'memo', 'credits', 'uses'];

    /**
     * Display a listing of the resource.
     *
     * @return LengthAwarePaginator
     */
    public function index(Request $request)
    {
        $query = QueryBuilder::for(Voucher::class)
            ->allowedIncludes(self::ALLOWED_INCLUDES)
            ->allowedFilters(self::ALLOWED_FILTERS);

        return $query->paginate($request->input('per_page') ?? 50);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'memo' => 'nullable|string|max:191',
            'code' => 'required|string|alpha_dash|max:36|min:4|unique:vouchers',
            'uses' => 'required|numeric|max:2147483647|min:1',
            'credits' => 'required|numeric|between:0,99999999',
            'expires_at' => 'nullable|multiple_date_format:d-m-Y H:i:s,d-m-Y|after:now|before:10 years',
        ]);

        return Voucher::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Voucher|Collection|Model
     */
    public function show(int $id)
    {
        $query = QueryBuilder::for(Voucher::class)
            ->where('id', '=', $id)
            ->allowedIncludes(self::ALLOWED_INCLUDES);

        return $query->firstOrFail();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, int $id)
    {
        $voucher = Voucher::findOrFail($id);

        $request->validate([
            'memo' => 'nullable|string|max:191',
            'code' => "required|string|alpha_dash|max:36|min:4|unique:vouchers,code,{$voucher->id}",
            'uses' => 'required|numeric|max:2147483647|min:1',
            'credits' => 'required|numeric|between:0,99999999',
            'expires_at' => 'nullable|multiple_date_format:d-m-Y H:i:s,d-m-Y|after:now|before:10 years',
        ]);

        $voucher->update($request->all());

        return $voucher;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy(int $id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return $voucher;
    }

    /**
     * get linked users
     *
     * @param  Request  $request
     * @param  Voucher  $voucher
     * @return LengthAwarePaginator
     */
    public function users(Request $request, Voucher $voucher)
    {
        $request->validate([
            'include' => [
                'nullable',
                'string',
                Rule::in(['discorduser']),
            ],
        ]);

        if ($request->input('include') == 'discorduser') {
            return $voucher->users()->with('discordUser')->paginate($request->query('per_page') ?? 50);
        }

        return $voucher->users()->paginate($request->query('per_page') ?? 50);
    }

    /**
     * Redeem a voucher code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function redeem(Request $request)
    {
        // 1. Validate incoming code
        $request->validate([
            'code' => 'required|string|exists:vouchers,code',
        ]);

        // 2. Lookup voucher
        $voucher = Voucher::where('code', $request->input('code'))->firstOrFail();

        // 3. Check expiration
        if ($voucher->expires_at && $voucher->expires_at->isPast()) {
            return response()->json(['message' => 'Voucher has expired.'], 422);
        }

        // 4. Check remaining uses
        if ($voucher->uses < 1) {
            return response()->json(['message' => 'Voucher has no uses remaining.'], 422);
        }

        // 5. Get authenticated user
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 6. Credit the user (assumes `credits` column on users table)
        $user->increment('credits', $voucher->credits);

        // 7. Record usage in pivot (if you have a users() relation)
        $voucher->users()->attach($user->id);

        // 8. Decrement voucher uses
        $voucher->decrement('uses');

        // 9. Return success payload
        return response()->json([
            'success'        => "You have been awarded {$voucher->credits} credits.",
            'credits_added'  => $voucher->credits,
            'remaining_uses' => $voucher->uses,
        ]);
    }
}
