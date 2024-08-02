import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios/todos';
  private createUrl = 'http://127.0.0.1:8000/api/usuarios/registrar';
  private updateUrl = 'http://127.0.0.1:8000/api/usuarios/actualizar';
  private changeUrl = 'http://127.0.0.1:8000/api/usuarios/cambiar'; 

  constructor(private http: HttpClient) {}

  getUsuarios(estado: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('estado', estado);

    return this.http.post<any>(this.apiUrl, body.toString(), { headers }).pipe(

    );
  }

  createUsuario(data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('nombre', data.name)
      .set('apellido', data.lastname)
      .set('usuario', data.user)
      .set('correo_electronico', data.email)
      .set('contraseña', data.password)  
      .set('id_rol', data.rol);

    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateUsuario(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('nombre', data.nombre)
      .set('apellido', data.apellido)
      .set('usuario', data.usuario)
      .set('correo_electronico', data.correo_electronico)
      .set('id_rol', data.id_rol);

    return this.http.post<any>(`${this.updateUrl}${id}`, body.toString(), { headers });
  }

  changeEstado(id: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.changeUrl}/${id}`, { headers }).pipe(
    );
  }
}
