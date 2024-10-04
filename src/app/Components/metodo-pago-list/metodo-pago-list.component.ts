import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Models
import { Select } from '../../Models/select';

// Services
import { MetodoPagoService } from '../../Service/metodo-pago.service';

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
  selector: 'app-metodo-pago-list',
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
  templateUrl: './metodo-pago-list.component.html',
  styleUrl: './metodo-pago-list.component.css'
})
export class MetodoPagoListComponent implements OnInit {
  listMetodosPagos: Select[] = [];
  filteredOptions: Select[] = [];
  isLoading: boolean = true;
  selectedMetodoPago?: Select;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  // Emitimos el evento cuando un servicio es seleccionado
  @Output() OnChangeSelect = new EventEmitter<Select>();
  @Output() OnMetodoPagoLoad = new EventEmitter<void>(); // Evento que te dice que se terminaron de cargar
  @Input() control: FormControl = new FormControl();

  constructor(private metodoPagoService: MetodoPagoService) { }

  ngOnInit(): void {
    this.metodoPagoService.getAllMetodosPagosList().subscribe({
      next: async (data) => {
        // await new Promise(f => setTimeout(f, 5000));
        this.listMetodosPagos = data;
        this.filteredOptions = data;
        this.isLoading = false;
        this.OnMetodoPagoLoad.emit();
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
      this.filteredOptions = this.listMetodosPagos.filter(o => o.Text.toLowerCase().includes(filterValue));
    } else {
      this.filteredOptions = this.listMetodosPagos;
    }
  }

  ClearFilter(): void {
    this.selectedMetodoPago = undefined;
    this.input.nativeElement.value = '';

    // Ejecutar el evento input manualmente, es necesario para que se quite el check de las opciones
    const event = new Event('input', { bubbles: true });
    this.input.nativeElement.dispatchEvent(event);

    // Emitimos el servicio seleccionado al componente padre
    this.OnChangeSelect.emit(undefined);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedId = event.option.value; // ID del servicio seleccionado
    const selectedServicio = this.listMetodosPagos.find(
      (servicio) => servicio.Value === selectedId
    );

    if (selectedServicio) {
      this.input.nativeElement.value = selectedServicio.Text; // Muestra la descripción en el input
      this.selectedMetodoPago = selectedServicio;

      // Emitimos el servicio seleccionado al componente padre
      this.OnChangeSelect.emit(selectedServicio);
    }
  }

  get isValid() {
    return this.control.valid || !this.control.touched;
  }

  // Método para que el componente padre pueda seleccionar un empleado
  selectMetodoPago(Id: number): void {
    const metodoPago = this.listMetodosPagos.find(e => e.Value === Id);
    if (metodoPago) {
      this.selectedMetodoPago = metodoPago;
      this.input.nativeElement.value = metodoPago.Text;
      this.OnChangeSelect.emit(metodoPago);
    }
  }
}
