import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Models
import { Select } from '../../Models/select';

// Services
import { EmpleadosService } from '../../Service/empleados.service';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css'
})
export class EmpleadosListComponent implements OnInit {
  listEmpleados: Select[] = [];
  filteredOptions: Select[] = [];
  isLoading: boolean = true;
  selectedEmpleado?: Select;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  // Emitimos el evento cuando un servicio es seleccionado
  @Output() OnChangeSelect = new EventEmitter<Select>();
  @Output() OnEmpleadosLoad = new EventEmitter<void>(); // Evento que te dice que se terminaron de cargar
  @ViewChild(MatAutocomplete) matAutocomplete!: MatAutocomplete;
  @Input() control: FormControl = new FormControl();

  constructor(private empleadoService: EmpleadosService) { }

  ngOnInit(): void {
    this.empleadoService.getAllEmpleadosList().subscribe({
      next: async (data) => {
        // await new Promise(f => setTimeout(f, 5000));
        this.listEmpleados = data;
        this.filteredOptions = data;
        this.isLoading = false;
        this.OnEmpleadosLoad.emit();
        console.log('empelados cargados');
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();

    if (filterValue !== '') {
      this.filteredOptions = this.listEmpleados.filter(o => o.Text.toLowerCase().includes(filterValue));
    } else {
      this.filteredOptions = this.listEmpleados;
    }
  }

  ClearFilter(): void {
    this.selectedEmpleado = undefined;
    this.input.nativeElement.value = '';

    // Ejecutar el evento input manualmente, es necesario para que se quite el check de las opciones
    const event = new Event('input', { bubbles: true });
    this.input.nativeElement.dispatchEvent(event);

    // Emitimos el servicio seleccionado al componente padre
    this.OnChangeSelect.emit(undefined);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedId = event.option.value; // ID del servicio seleccionado
    const selectedServicio = this.listEmpleados.find(
      (servicio) => servicio.Value === selectedId
    );

    if (selectedServicio) {
      this.input.nativeElement.value = selectedServicio.Text; // Muestra la descripción en el input
      this.selectedEmpleado = selectedServicio;

      // Emitimos el servicio seleccionado al componente padre
      this.OnChangeSelect.emit(selectedServicio);
    }
  }

  // Puedes personalizar este método para mostrar mensajes de error
  get isValid() {
    return this.control.valid || !this.control.touched;
  }

  // Método para que el componente padre pueda seleccionar un empleado
  selectEmpleado(empleadoId: number): void {
    const empleado = this.listEmpleados.find(e => e.Value === empleadoId);
    if (empleado) {
      this.selectedEmpleado = empleado;
      this.input.nativeElement.value = empleado.Text;
      this.OnChangeSelect.emit(empleado);
    }
  }
}
