import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants/api_url';

@Injectable({
  providedIn: 'root'
})
export class ProductBatchesService {
  private allUrl = `${API_URL}/api/product_batches/all`;
  private createUrl = `${API_URL}/api/product_batches/register`;
  private cancelUrl = `${API_URL}/api/product_batches/cancel`;
  private productUrl = `${API_URL}/api/products/all`;
  private supplierUrl = `${API_URL}/api/suppliers/all`;

  constructor(private http: HttpClient) {}

  getProductBatches(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);
    
    return this.http.post<any>(this.allUrl, body.toString(), { headers });
  }

  createProductBatch(data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    return this.http.post<any>(this.createUrl, data, { headers });
  }

  cancelBatch(id: number): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.cancelUrl}/${id}`, { headers });
  }

  getProduct(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.productUrl, body.toString(), { headers });
  }

  getSupplier(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.supplierUrl, body.toString(), { headers });
  }
}
