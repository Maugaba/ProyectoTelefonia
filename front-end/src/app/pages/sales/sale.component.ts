import { Component, OnInit } from '@angular/core';
import { SaleService } from './sale.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SaleComponent implements OnInit {
  sales: any[] = [];
  filteredSales: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Vendido'; 

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSales();
  }

  fetchSales(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.saleService.getSale(estado).subscribe(
      (data) => {
        this.sales = data.data;
        this.filteredSales = this.sales;
        this.filterSales();
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
  }

  filterSales(): void {
    this.filteredSales = this.sales.filter(sale => {
      const customer = sale.customer.toLowerCase();
      const total_amount = sale.total_amount;
      const sale_date = sale.sale_date;
      const state = sale.state;
      const notes = sale.notes;
      const items_count = sale.items_count;

      const searchText = this.searchText.toLowerCase();
      
      return customer.includes(searchText) || 
        total_amount.includes(searchText) || 
        sale_date.includes(searchText) || 
        state.includes(searchText) || 
        notes.includes(searchText) || 
        items_count.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterSales();
  }

  onStatusChange(): void {
    this.fetchSales();
  }

  cancelSale(id: number): void {
    this.saleService.cancelSale(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Venta cancelada correctamente'})
        this.fetchSales();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cancelar la venta'+ error})   
      }
    );
  }

  viewSale(sale: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        sale,
      },
    };
    this.router.navigate(['sales/view'], navigationExtras);
  }
}
