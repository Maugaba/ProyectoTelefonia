<?php

namespace App\Http\Controllers;

use App\Models\Sales;
use App\Models\Sale_items;
use App\Models\Customers;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
class salesController extends Controller
{
   
    public function show($id)
    {
        // Buscar la venta por ID
        $sale = Sales::find($id);

        // Verificar si la venta existe
        if (!$sale) {
            return response()->json(['message' => 'Venta no encontrada'], 404);
        }

        // Obtener detalles del cliente
        $customer = Customers::findOrFail($sale->customer_id);

        // Obtener los ítems de la venta
        $items = Sale_items::where('sale_id', $sale->id)->get();

        // Formatear la fecha de la venta
        $date_in_spanish = Carbon::parse($sale->sale_date)->locale('es_ES')->isoFormat('dddd D [de] MMMM [de] YYYY');

        // Crear la respuesta con los detalles de la venta
        $saleDetails = [
            'id' => $sale->id,
            'customer' => $customer->name,
            'total_amount' => $sale->total_amount,
            'sale_date' => $date_in_spanish,
            'notes' => $sale->notes,
            'state' => $sale->state,
            'items_count' => count($items),
            'items_detail' => $items,
            'created_at' => $sale->created_at,
            'updated_at' => $sale->updated_at
        ];

        return response()->json($saleDetails, 200);
    }

   
    public function get_all()
    {
        $state = $_POST['state'];
        $sales = Sales::where('state', $state)->get();
        $data = [];
        foreach ($sales as $sale) {
            $items = Sale_items::where('sale_id', $sale->id)->get();
            $customer = Customers::findOrFail($sale->customer_id);
            $date_in_spanish = Carbon::parse($sale->sale_date)->locale('es_ES')->isoFormat('dddd D [de] MMMM [de] YYYY');
            $model = [
                'id' => $sale->id,
                'customer' => $customer->name,
                'total_amount' => $sale->total_amount,
                'sale_date' => $date_in_spanish,
                'notes' => $sale->notes,
                'state' => $sale->state,
                'items_count' => count($items),
                'items_detail' => $items,
                'created_at' => $sale->created_at,
                'updated_at' => $sale->updated_at
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
            $sale = new Sales();
            $sale->customer_id = $request->customer_id;
            $sale->total_amount = $request->total_amount;
            $sale->sale_date = $request->sale_date;
            $sale->notes = $request->notes;
            $sale->state = 'Vendido';
            $sale->save();
            $sale_id = $sale->id;
            $items = $request->items;
            foreach ($items as $item) {
                $sale_item = new Sale_items();
                $sale_item->sale_id = $sale_id;
                $sale_item->product_id = $item['product_id'];
                $sale_item->quantity = $item['quantity'];
                $sale_item->price = $item['unit_price'];
                $sale_item->total = $item['total_price'];
                $sale_item->save();
                $product = Products::findOrFail($item['product_id']);
                if ($product->quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Error al registrar la venta, no hay suficiente stock',
                        'status' => 401
                    ], 401);
                }
                $product->quantity = $product->quantity - $item['quantity'];
                $product->save();
            }
            DB::commit();
            return response()->json([
                'success' => 'Venta registrada correctamente',
                'status' => 200
            ], 200);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error en la base de datos al registrar la venta',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error inesperado al registrar la venta',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function cancel_sale($id)
    {
        $sale = Sales::findOrFail($id);
        if ($sale) {
            try {
                DB::beginTransaction();
                $sale->state = 'Anulado';
                $sale->save();
                $items = Sale_items::where('sale_id', $id)->get();
                foreach ($items as $item) {
                    $product = Products::findOrFail($item->product_id);
                    $product->quantity = $product->quantity + $item->quantity;
                    $product->save();
                }
                DB::commit();
                return response()->json([
                    'success' => 'Venta cancelada correctamente',
                    'status' => 200
                ], 200);
            } catch (QueryException $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Error en la base de datos al cancelar la venta',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Error inesperado al cancelar la venta',
                    'error' => $e->getMessage(),
                    'status' => 500
                ], 500);
            }
        }
        return response()->json([
            'message' => 'Error al cancelar la venta, no existe',
            'status' => 401
        ],401);
    }
}