import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Servicio } from '../Models/servicio';
import { Select } from '../Models/select';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllServicios(): Observable<Servicio[]> {
    const url = this.apiUrl + 'servicio';
    return this.http.get<Servicio[]>(url);
  }

  getAllServiciosList(): Observable<Select[]> {
    const url = this.apiUrl + 'servicio';

    // Realiza la solicitud HTTP y transforma la respuesta
    return this.http.get<Servicio[]>(url).pipe(
      // Usa map para procesar la lista de servicios obtenida
      map((servicios: Servicio[]) => {
        // Mapea cada servicio a un nuevo objeto con las propiedades deseadas
        const list: Select[] = servicios.map(s => {
          return {
            // Formatea el texto que se mostrará
            Text: `(${s.PrecioNeto}) - ${s.DescServicio}`,
            // Almacena el ID del servicio
            Value: s.id
          };
        });

        // Agrega el elemento 'Custom' al comienzo de la lista
        list.unshift({
          Text: 'Personalizado',
          Value: -1
        });
        // Devuelve el nuevo array
        return list;
      })
    );
  }

}
