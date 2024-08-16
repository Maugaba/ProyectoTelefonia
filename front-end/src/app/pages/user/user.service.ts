import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private allUrl = `${API_URL}/api/users/all`;
  private createUrl = `${API_URL}/api/users/register`;
  private changeUrl = `${API_URL}/api/users/change`;
  private updateUrl = `${API_URL}/api/users/update/`;

  constructor(private http: HttpClient) {}

  getUsers(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createUser(data: any, working_days: any): Observable<any> {
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
      .set('working_days', working_days)
      .set('id_rol', data.id_rol);

    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateUser(id: number, data: any, working_days: any): Observable<any> {
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
      .set('working_days', working_days)
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
