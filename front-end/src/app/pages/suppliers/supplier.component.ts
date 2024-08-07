import { Component, OnInit } from '@angular/core';
import { SupplierService } from './supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SupplierComponent implements OnInit {
  suppliers: any[] = [];
  filteredSuppliers: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.supplierService.getSupplier(estado).subscribe(
      (data) => {
        this.suppliers = data.data;
        this.filteredSuppliers = this.suppliers;
        this.filterSuppliers();
        console.log('Suppliers:', this.suppliers);
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  filterSuppliers(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const name = supplier.name ? supplier.name.toLowerCase() : '';
      const lastname = supplier.lastname ? supplier.lastname.toLowerCase() : '';
      const username = supplier.user ? supplier.user.toLowerCase() : '';
      const email = supplier.email ? supplier.email.toLowerCase() : '';
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
             lastname.includes(searchText) ||
             username.includes(searchText) ||
             email.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterSuppliers();
  }

  onStatusChange(): void {
    this.fetchSuppliers();
  }

  editSupplier(supplier: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        supplier
      }
    };
    this.router.navigate(['/supplier/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.supplierService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchSuppliers();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado'+ error})   
      }
    );
  }
}
