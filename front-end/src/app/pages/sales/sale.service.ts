import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private allUrl = `${API_URL}/api/sales/all`;
  private createUrl = `${API_URL}/api/sales/register`;
  private cancelUrl = `${API_URL}/api/sales/cancel`;

  constructor(private http: HttpClient) {}

  getSale(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);
    
    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createSale(data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('customer_id', data.customer_id)
      .set('total_amount', data.total_amount)
      .set('sale_date', data.sale_date)
      .set('notes', data.notes)  
      .set('items', data.items)
    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  cancelSale(id: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.cancelUrl}/${id}`, { headers }).pipe(
    );
  }
}
