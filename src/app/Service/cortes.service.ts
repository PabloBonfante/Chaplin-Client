import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AddCorte, CortesAttributes, CortesResponse } from '../Models/cortes';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CortesService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllCortes(page: number, pageSize: number, desde: Date, hasta: Date): Observable<CortesResponse> {
    const url = this.apiUrl + `registro-barberia/extended?page=${page}&pageSize=${pageSize}&desde=${desde.toISOString().split('T')[0]}&hasta=${hasta.toISOString().split('T')[0]}`;
    return this.http.get<CortesResponse>(url);
  }

  addCorte(corte: AddCorte): Observable<HttpResponse<CortesAttributes>> {
    const url = `${this.apiUrl}registro-barberia`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<CortesAttributes>(url, corte, { headers, observe: 'response' });
  }

  deleteCorte(id: number): Observable<HttpResponse<void>> {
    const url = `${this.apiUrl}registro-barberia/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<void>(url, { headers, observe: 'response' });
  }

  updateCorte(Id: number, corte: AddCorte): Observable<HttpResponse<CortesAttributes>> {
    const url = `${this.apiUrl}registro-barberia/${Id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(corte);
    return this.http.put<CortesAttributes>(url, corte, { headers, observe: 'response' });
  }
}
