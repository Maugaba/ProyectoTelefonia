<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Database\QueryException;
class productsController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $products = Products::where('state', $state)->get();
        $data = [];
        foreach ($products as $product) {
            $model = [
                "id" => $product->id,
                "name" => $product->name,
                "description" => $product->description,
                "price" => $product->price,
                "quantity" => $product->quantity,
                "sku" => $product->sku,
                "type" => $product->type,
                "supplier_id" => $product->supplier_id,
                "state" => $product->state,
                "created_at" => $product->created_at,
                "updated_at" => $product->updated_at
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
            $product = new Products();
            $product->name = $_POST['name'];
            $product->description = $_POST['description'];
            $product->price = $_POST['price'];
            $product->quantity = $_POST['quantity'];
            $product->sku = $_POST['sku'];
            $product->type = $_POST['type'];
            $product->supplier_id = $_POST['supplier_id'];
            $product->state = 'Activo';
            $product->save();
    
            return response()->json([
                'success' => 'Producto creado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos al crear el Producto',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el Producto',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function change($id)
    {
        $product = Products::findOrFail($id);
        if($product){
            $product->state = $product->state == 'Activo' ? 'Inactivo' : 'Activo';
            $product->save();
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }

    public function update($id){
        $product = Products::findOrFail($id);
        if($product){
            try {
                $product->name = $_POST['name'];
                $product->description = $_POST['description'];
                $product->price = $_POST['price'];
                $product->quantity = $_POST['quantity'];
                $product->sku = $_POST['sku'];
                $product->type = $_POST['type'];
                $product->supplier_id = $_POST['supplier_id'];
                $product->save();
                return response()->json(['success' => 'Producto actualizado correctamente', 'status' => 200],200);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Error en la base de datos al actualizar el producto',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error inesperado al actualizar el producto',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            }
        }
        return response()->json(['message' => 'Error al actualizar el producto', 'status' => 401],401);
    }
    
}