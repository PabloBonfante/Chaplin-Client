import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';

// Models
import { Servicio, ServicioCreationAttributes } from '@models/servicio';
import { Select } from '@models/select';


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

  addServicio(servicio: ServicioCreationAttributes): Observable<HttpResponse<ServicioCreationAttributes>> {
    const url = `${this.apiUrl}servicio`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ServicioCreationAttributes>(url, servicio, { headers, observe: 'response' });
  }

  deleteServicio(id: number): Observable<HttpResponse<void>> {
    const url = `${this.apiUrl}servicio/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<void>(url, { headers, observe: 'response' });
  }

  updateServicio(Id: number, servicio: ServicioCreationAttributes): Observable<HttpResponse<Servicio>> {
    const url = `${this.apiUrl}servicio/${Id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(servicio);
    return this.http.put<Servicio>(url, servicio, { headers, observe: 'response' });
  }
}
