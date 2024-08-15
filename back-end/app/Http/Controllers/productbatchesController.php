<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Productbatches;
use Illuminate\Database\QueryException;
class productbatchesController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $productbatches = Productbatches::where('state', $state)->get();
        $data = [];
        foreach ($productbatches as $productbatche) {
            $model = [
                "id" => $productbatche->id,
                "product_id" => $productbatche->product_id,
                "batch_number" => $productbatche->batch_number,
                "expiration_date" => $productbatche->expiration_date,
                "quantity" => $productbatche->quantity,
                "state" => $productbatche->state,
                "created_at" => $productbatche->created_at,
                "updated_at" => $productbatche->updated_at
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

    public function register(Request $request)
    {
        try {
            $productbatche = new Productbatches();
            $productbatche->product_id = $_POST['product_id'];
            $productbatche->batch_number = $_POST['batch_number'];
            $productbatche->expiration_date = $_POST['expiration_date'];
            $productbatche->quantity = $_POST['quantity'];
            $productbatche->state = 'Activo';
            $productbatche->save();
    
            return response()->json([
                'success' => 'Lote creado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos al crear el Lote',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el Lote',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function change($id)
    {
        $productbatche = Productbatches::findOrFail($id);
        if($productbatche){
            $productbatche->state = $productbatche->state == 'Activo' ? 'Inactivo' : 'Activo';
            $productbatche->save();
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }

    public function update(Request $request, $id){
        $productbatche = Productbatches::findOrFail($id);
        if($productbatche){
            try {
                $productbatche->product_id = $_POST['product_id'];
                $productbatche->batch_number = $_POST['batch_number'];
                $productbatche->expiration_date = $_POST['expiration_date'];
                $productbatche->quantity = $_POST['quantity'];
                $productbatche->save();
                return response()->json(['success' => 'Lote actualizado correctamente', 'status' => 200],200);
            } catch (QueryException $e) {
                return response()->json([
                    'message' => 'Error en la base de datos al actualizar el lote',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error inesperado al actualizar el lote',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            }
        }
        return response()->json(['message' => 'Error al actualizar el producto', 'status' => 401],401);
    }
    
}
