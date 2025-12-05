@php
    $page = [
        'component' => 'Preview',
        'props' => [
            'activity' => $data,
        ],
        'url' => '/preview',
        'version' => '',
    ];
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Preview</title>
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/Preview.jsx"])
    </head>
    <body class="font-sans antialiased">
        <div id="app" data-page="{{ json_encode($page) }}"></div>
    </body>
</html>
