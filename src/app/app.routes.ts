import { Routes } from '@angular/router';
import { LayoutComponent } from './Layout/layout/layout.component';
import { CortesComponent } from './Pages/cortes/cortes.component';
import { LoginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { ServicioComponent } from './Pages/servicio/servicio.component';
import { RecaudacionCajaComponent } from './Pages/recaudacion-caja/recaudacion-caja.component';
import { CierreCajaComponent } from './Pages/cierre-caja/cierre-caja.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'cortes', component: CortesComponent, canActivate: [AuthGuard] },
            { path: 'servico', component: ServicioComponent, canActivate: [AuthGuard] },
            { path: 'recaudacionCaja', component: RecaudacionCajaComponent, canActivate: [AuthGuard] },
            { path: 'cierreCaja', component: CierreCajaComponent, canActivate: [AuthGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: 'login', component: LoginComponent }, // Ruta fuera del layout
];
