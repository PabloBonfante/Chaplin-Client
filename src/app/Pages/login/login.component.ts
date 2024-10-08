import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Models/usuario';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatCardModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);
  LogoSrc = environment.production ? '/node/logo4.jpg' : '/Logo4.jpg';
  constructor(private router: Router, private loginService: AuthService) { }

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);

      const data = this.form.value;

      // Si se está editando, realiza una actualización
      this.loginService.login(data.username, data.password).subscribe({
        next: async (data) => {
          if (this.isUsuario(data)) {  // Usamos una función de tipo guard
            // redirigir a otra página
            this.router.navigate(['/']); // Ejemplo de redirección
          } else {
            this.openSnackBar('Usuario o contraseña incorrecto');
            console.log(data);
          }
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar('Usuario o contraseña incorrecto');
        }
      });
    }
  }

  // Función tipo guard para validar si data es de tipo Usuario
  isUsuario(data: any): data is Usuario {
    return data;
  }

  isValid(controlName: string) {
    const control = this.GetAutoCompleteByName(controlName);
    return control.valid || !control.touched;
  }

  GetAutoCompleteByName(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }
}
