import { Routes } from '@angular/router';
import { LayoutComponent } from './Layout/layout/layout.component';
import { CortesComponent } from './Pages/cortes/cortes.component';
import { LoginComponent } from './Pages/login/login.component'; // Importa tu componente de login

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'cortes', component: CortesComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: 'login', component: LoginComponent }, // Ruta fuera del layout
];
