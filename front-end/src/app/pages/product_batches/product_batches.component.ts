import { Component, OnInit } from '@angular/core';
import { ProductBatchesService } from './product_batches.service';
import { ProductService } from '../products/product.service';
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
  products: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo';
  startDate: string = ''; // Inicializa con un valor vacío
  endDate: string = '';   // Inicializa con un valor vacío

  constructor(
    private productBatchesService: ProductBatchesService, 
    private productService: ProductService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProductBatches();
    this.fetchProducts();
  }

  fetchProductBatches(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.productBatchesService.getProductBatches(estado).subscribe(
      (data) => {
        this.productBatches = data.data;
        this.filteredBatches = this.productBatches;
        this.filterProductBatches(); // Aplicar filtros al inicio
      },
      (error) => {
        console.error('Error fetching product batches:', error);
      }
    );
  }

  fetchProducts(): void {
    this.productService.getProduct(this.selectedStatus).subscribe(
      (data) => {
        this.products = data.data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  }

  filterProductBatches(): void {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.filteredBatches = this.productBatches.filter(batch => {
      const productId = batch.product_id;
      const batchNumber = batch.batch_number;
      const expirationDate = new Date(batch.expiration_date); // Convertir fecha a objeto Date
      const quantity = batch.quantity;
      const state = batch.state;

      const searchText = this.searchText.toLowerCase();

      const matchesSearchText = this.getProductName(productId).toLowerCase().includes(searchText) || 
                                batchNumber.toLowerCase().includes(searchText) || 
                                expirationDate.toLocaleDateString().includes(searchText) || 
                                quantity.toString().includes(searchText) || 
                                state.toLowerCase().includes(searchText);

      // Filtra por fechas si están seleccionadas
      const withinDateRange = (!this.startDate || expirationDate >= start) &&
                              (!this.endDate || expirationDate <= end);

      return matchesSearchText && withinDateRange;
    });
  }

  onSearchTextChange(): void {
    this.filterProductBatches();
  }

  onStatusChange(): void {
    this.fetchProductBatches();
  }

  toggleBatchState(id: number): void {
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

  // Se llama cuando cambia la fecha de inicio o fin
  onDateChange(): void {
    this.filterProductBatches(); // Filtrar en el cliente
  }
}
