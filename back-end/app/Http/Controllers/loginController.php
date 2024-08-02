<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Users;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('user', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::Users(); // Obtener el usuario autenticado
            $token = $user->createToken('token-name')->plainTextToken;
            return response()->json(['user_id' => $user->id, 'user_name' => $user->nombre, 'rol' => $user->id_rol, 'token' => $token], 200);
        }

        return response()->json(['error' => 'Usuario o contraseña incorrectos'], 401);
    }

    public function logout(Request $request)
    {
        try {
            // Verificar si el usuario está autenticado
            $user = $request->user();
            if ($user) {
                // Revocar todos los tokens del usuario
                $user->tokens()->delete();
                // No necesitas llamar a Auth::logout() ya que estás trabajando con tokens
                return response()->json([
                    'message' => 'Sesión cerrada correctamente'
                ], 200);
            } else {
                return response()->json([
                    'error' => 'No hay usuario autenticado'
                ], 401);
            }
        } catch (\Throwable $e) {
            // Captura cualquier excepción que ocurra durante el proceso de logout
            return response()->json(['error' => 'Error al cerrar sesión: ' . $e->getMessage()], 500);
        }
    }
}