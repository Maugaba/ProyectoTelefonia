import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultadesService {
  private apiUrl = 'http://127.0.0.1:8000/api/facultades/todas';
  private createUrl = 'http://127.0.0.1:8000/api/facultades/crear';
  private updateUrl = 'http://127.0.0.1:8000/api/facultades/edit/';

  constructor(private http: HttpClient) {}

  getFacultades(): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get<any>(this.apiUrl, { headers });
  }

  createFacultad(data: any): Observable<any> {
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
      .set('descripcion', data.descripcion);

    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateFacultad(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('nombre', data.nombre)
      .set('descripcion', data.descripcion);

    return this.http.post<any>(`${this.updateUrl}${id}`, body.toString(), { headers });
  }
}
