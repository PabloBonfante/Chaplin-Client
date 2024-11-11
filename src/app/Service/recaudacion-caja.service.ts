import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { RecaudacionCaja } from '../Models/recaudacion-caja';
import { DateTimeToString } from '../Utils/util';

@Injectable({
  providedIn: 'root'
})
export class RecaudacionCajaService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getRecaudacionCaja(desde: Date, hasta: Date): Observable<RecaudacionCaja> {
    const url = this.apiUrl + `recaudacion-caja?desde=${DateTimeToString(desde)}&hasta=${DateTimeToString(hasta)}`;
    return this.http.get<RecaudacionCaja>(url);
  }
}
