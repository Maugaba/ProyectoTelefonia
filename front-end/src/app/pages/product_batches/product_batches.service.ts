import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/api_url';
@Injectable({
  providedIn: 'root'
})
export class ProductbacheService {
  private allUrl = `${API_URL}/api/productbatches/all`;
  private createUrl = `${API_URL}/api/productbatches/register`;
  private changeUrl = `${API_URL}/api/productbatches/change`;
  private updateUrl = `${API_URL}/api/productbatches/update/`;

  constructor(private http: HttpClient) {}

  getProductbatch(state: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams().set('state', state);

    return this.http.post<any>(this.allUrl, body.toString(), { headers }).pipe(

    );
  }

  createProductbatch(data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('product_id', data.product_id)
      .set('batch_number', data.batch_number)
      .set('expiration_date', data.expiration_date)
      .set('quantity', data.quantity)


    return this.http.post<any>(this.createUrl, body.toString(), { headers });
  }

  updateProductbatch(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      throw new Error('Token not found');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
      .set('product_id', data.product_id)
      .set('batch_number', data.batch_number)
      .set('expiration_date', data.expiration_date)
      .set('quantity', data.quantity)
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