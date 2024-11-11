import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Models
import { RecaudacionCajaData } from '../../Models/recaudacion-caja';

// Services
import { RecaudacionCajaService } from '../../Service/recaudacion-caja.service';

// Material
import { MaterialModule } from '../../shared/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

const today = new Date();
const day = today.getUTCDate();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-recaudacion-caja',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './recaudacion-caja.component.html',
  styleUrl: './recaudacion-caja.component.css'
})
export class RecaudacionCajaComponent implements OnInit {
  isLoading: boolean = true;
  FilterValue = '';
  displayedColumns: string[] = ['Fecha', 'CodigoFormaPago', 'DescripcionFormaPago', 'Total'];
  dataSource: MatTableDataSource<RecaudacionCajaData> = new MatTableDataSource<RecaudacionCajaData>(); // Corregido: MatTableDataSource
  result: boolean = false;
  constructor(private _recaudacionCajaService: RecaudacionCajaService, private fb: FormBuilder) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  frmPeriodo!: FormGroup;

  ngOnInit(): void {
    this.frmPeriodo = this.fb.group({
      start: [new Date(year, month, day), Validators.required],
      end: [new Date(year, month, day), Validators.required],
    });

    this.getRecaudacionCaja(today, today);
  }

  getRecaudacionCaja(desde: Date, hasta: Date): void {
    this._recaudacionCajaService.getRecaudacionCaja(desde, hasta).subscribe({
      next: async (data) => {
        this.dataSource = new MatTableDataSource(data.data); // Asignamos los datos a dataSource
        this.dataSource.sort = this.sort; // Asignar el sort al dataSource
        this.dataSource.paginator = this.paginator; // Asignar el paginator al dataSource
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    if (this.frmPeriodo.valid) {
      // Procesa los datos si el formulario es válido
      const corteData = this.frmPeriodo.value;

      const desde: Date = corteData.start as Date;
      const hasta: Date = corteData.end as Date;

      // Si se está editando, realiza una actualización
      this.getRecaudacionCaja(desde, hasta);

    } else {
      // Marca los controles como tocados para que se muestren los errores
      this.frmPeriodo.markAllAsTouched();
    }
  }

  applyFilter(event?: Event) {
    const filterValue = (event?.target as HTMLInputElement)?.value ?? '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reinicia la paginación si se aplica el filtro
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
