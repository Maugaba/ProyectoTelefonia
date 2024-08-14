<?php

namespace App\Http\Controllers;

use App\Models\Product_batches;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class product_batchesController extends Controller
{
    public function get_all()
    {
        $state = $_POST['state'];
        $batches = Product_batches::where('state', $state)->get();
        $data = [];
        foreach ($batches as $batch) {
            $product = Products::findOrFail($batch->product_id);
            $date_in_spanish = Carbon::parse($batch->expiration_date)->locale('es_ES')->isoFormat('dddd D [de] MMMM [de] YYYY');
            $model = [
                'id' => $batch->id,
                'product' => $product->name,
                'batch_number' => $batch->batch_number,
                'expiration_date' => $date_in_spanish,
                'quantity' => $batch->quantity,
                'state' => $batch->state,
                'created_at' => $batch->created_at,
                'updated_at' => $batch->updated_at
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
            DB::beginTransaction();
            $batch = new Product_batches();
            $batch->product_id = $request->product_id;
            $batch->batch_number = $request->batch_number;
            $batch->expiration_date = $request->expiration_date;
            $batch->quantity = $request->quantity;
            $batch->state = 'Activo';
            $batch->save();

            $product = Products::findOrFail($request->product_id);
            $product->quantity = $product->quantity + $batch->quantity;
            $product->save();

            DB::commit();
            return response()->json([
                'success' => 'Lote registrado correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error en la base de datos al registrar el lote',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error inesperado al registrar el lote',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function cancel_batch($id)
    {
        $batch = Product_batches::findOrFail($id);
        if ($batch) {
            try {
                DB::beginTransaction();
                $batch->state = 'Anulado';
                $batch->save();

                $product = Products::findOrFail($batch->product_id);
                $product->quantity = $product->quantity - $batch->quantity;
                $product->save();

                DB::commit();
                return response()->json([
                    'success' => 'Lote cancelado correctamente',
                    'status' => 200
                ], 200);
            } catch (QueryException $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Error en la base de datos al cancelar el lote',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Error inesperado al cancelar el lote',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            }
        }
        return response()->json([
            'message' => 'Error al cancelar el lote, no existe',
            'status' => 401
        ], 401);
    }
}
