import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private allUrl = `${API_URL}/api/products/all`;
  private createUrl = `${API_URL}/api/products/register`;
  private changeUrl = `${API_URL}/api/products/change`;
  private updateUrl = `${API_URL}/api/products/update/`;

  private apiUrl = `${API_URL}/api/suppliers/all`;

  constructor(private http: HttpClient) {}

  getSupplier(state: string): Observable<any> {
    return this.http.post(this.apiUrl, { state });
  }
  
  getProduct(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createProduct(data: any): Observable<any> {
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
      .set('description', data.description)
      .set('price', data.price)
      .set('quantity', data.quantity)  
      .set('sku', data.sku)
      .set('type', data.type)
      .set('supplier_id', data.supplier_id)


    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateProduct(id: number, data: any): Observable<any> {
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
      .set('description', data.description)
      .set('price', data.price)
      .set('quantity', data.quantity)  
      .set('sku', data.sku)
      .set('type', data.type)
      .set('supplier_id', data.supplier_id)
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
