import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Empleado } from '../Models/empleado';
import { Select } from '../Models/select';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllEmpleados(): Observable<Empleado[]> {
    const url = this.apiUrl + 'empleado';
    return this.http.get<Empleado[]>(url);
  }

  getAllEmpleadosList(): Observable<Select[]> {
    const url = this.apiUrl + 'empleado';

    // Realiza la solicitud HTTP y transforma la respuesta
    return this.http.get<Empleado[]>(url).pipe(
      // Usa map para procesar la lista de servicios obtenida
      map((servicios: Empleado[]) => {
        // Mapea cada servicio a un nuevo objeto con las propiedades deseadas
        const list: Select[] = servicios.map(mtp => {
          return {
            // Formatea el texto que se mostrará
            Text: `${mtp.Nombre} - ${mtp.Apellido}`,
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
