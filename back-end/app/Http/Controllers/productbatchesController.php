<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Productbatches;
use App\Models\Products;
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
            $productbatche->product_id = $request->input('product_id');
            $productbatche->batch_number = $request->input('batch_number');
            $productbatche->expiration_date = $request->input('expiration_date');
            $productbatche->quantity = $request->input('quantity');
            $productbatche->state = 'Activo';
            $productbatche->save();
            $product = Products::find($productbatche->product_id);
            $product->quantity = $product->quantity + $request->input('quantity');
            $product->save();
    
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
            if($productbatche->state == 'Inactivo'){
                $product = Products::find($productbatche->product_id);
                $product->quantity = $product->quantity - $productbatche->quantity;
                $product->save();
            }else{
                $product = Products::find($productbatche->product_id);
                $product->quantity = $product->quantity + $productbatche->quantity;
                $product->save();
            }
            return response()->json(['success' => 'Estado actualizado correctamente', 'status' => 200],200);
        }
        return response()->json(['message' => 'Error al actualizar el estado', 'status' => 401],401);
    }


    // Funcion para filtrar los lotes por fecha de expiracion
    public function filter_by_date(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');
    $state = $request->input('state', 'Activo');

    $productbatches = Productbatches::where('state', $state)
        ->whereBetween('expiration_date', [$startDate, $endDate])
        ->get();

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

    return response()->json(['data' => $data]);
}

    
}
