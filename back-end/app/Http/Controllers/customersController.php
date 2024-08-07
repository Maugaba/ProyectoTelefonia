<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\customers;
use App\Models\roles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
class customersController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $customers = customers::where('state', $state)->get();
        $data = [];

        foreach ($customers as $customer) {
            $rol = roles::findOrFail($customer->id_rol);
            $rol_name = $rol->name; 
            $model = [
                "id" => $customer->id,
                "name" => $customer->name,
                "lastname" => $customer->lastname,
                "user" => $customer->customer,
                "working_days" => $customer->working_days,
                "state" => $customer->state,
                "rol" => $rol_name,
                "created_at" => $customer->created_at,
                "updated_at" => $customer->updated_at
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

    public function register()
    {
        try {
            $customer = new users();
            $customer->name = $_POST['name'];
            $customer->lastname = $_POST['lastname'];
            $customer->customer = $_POST['customer'];
            $customer->password = bcrypt($_POST['password']);
            $customer->id_rol = $_POST['id_rol'];
            $customer->working_days = $_POST['working_days'];
            $customer->state = "Activo";
            $customer->save();
    
            return response()->json([
                'success' => 'Usuario creado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos al crear el usuario',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el usuario',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function change($id)
    {
        $customer = users::findOrFail($id);
        if($customer){
            $customer->state = $customer->state == 'Activo' ? 'Inactivo' : 'Activo';
            $customer->save();
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }
    
}
