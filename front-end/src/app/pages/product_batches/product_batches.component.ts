import { Component, OnInit } from '@angular/core';
import { ProductBatchesService } from './product_batches.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-batches',
  templateUrl: './product_batches.component.html',
  styleUrls: ['./product_batches.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductBatchesComponent implements OnInit {
  productBatches: any[] = [];
  filteredBatches: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Vendido'; 

  constructor(private productBatchesService: ProductBatchesService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProductBatches();
  }

  fetchProductBatches(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.productBatchesService.getProductBatches(estado).subscribe(
      (data) => {
        this.productBatches = data.data;
        this.filteredBatches = this.productBatches;
        this.filterProductBatches();
      },
      (error) => {
        console.error('Error fetching product batches:', error);
      }
    );
  }

  filterProductBatches(): void {
    this.filteredBatches = this.productBatches.filter(batch => {
      const product = batch.product.toLowerCase();
      const quantity = batch.quantity;
      const batch_date = batch.batch_date;
      const state = batch.state;
      const notes = batch.notes;

      const searchText = this.searchText.toLowerCase();
      
      return product.includes(searchText) || 
        quantity.includes(searchText) || 
        batch_date.includes(searchText) || 
        state.includes(searchText) || 
        notes.includes(searchText);
    });
  }
  
  onSearchTextChange(): void {
    this.filterProductBatches();
  }

  onStatusChange(): void {
    this.fetchProductBatches();
  }

  deleteBatch(id: number): void { // Renombrado a deleteBatch
    this.productBatchesService.cancelBatch(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Lote eliminado correctamente'})
        this.fetchProductBatches();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar el lote' + error})   
      }
    );
  }

  viewBatch(batch: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        batch,
      },
    };
    this.router.navigate(['product_batches/view'], navigationExtras);
  }
}
