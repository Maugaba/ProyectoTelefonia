import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private allUrl = `${API_URL}/api/suppliers/all`;
  private createUrl = `${API_URL}/api/suppliers/register`;
  private changeUrl = `${API_URL}/api/suppliers/change`;
  private updateUrl = `${API_URL}/api/suppliers/update/`;

  constructor(private http: HttpClient) {}

  getSupplier(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createSupplier(data: any): Observable<any> {
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
      .set('contact_name', data.contact_name)
      .set('contact_email', data.contact_email)
      .set('contact_phone', data.contact_phone)  
      .set('address', data.address)

    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateSupplier(id: number, data: any): Observable<any> {
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
      .set('contact_name', data.contact_name)
      .set('contact_email', data.contact_email)
      .set('contact_phone', data.contact_phone)  
      .set('address', data.address)
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
