import { Component, OnInit, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Models
import { Cortes, CortesAttributes } from '../../Models/cortes';

//Services
import { CortesService } from '../../Service/cortes.service';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogCortesComponent } from './dialog-cortes/dialog-cortes.component';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from '../../Models/confirm-dialog';
import { EmpleadosListComponent } from '../../Components/empleados-list/empleados-list.component';


@Component({
  selector: 'app-cortes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatSort, MatPaginator, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './cortes.component.html',
  styleUrls: ['./cortes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CortesComponent implements OnInit {
  isLoading: boolean = true;
  FilterValue = '';
  displayedColumns: string[] = ['NombreApellidoEmpleado', 'DescServicio', 'DescripcionFormaPago', 'Fecha', 'Duracion', 'PrecioNeto', 'Comentario', 'Acciones'];
  dataSource: MatTableDataSource<Cortes> = new MatTableDataSource<Cortes>(); // Corregido: MatTableDataSource
  result: boolean = false;
  constructor(private cortesService: CortesService, private dialog: MatDialog) { }
  private _snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getAllCortes();
  }

  getAllCortes(): void {
    this.cortesService.getAllCortes(0, 1000, new Date(), new Date()).subscribe({
      next: async (data) => {
        // await new Promise(f => setTimeout(f, 5000));
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

  applyFilter(event?: Event) {
    const filterValue = (event?.target as HTMLInputElement)?.value ?? '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reinicia la paginación si se aplica el filtro
    }
  }

  openDialog(corte?: CortesAttributes): void {
    const dialogRef = this.dialog.open(DialogCortesComponent, {
      width: '900px',
      maxWidth: '900px',
      disableClose: true,
      autoFocus: false
    },);

    const instance = dialogRef.componentInstance;
    instance.data = corte;
    console.log(corte);

    // Escuchar eventos emitidos desde el modal
    instance.OnChange.subscribe((IsEdit) => {
      this.getAllCortes();
      if (IsEdit) {
        this.openSnackBar('Corte editado con éxito');
      } else {
        this.openSnackBar('Corte agregado con éxito');
      }
    });
  }

  editCorte(corte: CortesAttributes): void {
    this.openDialog(corte);
  }

  deleteCorte(id: number): void {
    const message = `¿Estás seguro de que quieres eliminar?`;
    const dialogData = new ConfirmDialog("Atencion", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.handleDelete(id); // Llama a la función para manejar la eliminación
      }
    });
  }

  private handleDelete(id: number): void {
    this.cortesService.deleteCorte(id).subscribe({
      next: (response) => {
        // Verificar el código de estado
        if (response.status === 204) {
          this.getAllCortes(); // Recargar la lista de cortes
          this.openSnackBar('Corte eliminado con éxito');
        } else {
          this.openSnackBar(`No se pudo eliminar el corte, código de estado: ${response.status}`);
        }
      },
      error: (err) => {
        console.error('Error al eliminar el corte', err);
        this.openSnackBar('Hubo un error al intentar eliminar el registro.');
      }
    });
  }


  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }
}

