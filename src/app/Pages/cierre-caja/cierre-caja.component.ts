import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MaterialModule } from '../../shared/material/material.module';
import { provideNativeDateAdapter } from '@angular/material/core';

// Servicios
import { CierreCajaService } from '@service/cierre-caja.service';

// Models
import { cierreCaja } from '@models/cierre-caja';

const today = new Date();
const day = today.getUTCDate();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-cierre-caja',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cierre-caja.component.html',
  styleUrl: './cierre-caja.component.css'
})
export class CierreCajaComponent implements OnInit {
  isLoading: boolean = true;
  data!: cierreCaja;
  displayedColumns: string[] = ['nroCorte', 'descServicio', 'precioNeto', 'descFormaPago', 'montoACobrar', 'fecha', 'comentario'];
  frmPeriodo!: FormGroup;

  constructor(private _cierreCajaService: CierreCajaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.frmPeriodo = this.fb.group({
      start: [new Date(year, month, day), Validators.required],
      end: [new Date(year, month, day), Validators.required],
    });

    this.getCierreCaja(new Date(), new Date());
  }

  getCierreCaja(desde: Date, hasta: Date): void {
    this._cierreCajaService.getCierreCaja(desde, hasta).subscribe({
      next: async (data) => {
        this.isLoading = false;
        this.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  // Función para combinar los objetos en un array y agregar un nuevo campo
  combinarTotales(obj1: any, Tipo1: string, obj2: any, Tipo2: string): any[] {
    return [
      { ...obj1, Tipo: Tipo1 },
      { ...obj2, Tipo: Tipo2 }
    ];
  }

  submitForm() {
    if (this.frmPeriodo.valid) {
      // Procesa los datos si el formulario es válido
      const corteData = this.frmPeriodo.value;

      const desde: Date = corteData.start as Date;
      const hasta: Date = corteData.end as Date;

      // Si se está editando, realiza una actualización
      this.getCierreCaja(desde, hasta);

    } else {
      // Marca los controles como tocados para que se muestren los errores
      this.frmPeriodo.markAllAsTouched();
    }
  }

  GetAutoCompleteByName(name: string): FormControl {
    return this.frmPeriodo.get(name) as FormControl;
  }

  isValid(controlName: string) {
    const control = this.GetAutoCompleteByName(controlName);
    return control.valid || !control.touched;
  }
}
