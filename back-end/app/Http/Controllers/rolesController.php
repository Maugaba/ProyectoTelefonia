<?php

namespace App\Http\Controllers;

use App\Models\roles;

class rolesController extends Controller
{
    public function get_rol()
    {
        $data = [];
        $rols = roles::all();
        foreach ($rols as $rol) {
            $model = [
                "id" => $rol->id,
                "name" => $rol->name,
                "description" => $rol->description,
                "v_module" => $rol->v_module
            ];
            array_push($data, $model);
        }

        $meta = [
            "page" => 1,
            "pages" => 1,
            "perpage" => 5,
            "total" => count($data)
        ];

        $response = [
            "meta" => $meta,
            "data" => $data
        ];

        return response()->json($response);
    }
}
