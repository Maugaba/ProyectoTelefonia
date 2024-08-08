<?php

namespace App\Http\Controllers;

use App\Models\Suppliers;
use Illuminate\Database\QueryException;
class suppliersController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $suppliers = Suppliers::where('state', $state)->get();
        foreach ($suppliers as $supplier) {
            $model = [
                "id" => $supplier->id,
                "name" => $supplier->name,
                "contact_name" => $supplier->contact_name,
                "contact_email" => $supplier->contact_email,
                "contact_phone" => $supplier->contact_phone,
                "address" => $supplier->address,
                "state" => $supplier->state,
                "created_at" => $supplier->created_at,
                "updated_at" => $supplier->updated_at
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
            $supplier = new Suppliers();
            $supplier->name = $_POST['name'];
            $supplier->contact_name = $_POST['contact_name'];
            $supplier->contact_email = $_POST['contact_email'];
            $supplier->contact_phone = $_POST['contact_phone'];
            $supplier->address = $_POST['address'];
            $supplier->state = $_POST['state'];
            $supplier->save();
    
            return response()->json([
                'success' => 'Proveedor creado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos al crear el proveedor',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el proveedor',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function change($id)
    {
        $supplier = Suppliers::findOrFail($id);
        if($supplier){
            $supplier->state = $supplier->state == 'Activo' ? 'Inactivo' : 'Activo';
            $supplier->save();
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }

    public function update($id){
        $supplier = Suppliers::findOrFail($id);
        if($supplier){
            try {
                $supplier->name = $_POST['name'];
                $supplier->contact_name = $_POST['contact_name'];
                $supplier->contact_email = $_POST['contact_email'];
                $supplier->contact_phone = $_POST['contact_phone'];
                $supplier->address = $_POST['address'];
                $supplier->state = $_POST['state'];
                $supplier->save();
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
