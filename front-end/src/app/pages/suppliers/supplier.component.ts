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
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  filterSuppliers(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const name = supplier.name ? supplier.name.toLowerCase() : '';
      const contact_name = supplier.contact_name ? supplier.contact_name.toLowerCase() : '';
      const contact_email = supplier.contact_email ? supplier.contact_email.toLowerCase() : '';
      const contact_phone = supplier.contact_phone ? supplier.contact_phone.toLowerCase() : '';
      const address = supplier.address ? supplier.address.toLowerCase() : '';
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
        contact_name.includes(searchText) ||
        contact_email.includes(searchText) ||
        contact_phone.includes(searchText) ||
        address.includes(searchText);
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
    this.router.navigate(['/suppliers/edit'], navigationExtras);
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
