import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private allUrl = `${API_URL}/api/customers/all`;
  private createUrl = `${API_URL}/api/customers/register`;
  private changeUrl = `${API_URL}/api/customers/change`;
  private updateUrl = `${API_URL}/api/customers/update/`;

  constructor(private http: HttpClient) {}

  getCustomers(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createUser(data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('name', data.name)
      .set('lastname', data.lastname)
      .set('user', data.user)
      .set('password', data.password)  
      .set('working_days', data.working_days)
      .set('id_rol', data.id_rol);

    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateUser(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('name', data.name)
      .set('lastname', data.lastname)
      .set('user', data.user)
      .set('working_days', data.working_days)
      .set('id_rol', data.id_rol);
    return this.http.post<any>(`${this.updateUrl}${id}`, body.toString(), { headers });
  }

  changeState(id: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.changeUrl}/${id}`, { headers }).pipe(
    );
  }
}
