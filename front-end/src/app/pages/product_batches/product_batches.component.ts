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
  selectedStatus: string = 'Activo'; // Actualizado

  constructor(private productBatchesService: ProductBatchesService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProductBatches();
  }

  fetchProductBatches(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.productBatchesService.getProductBatches(estado).subscribe(
      (data) => {
        console.log('Data received:', data); // Verificar los datos recibidos
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
      const productId = batch.product_id; // Actualizado
      const batchNumber = batch.batch_number; // Actualizado
      const expirationDate = batch.expiration_date; // Actualizado
      const quantity = batch.quantity;
      const state = batch.state;

      const searchText = this.searchText.toLowerCase();
      
      return productId.toString().includes(searchText) || 
        batchNumber.toLowerCase().includes(searchText) || 
        expirationDate.toLowerCase().includes(searchText) || 
        quantity.toString().includes(searchText) || 
        state.toLowerCase().includes(searchText);
    });
  }
  
  onSearchTextChange(): void {
    this.filterProductBatches();
  }

  onStatusChange(): void {
    this.fetchProductBatches();
  }

  toggleBatchState(id: number): void { // Actualizado
    this.productBatchesService.toggleBatchState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado del lote actualizado correctamente'
        });
        this.fetchProductBatches();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado del lote: ' + error
        });
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
