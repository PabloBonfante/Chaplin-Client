import { Injectable } from '@angular/core';
import { Usuario } from '../Models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environment/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private key: string = 'user';

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  public getUserFromLocalStorage(): Usuario | null {
    const encryptedData = localStorage.getItem(this.key);
    if (encryptedData) {
      const decryptedData = this.cryptoService.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    }
    return null;
  }

  private setUserToLocalStorage(user: Usuario): void {
    const encryptedData = this.cryptoService.encrypt(JSON.stringify(user));
    localStorage.setItem(this.key, encryptedData);
  }

  private clearUserFromLocalStorage(): void {
    localStorage.removeItem(this.key);
  }

  login(user: string, password: string): Observable<Usuario | Error> {
    const url = this.apiUrl + 'usuario/login';
    return this.http.get<Usuario | Error>(`${url}?alias=${user}&password=${password}`, { observe: 'response' }).pipe(
      tap(response => {
        // Verifica el status code
        if (response.status === 200) {
          // Si es exitoso, puedes guardar los datos
          const usuario = response.body as Usuario;

          // Guarda los datos aquí (ejemplo con localStorage o servicio de estado global)
          this.setUserToLocalStorage(usuario);
          console.log('Datos del usuario guardados:', usuario);
        } else {
          console.error('Error en la petición, código de estado:', response.status);
        }
      }),

      // Transforma la respuesta para retornar solo el cuerpo (los datos del usuario o error)
      map(response => response.body as Usuario | Error)
    );
  }


  logout(): void {
    this.clearUserFromLocalStorage();
    // this.userSubject.next(null);
    // this.menuItemService.clearMenu();
  }

  isLoggedIn(): boolean {
    const userJson = localStorage.getItem(this.key);
    return userJson !== null;
    //return this.userSubject.value !== null;
  }
}
