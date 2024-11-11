import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { DateTimeToString } from '../Utils/util';
import { cierreCaja } from '@models/cierre-caja';

@Injectable({
  providedIn: 'root'
})
export class CierreCajaService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getCierreCaja(desde: Date, hasta: Date): Observable<cierreCaja> {
    const url = this.apiUrl + `cierre-caja?desde=${DateTimeToString(desde)}&hasta=${DateTimeToString(hasta)}`;
    console.log(url);
    return this.http.get<cierreCaja>(url);
  }
}
