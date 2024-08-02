import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './service/auth.guard';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { CreateUsuarioComponent } from './pages/usuario/create-usuario/create-usuario.component';
import { EditarUsuarioComponent } from './pages/usuario/editar-usuario/editar-usuario.component';
import {FacultadesComponent} from  './pages/facultades/facultades.component';
import {CrearFacultadComponent} from  './pages/facultades/crear-facultad/crear-facultad.component';
import {EditarFacultadComponent} from  './pages/facultades/editar-facultad/editar-facultad.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'usuarios',
        component: UsuarioComponent,
        canActivate: [authGuard],
      },
      {
        path: 'usuarios/crear',
        component: CreateUsuarioComponent,
        canActivate: [authGuard],
      },
      {
        path: 'usuarios/editar',  
        component: EditarUsuarioComponent,
        canActivate: [authGuard],
      },
      {
        path: 'facultades',  
        component: FacultadesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'facultades/crear',  
        component: CrearFacultadComponent,
        canActivate: [authGuard],
      },
      {
        path: 'facultades/editar', 
        component: EditarFacultadComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
