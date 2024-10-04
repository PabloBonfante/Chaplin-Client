import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Models
import { Select } from '../../Models/select';

// Services
import { ServicioService } from '../../Service/servicio.service';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-servicios-list',
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
  templateUrl: './servicios-list.component.html',
  styleUrl: './servicios-list.component.css'
})
export class ServiciosListComponent implements OnInit {
  listServicios: Select[] = [];
  filteredOptions: Select[] = [];
  isLoading: boolean = true;
  selectedServicio?: Select;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  // Emitimos el evento cuando un servicio es seleccionado
  @Output() OnChangeSelect = new EventEmitter<Select>();
  @Output() OnServicioLoad = new EventEmitter<void>(); // Evento que te dice que se terminaron de cargar
  @Input() control: FormControl = new FormControl();

  constructor(private servicioService: ServicioService) { }

  ngOnInit(): void {
    this.servicioService.getAllServiciosList().subscribe({
      next: async (data) => {
        // await new Promise(f => setTimeout(f, 5000));
        this.listServicios = data;
        this.filteredOptions = data;
        this.isLoading = false;
        this.OnServicioLoad.emit();
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
      this.filteredOptions = this.listServicios.filter(o => o.Text.toLowerCase().includes(filterValue));
    } else {
      this.filteredOptions = this.listServicios;
    }
  }

  ClearFilter(): void {
    this.selectedServicio = undefined;
    this.input.nativeElement.value = '';

    // Ejecutar el evento input manualmente, es necesario para que se quite el check de las opciones
    const event = new Event('input', { bubbles: true });
    this.input.nativeElement.dispatchEvent(event);

    // Emitimos el servicio seleccionado al componente padre
    this.OnChangeSelect.emit(undefined);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedId = event.option.value;
    const selectedServicio = this.listServicios.find(
      (servicio) => servicio.Value === selectedId
    );

    if (selectedServicio) {
      this.input.nativeElement.value = selectedServicio.Text;
      this.selectedServicio = selectedServicio;

      // Emitimos el servicio seleccionado al componente padre
      this.OnChangeSelect.emit(selectedServicio);
    }
  }

  get isValid() {
    return this.control.valid || !this.control.touched;
  }

  // Método para que el componente padre pueda seleccionar un empleado
  selectServicio(ServicioId: number): void {
    const servicio = this.listServicios.find(e => e.Value === ServicioId);
    if (servicio) {
      this.selectedServicio = servicio;
      this.input.nativeElement.value = servicio.Text;
      this.OnChangeSelect.emit(servicio);
    }
  }

  // Para mostrar el nombre en el input en lugar del objeto
  displayFn(option: any): string {
    return option ? option.name : '';
  }

  // Método para comparar objetos
  compareObjects(option1: any, option2: any): boolean {
    return option1 && option2 ? option1.id === option2.id : option1 === option2;
  }
}
