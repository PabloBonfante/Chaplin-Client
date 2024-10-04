import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { MetodoPago } from '../Models/metodo-pago';
import { Select } from '../Models/select';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllMetodosPagos(): Observable<MetodoPago[]> {
    const url = this.apiUrl + 'forma-pago';
    return this.http.get<MetodoPago[]>(url);
  }

  getAllMetodosPagosList(): Observable<Select[]> {
    const url = this.apiUrl + 'forma-pago?activo=true';

    // Realiza la solicitud HTTP y transforma la respuesta
    return this.http.get<MetodoPago[]>(url).pipe(
      // Usa map para procesar la lista de servicios obtenida
      map((servicios: MetodoPago[]) => {
        // Mapea cada servicio a un nuevo objeto con las propiedades deseadas
        const list: Select[] = servicios.map(mtp => {
          return {
            // Formatea el texto que se mostrará
            Text: `(${mtp.Codigo}) - ${mtp.Descripcion}`,
            // Almacena el ID del servicio
            Value: mtp.Id
          };
        });
        // Devuelve el nuevo array
        return list;
      })
    );
  }
}
