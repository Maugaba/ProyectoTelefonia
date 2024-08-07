import { Component, OnInit } from '@angular/core';
import { CustomersService } from './customers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private customersService: CustomersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.customersService.getCustomers(estado).subscribe(
      (data) => {
        this.customers = data.data;
        this.filteredCustomers = this.customers;
        this.filterCustomers();
        console.log('Customers:', this.customers);
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter(customers => {
      const name = customers.name ? customers.name.toLowerCase() : '';
      const lastname = customers.lastname ? customers.lastname.toLowerCase() : '';
      const username = customers.user ? customers.customers.toLowerCase() : '';
      const email = customers.email ? customers.email.toLowerCase() : '';
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
             lastname.includes(searchText) ||
             username.includes(searchText) ||
             email.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterCustomers();
  }

  onStatusChange(): void {
    this.fetchCustomers();
  }

  goToCreate(): void {
    this.router.navigate(['/customers/create']);
  }

  editCustomers(customers: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        customers
      }
    };
    this.router.navigate(['/customers/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.customersService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchCustomers();
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
