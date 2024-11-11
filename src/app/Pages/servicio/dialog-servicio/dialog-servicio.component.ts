import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Models
import { Servicio, ServicioCreationAttributes } from '@models/servicio';

// Service
import { ServicioService } from '@service/servicio.service';

// Material
import { MaterialModule } from '@shared/material/material.module';
import { ServicioComponent } from '@pages/servicio/servicio.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-servicio',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.css'
})
export class DialogServicioComponent implements OnInit {
  Title: string = 'Nuevo servicio';
  IsEdit: boolean = false;
  Form!: FormGroup;

  // Emitimos el evento cuando se crea o actualiza
  @Output() OnChange = new EventEmitter<boolean>();

  constructor(private _servicioService: ServicioService, public dialogRef: MatDialogRef<ServicioComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data?: Servicio) {
  }

  ngOnInit(): void {
    this.Form = this.fb.group({
      CodServicio: [null, Validators.required],
      DescServicio: [null, Validators.required],
      PrecioNeto: [null, Validators.required],
    });

    // Actualizar título si se está editando
    if (this.data !== undefined) {
      this.Title = 'Editar servicio';
      this.IsEdit = true;
      this.SetForm(this.data);
    }
  }

  // Método para cargar los datos del corte en el formulario
  public SetForm(servicio: Servicio): void {
    this.Form.patchValue({
      CodServicio: servicio.CodServicio,
      DescServicio: servicio.DescServicio,
      PrecioNeto: servicio.PrecioNeto,
    });
  }

  submitForm() {
    if (this.Form.valid) {
      // Procesa los datos si el formulario es válido
      const servicioData = this.Form.value;

      const newServicio: ServicioCreationAttributes = {
        CodServicio: servicioData.CodServicio,
        DescServicio: servicioData.DescServicio,
        PrecioNeto: servicioData.PrecioNeto as number,
      } as ServicioCreationAttributes;

      console.log(newServicio);
      if (this.IsEdit) {
        // Si se está editando, realiza una actualización
        this._servicioService.updateServicio(this.data?.id!, newServicio).subscribe({
          next: (response) => {
            if (response.status === 200) {
              console.log('Corte actualizado exitosamente', response.body);
              this.OnChange.emit(this.IsEdit);
            } else {
              console.log('Error: Respuesta con código de estado inesperado', response.status);
            }
          },
          error: (error) => {
            console.error('Error al actualizar el corte', error);
          }
        });
      } else {
        // Si se está creando, llama al servicio para agregar el corte
        this._servicioService.addServicio(newServicio).subscribe({
          next: (response) => {
            if (response.status === 201) {
              console.log('Corte agregado exitosamente', response.body);
              this.OnChange.emit(this.IsEdit);
            } else {
              console.log('Error: Respuesta con código de estado inesperado', response.status);
            }
          },
          error: (error) => {
            console.error('Error al agregar el corte', error);
          }
        });
      }

      this.onClose();
    } else {
      // Marca los controles como tocados para que se muestren los errores
      this.Form.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  GetAutoCompleteByName(name: string): FormControl {
    return this.Form.get(name) as FormControl;
  }

  isValid(controlName: string) {
    const control = this.GetAutoCompleteByName(controlName);
    return control.valid || !control.touched;
  }
}
