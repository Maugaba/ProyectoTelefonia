import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants/api_url';

@Injectable({
  providedIn: 'root'
})
export class ProductBatchesService {
  private allUrl = `${API_URL}/api/productbatches/all`; // Actualizado
  private createUrl = `${API_URL}/api/productbatches/register`; // Actualizado
  private toggleStateUrl = `${API_URL}/api/productbatches/change`; // Actualizado
  private filterUrl = `${API_URL}/api/productbatches/filter`;

  private apiUrl = `${API_URL}/api/products/all`;

  constructor(private http: HttpClient) {}

  getProducts(state: string): Observable<any> {
    return this.http.post(this.apiUrl, { state });
  }

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

  toggleBatchState(id: number): Observable<any> { // Actualizado
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<any>(`${this.toggleStateUrl}/${id}`, { headers });
  }

  filterProductBatchesByDate(startDate: string, endDate: string): Observable<any> {
    const token = localStorage.getItem('angular17token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
  
    const body = { start_date: startDate, end_date: endDate };
  
    return this.http.post<any>(this.filterUrl, body.toString(), { headers });
    
  }  
}
