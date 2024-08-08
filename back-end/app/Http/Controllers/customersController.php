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
            $model = [
                "id" => $customer->id,
                "name" => $customer->name,
                "email" => $customer->email,
                "phone" => $customer->phone,
                "address" => $customer->address,
                "state" => $customer->state,
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
            $customer->email = $_POST['email'];
            $customer->phone = $_POST['phone'];
            $customer->address = bcrypt($_POST['address']);
            $customer->state = "Activo";
            $customer->save();
    
            return response()->json([
                'success' => 'Cliente creado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos al crear el cliente',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el cliente',
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
