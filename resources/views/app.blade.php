<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-app-env="{{ env('APP_ENV') }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

         @section('user-data')
         
         <!-- Server Side Props  -->

         <script>
            window.alertData = {
                enabled: {{ $general_settings->alert_enabled ? 'true' : 'false' }},
                type: "{{ $general_settings->alert_type }}",
                message: `{!! $general_settings->alert_message !!}`
            }
        </script>


         <!-- Auth sextion --> 
         <script>
            window.authUser = @json($user);
            window.App = @json(config('app'));
            window.logoUrl = "{{ \Illuminate\Support\Facades\Storage::disk('public')->exists('logo.ico') ? asset('storage/logo.ico') : asset('logo.ico') }}";

        </script>

        <!-- DO NOT REMOVE! BREAKS THE WHOLE APPLICATION -->
         <script>
            window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            user: @json(Auth::user()),
            app: @json(config('app'))
            }
        </script>

        <script>

                window.checkoutData = @json([
            'paymentGateways' => $paymentGateways ?? [],
            'productIsFree'   => $productIsFree ?? false,
        ]);
        </script>

        <script>
            @if(isset($product))
                window.checkout = {
                    product: {
                        id: "{{ $product->id }}",
                        type: "{{ strtolower($product->type) == 'credits' ? $credits_display_name : $product->type }}",
                        quantity: {{ $product->quantity }},
                        price: {{ $product->price }},
                        formattedPrice: "{{ $product->formatToCurrency($product->price) }}",
                        description: @json($product->description),
                        currency: "{{ $product->currency_code }}",
                    },
                    tax: {
                        percent: {{ $taxpercent }},
                        value: {{ $taxvalue }},
                        formattedValue: "{{ $product->formatToCurrency($taxvalue) }}"
                    },
                    discount: {
                        percent: {{ $discountpercent ?? 0 }},
                        value: {{ $discountvalue ?? 0 }},
                        formattedValue: "{{ $discountvalue ? $product->formatToCurrency($discountvalue) : '' }}"
                    },
                    total: {{ $total }},
                    isFree: {{ $productIsFree ? 'true' : 'false' }},
                    isCouponsEnabled: {{ $isCouponsEnabled ? 'true' : 'false' }},
                };
            @else
                window.checkout = [];
            @endif
        </script>






        <!-- User's Role --> 
        <script>
            window.userRoles = @json($user_role);
         </script>




         


            
        

        



        @viteReactRefresh

       @vite('resources/src/main.tsx')


        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    </head>

    <body>
        <div id="app"></div>
    </body>

</html>