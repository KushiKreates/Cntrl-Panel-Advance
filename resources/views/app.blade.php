<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-app-env="{{ env('APP_ENV') }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

         @section('user-data')
         
         <!-- Server Side Props  -->

         <!-- Auth sextion --> 
         <script>
            window.authUser = @json($user);
            window.App = @json(config('app'));
            window.logoUrl = "{{ \Illuminate\Support\Facades\Storage::disk('public')->exists('logo.ico') ? asset('storage/logo.ico') : asset('logo.ico') }}";

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