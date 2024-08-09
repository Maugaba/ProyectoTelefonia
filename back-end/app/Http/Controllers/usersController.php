<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\users;
use App\Models\roles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
class usersController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $users = Users::where('state', $state)->get();
        $data = [];

        foreach ($users as $user) {
            $rol = roles::findOrFail($user->id_rol);
            $rol_name = $rol->name; 
            $model = [
                "id" => $user->id,
                "name" => $user->name,
                "lastname" => $user->lastname,
                "user" => $user->user,
                "working_days" => $user->working_days,
                "state" => $user->state,
                "rol" => $rol_name,
                "created_at" => $user->created_at,
                "updated_at" => $user->updated_at
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
            $user = new users();
            $user->name = $_POST['name'];
            $user->lastname = $_POST['lastname'];
            $user->user = $_POST['user'];
            $user->password = bcrypt($_POST['password']);
            $user->id_rol = $_POST['id_rol'];
            $user->working_days = $_POST['working_days'];
            $user->state = "Activo";
            $user->save();
    
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
        $user = users::findOrFail($id);
        if($user){
            $user->state = $user->state == 'Activo' ? 'Inactivo' : 'Activo';
            $user->save();
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }

    //PUT
    public function update($id){
        $user = Suppliers::findOrFail($id);
        if($user){
            try {
                $user->name = $_POST['name'];
                $user->lastname = $_POST['lastname'];
                $user->user = $_POST['user'];
                $user->working_days = $_POST['working_days'];
                $user->rol = $_POST['rol'];
                $user->save();
                return response()->json(['success' => 'Proveedor actualizado correctamente', 'status' => 200],200);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Error en la base de datos al actualizar el proveedor',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error inesperado al actualizar el proveedor',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            }
        }
        return response()->json(['message' => 'Error al actualizar el proveedor', 'status' => 401],401);
    }
    
}
