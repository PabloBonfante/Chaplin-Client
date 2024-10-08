import { Component, ChangeDetectionStrategy, signal, OnInit, EventEmitter, Output, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Componentes
import { EmpleadosListComponent } from "../../../Components/empleados-list/empleados-list.component";
import { ServiciosListComponent } from "../../../Components/servicios-list/servicios-list.component";
import { MetodoPagoListComponent } from "../../../Components/metodo-pago-list/metodo-pago-list.component";
import { CortesComponent } from '../cortes.component';

// Models
import { Select } from '../../../Models/select';
import { CortesService } from '../../../Service/cortes.service';
import { AddCorte, CortesAttributes } from '../../../Models/cortes';
import { DatePipe } from '@angular/common';
import formatTime from '../../../Utils/util';


@Component({
  selector: 'app-dialog-cortes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    MatIconModule,
    EmpleadosListComponent,
    ServiciosListComponent,
    MetodoPagoListComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dialog-cortes.component.html',
  styleUrl: './dialog-cortes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogCortesComponent implements OnInit, AfterViewInit {
  Title: string = 'Nuevo corte';
  SelectedEmpleado?: Select;
  SelectedMetodoPago?: Select;
  SelectedServicio?: Select;
  IsCustom: boolean = false;
  IsEdit: boolean = false;
  inputType: string = 'time';

  // Emitimos el evento cuando se crea o actualiza
  @Output() OnChange = new EventEmitter();

  @ViewChild(EmpleadosListComponent) empleadosListComponent!: EmpleadosListComponent;
  @ViewChild(ServiciosListComponent) serviciosListComponent!: ServiciosListComponent;
  @ViewChild(MetodoPagoListComponent) metodoPagoListComponent!: MetodoPagoListComponent;
  parentForm!: FormGroup;
  sPrecio = signal('');

  constructor(public dialogRef: MatDialogRef<CortesComponent>, private fb: FormBuilder, private cortesService: CortesService, @Inject(MAT_DIALOG_DATA) public data?: CortesAttributes) { }

  ngOnInit(): void {
    this.parentForm = this.fb.group({
      empleado: [null, Validators.required],
      metodoPago: [null, Validators.required],
      servicio: [null, Validators.required],
      precio: ['', this.IsCustom ? [Validators.required, Validators.min(1)] : []], // Validación condicional
      duracion: [''],
      comentario: [''],
      fecha: ['', this.IsEdit ? [Validators.required] : []]
    });

    // Actualizar título si se está editando
    if (this.data !== undefined) {
      this.Title = 'Editar corte';
      this.inputType = 'datetime-local';
      this.IsEdit = true;
    }

    // Escucha cambios en IsCustom para activar/desactivar la validación del precio
    this.togglePrecioValidation();
  }

  ngAfterViewInit() {
    if (this.data !== undefined) {

      // Escuchar cuando los empleados han sido cargados antes de seleccionar el empleado
      this.empleadosListComponent.OnEmpleadosLoad.subscribe(() => {
        if (this.data !== undefined) {
          this.empleadosListComponent.selectEmpleado(this.data.IdEmpleado);
          this.parentForm.patchValue({
            empleado: this.SelectedEmpleado?.Text,
          });
        }
      });

      // Escuchar cuando los empleados han sido cargados antes de seleccionar el Servicios
      this.serviciosListComponent.OnServicioLoad.subscribe(() => {
        if (this.data !== undefined) {
          this.serviciosListComponent.selectServicio(this.data.IdServicio);
          this.parentForm.patchValue({
            servicio: this.SelectedServicio?.Text,
          });
        }
      });

      // Escuchar cuando los empleados han sido cargados antes de seleccionar el metodo de pago
      this.metodoPagoListComponent.OnMetodoPagoLoad.subscribe(() => {
        if (this.data !== undefined) {
          this.metodoPagoListComponent.selectMetodoPago(this.data.IdFormaPago);
          this.parentForm.patchValue({
            metodoPago: this.SelectedMetodoPago?.Text,
          });
        }
      });

      // Cargo el Form
      this.populateForm(this.data);
    }
  }

  // Método para cargar los datos del corte en el formulario
  private populateForm(corte: CortesAttributes): void {

    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedDate = datepipe.transform(corte.Fecha, 'yyyy-MM-ddTHH:mm');

    this.parentForm.patchValue({
      precio: corte.PrecioNeto,
      duracion: corte.Duracion,
      comentario: corte.Comentario,
      fecha: formattedDate
    });

    console.log(formattedDate);
    // Verificar si es custom
    this.IsCustom = corte.IdServicio === -1; // Ajustar según tu lógica para "custom"
    this.togglePrecioValidation(); // Actualiza la validación del precio
  }

  submitForm() {
    if (this.parentForm.valid) {
      // Procesa los datos si el formulario es válido
      const corteData = this.parentForm.value;

      const newCorte: AddCorte = {
        IdEmpleado: this.SelectedEmpleado?.Value,
        IdServicio: this.SelectedServicio?.Value,
        IdFormaPago: this.SelectedMetodoPago?.Value,
        PrecioNeto: parseFloat(corteData.precio) || 0, // Se deja en cero porque la api le pone el precio cuando NO ES personalizado
        Fecha: corteData.fecha || new Date(), // Usando la fecha actual, o puedes utilizar this.data.corte.Fecha si lo deseas
        Duracion: formatTime(corteData.duracion),
        Comentario: corteData.comentario || '',
        CreateAt: this.data ? this.data.CreateAt : new Date(), // Usar la fecha de creación si se está editando
        CreateBy: this.data ? this.data.CreateBy : 'Angular', // Valor predeterminado para el creador
        UpdateBy: this.data ? this.data.UpdateBy : 'Angular', // Valor predeterminado para el creador
      } as AddCorte;

      if (this.IsEdit) {
        // Si se está editando, realiza una actualización
        this.cortesService.updateCorte(this.data?.Id!, newCorte).subscribe({
          next: (response) => {
            if (response.status === 200) {
              console.log('Corte actualizado exitosamente', response.body);
              this.OnChange.emit();
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
        this.cortesService.addCorte(newCorte).subscribe({
          next: (response) => {
            if (response.status === 201) {
              console.log('Corte agregado exitosamente', response.body);
              this.OnChange.emit();
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
      this.parentForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  OnChangeSelectServicio(servicio?: Select): void {
    this.SelectedServicio = servicio;
    this.IsCustom = servicio?.Value === -1; // Si selecciono custom

    // activar/desactivar la validación del precio
    this.togglePrecioValidation();
  }

  OnChangeSelectMetodoPago(metodoPago?: Select): void {
    this.SelectedMetodoPago = metodoPago;
  }

  OnChangeSelectEmpleado(empleado?: Select): void {
    this.SelectedEmpleado = empleado;
  }

  GetAutoCompleteByName(name: string): FormControl {
    return this.parentForm.get(name) as FormControl;
  }

  togglePrecioValidation(): void {
    const precio = this.GetAutoCompleteByName('precio');
    if (this.IsCustom) {
      // Activa la validación de precio
      precio.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // Desactiva la validación de precio
      precio.clearValidators();
    }

    // Actualiza el estado del control para reflejar los cambios
    precio.updateValueAndValidity();
  }

  isValid(controlName: string) {
    const control = this.GetAutoCompleteByName(controlName);
    return control.valid || !control.touched;
  }
}
