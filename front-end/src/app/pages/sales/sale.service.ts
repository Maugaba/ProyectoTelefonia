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
  private productUrl = `${API_URL}/api/products/all`;
  private customerUrl = `${API_URL}/api/customers/all`;

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
      .set('Content-Type', 'application/json'); // Cambia a application/json

    return this.http.post<any>(this.createUrl, data, { headers });
  }

  cancelSale(id: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.cancelUrl}/${id}`, { headers }).pipe(
    );
  }

  getProduct(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.productUrl, body.toString(), { headers }).pipe(

    );
  }

  getCustomer(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.customerUrl, body.toString(), { headers }).pipe(

    );
  }
  getSaleById(saleId: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    const url = `${API_URL}/api/sales/${saleId}`;
    console.log('API URL:', url);
    return this.http.get<any>(url, { headers });
}
}
