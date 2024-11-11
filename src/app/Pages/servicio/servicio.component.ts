import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Models
import { Servicio } from '../../Models/servicio';

// Services
import { ServicioService } from '../../Service/servicio.service';

// Material
import { MaterialModule } from '../../shared/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DialogServicioComponent } from './dialog-servicio/dialog-servicio.component';
import { ConfirmDialog } from '@models/confirm-dialog';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent implements OnInit {
  isLoading: boolean = true;
  FilterValue = '';
  displayedColumns: string[] = ['CodServicio', 'DescServicio', 'PrecioNeto', 'Acciones'];
  dataSource: MatTableDataSource<Servicio> = new MatTableDataSource<Servicio>(); // Corregido: MatTableDataSource
  result: boolean = false;
  constructor(private _servicioService: ServicioService, private dialog: MatDialog) { }
  private _snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getAllServicios();
  }

  getAllServicios(): void {
    this._servicioService.getAllServicios().subscribe({
      next: async (data) => {
        this.dataSource = new MatTableDataSource(data); // Asignamos los datos a dataSource
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

  openDialog(servicio?: Servicio): void {
    const dialogRef = this.dialog.open(DialogServicioComponent, {
      width: '900px',
      maxWidth: '900px',
      disableClose: true,
      autoFocus: false
    },);

    const instance = dialogRef.componentInstance;
    instance.data = servicio;
    console.log(servicio);

    // Escuchar eventos emitidos desde el modal
    instance.OnChange.subscribe((IsEdit) => {
      this.getAllServicios();
      if (IsEdit) {
        this.openSnackBar('Servicio editado con éxito');
      } else {
        this.openSnackBar('Servicio agregado con éxito');
      }
    });
  }

  edit(servicio: Servicio): void {
    this.openDialog(servicio);
  }

  delete(id: number): void {
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
    this._servicioService.deleteServicio(id).subscribe({
      next: (response) => {
        // Verificar el código de estado
        if (response.status === 204) {
          this.getAllServicios(); // Recargar la lista de cortes
          this.openSnackBar('Servicio eliminado con éxito');
        } else {
          this.openSnackBar(`No se pudo eliminar el Servicio, código de estado: ${response.status}`);
        }
      },
      error: (err) => {
        console.error('Error al eliminar el Servicio', err);
        this.openSnackBar('Hubo un error al intentar eliminar el Servicio.');
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
