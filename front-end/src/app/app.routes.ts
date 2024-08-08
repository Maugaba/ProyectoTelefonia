import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './service/auth.guard';

//User Routes
import { UserComponent } from './pages/user/user.component';
import { CreateUserComponent } from './pages/user/create-user/create-user.component';
import { EditUserComponent } from './pages/user/edit-user/edit-user.component';

//Customers Routes
import { CustomersComponent } from './pages/customers/customers.component';
import { CreateCustomersComponent } from './pages/customers/create-customers/create-customers.component';
import { EditCustomersComponent } from './pages/customers/edit-customers/edit-customers.component';


//Suppliers Routes
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { CreateSuppliersComponent } from './pages/suppliers/create-suppliers/create-suppliers.component';
import { EditSuppliersComponent } from './pages/suppliers/edit-suppliers/edit-suppliers.component';

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
        path: 'user',
        component: UserComponent,
        canActivate: [authGuard],
      },
      {
        path: 'user/create',
        component: CreateUserComponent,
        canActivate: [authGuard],
      },
      {
        path: 'user/edit',  
        component: EditUserComponent,
        canActivate: [authGuard],
      },
      {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'customers/create',
        component: CreateCustomersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'customers/edit',  
        component: EditCustomersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'suppliers/create',
        component: CreateSuppliersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'suppliers/edit',
        component: EditSuppliersComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
