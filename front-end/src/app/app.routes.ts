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
import { SupplierComponent } from './pages/suppliers/supplier.component';
import { CreateSupplierComponent } from './pages/suppliers/create-supplier/create-supplier.component';
import { EditSupplierComponent } from './pages/suppliers/edit-supplier/edit-supplier.component';

//Products Routes
import { ProductComponent } from './pages/products/product.component';
import { CreateProductComponent } from './pages/products/create-product/create-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';

//Sales Routes
import { SaleComponent } from './pages/sales/sale.component';
import { CreateSaleComponent } from './pages/sales/create-sale/create-sale.component';

//Sales Routes view
import { ViewSaleComponent } from './pages/sales/view-sale/view-sale.component';

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
        component: SupplierComponent,
        canActivate: [authGuard],
      },
      {
        path: 'suppliers/create',
        component: CreateSupplierComponent,
        canActivate: [authGuard],
      },
      {
        path: 'suppliers/edit',
        component: EditSupplierComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products',
        component: ProductComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products/create',
        component: CreateProductComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products/edit',
        component: EditProductComponent,
        canActivate: [authGuard],
      },
      {
        path: 'sales',
        component: SaleComponent,
        canActivate: [authGuard],
      },
      {
        path: 'sales/create',
        component: CreateSaleComponent,
        canActivate: [authGuard],
      },
      {
        path: 'sales/view',
        component: ViewSaleComponent,
        canActivate: [authGuard],
      },
      {
        path: 'sales/view/:id',
        component: ViewSaleComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
