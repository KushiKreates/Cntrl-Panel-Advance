<!DOCTYPE html>
<!-- Nadhi.dev, Ctrlpanel (Bliss) -->
<!-- Bliss is version 1.0 --> 
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-app-env="{{ env('APP_ENV') }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <!-- Preload critical fonts to prevent flash -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" as="style">
        <link rel="preload" href="https://fonts.bunny.net/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" as="style">

        <!-- Load fonts with display=swap to prevent invisible text -->
        <style>
            @import url('https://fonts.bunny.net/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <!-- Flash preventer 5000 -->
        <style>
           
            html {
                font-display: swap;
                /* Dark theme by default to prevent white flash, your welcome :D*/
                background-color: #0a0a0a;
                color: #ffffff;
            }
            
           
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                background-color: #0a0a0a;
                color: #ffffff;
                transition: opacity 0.3s ease-in-out;
            }
            
           
            #nadhi\.dev-app {
                min-height: 100vh;
                background-color: #0a0a0a;
            }
            
            /* Loading spinner to prevent blank screen */
            .app-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #0a0a0a;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.3s ease-in-out;
            }
            
            .app-loading.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
           
            .loading-spinner {
                width: 32px;
                height: 32px;
                border: 2px solid #333;
                border-top: 2px solid #666;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
           
            * {
                box-sizing: border-box;
            }
            
           
            body.loading {
                overflow: hidden;
            }
            
           
            .theme-transition * {
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
            }
        </style>


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


        <!-- Loading management script -->
        <script>
            // Prevent flash by managing loading state
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('loading');
                
                // Hide loading screen after React app mounts
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        const loadingScreen = document.querySelector('.app-loading');
                        if (loadingScreen) {
                            loadingScreen.classList.add('hidden');
                            setTimeout(() => {
                                loadingScreen.remove();
                                document.body.classList.remove('loading');
                            }, 300);
                        }
                    }, 100);
                });
            });
            
            // Handle theme changes smoothly
            window.enableThemeTransition = function() {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 200);
            };
        </script>

        @viteReactRefresh
        @vite('resources/src/main.tsx')
    </head>

    <body>
        <!-- Loading screen -->
        <div class="app-loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="loading-spinner" style="width: 32px; height: 32px; border: 2px solid #333; border-top: 2px solid #666; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 8px; font-weight: 100; font-size: 1rem; color: #fff;">Just a moment — making things pretty.</p>
        </div>
        
        <!-- App container -->
        <div id="nadhi.dev-app"></div>
        
        <!-- Signal to React that DOM is ready -->
        <script>
            window.domReady = true;
        </script>
    </body>

</html>