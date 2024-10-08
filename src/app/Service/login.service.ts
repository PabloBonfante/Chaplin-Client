import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Usuario } from '../Models/usuario';
import { Error } from '../Models/error';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  login(user: string, password: string): Observable<Usuario | Error> {
    const url = this.apiUrl + 'usuario/login';
    return this.http.get<Usuario | Error>(`${url}?alias=${user}&password=${password}`);
  }
}
