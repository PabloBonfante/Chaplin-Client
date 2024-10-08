import { Routes } from '@angular/router';
import { LayoutComponent } from './Layout/layout/layout.component';
import { CortesComponent } from './Pages/cortes/cortes.component';
import { LoginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'cortes', component: CortesComponent, canActivate: [AuthGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: 'login', component: LoginComponent }, // Ruta fuera del layout
];
