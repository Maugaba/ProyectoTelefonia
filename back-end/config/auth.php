<?php

return [

    'defaults' => [
        'guard' => 'web',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'Users', 
            'timeout' => 10800,
        ],
    ],

    'providers' => [
        'Users' => [
            'driver' => 'eloquent',
            'model' => App\Models\Users::class,
        ],

    ],

    'api' => [
        'driver' => 'sanctum',
        'provider' => 'Users',
    ],
];

