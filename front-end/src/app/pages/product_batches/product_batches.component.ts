import { Component, OnInit } from '@angular/core';
import { ProductbacheService } from './product_batches.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product_batches.component.html',
  styleUrls: ['./product_batches.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductbatcheComponent implements OnInit {
  productbatches: any[] = [];
  filteredProductbatches: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private productbatchService: ProductbacheService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProductbatches();
  }

  fetchProductbatches(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.productbatchService.getProductbatch(estado).subscribe(
      (data) => {
        this.productbatches = data.data;
        this.filteredProductbatches = this.productbatches;
        this.filterProductbatches();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProductbatches(): void {
    this.filteredProductbatches = this.productbatches.filter(productbatch => {
      const product_id = productbatch.product_id ? productbatch.product_id.toLowerCase() : '';
      const batch_number = productbatch.batch_number ? productbatch.batch_number.toLowerCase() : '';
      const expiration_date = productbatch.expiration_date ? productbatch.expiration_date.toLowerCase() : '';
      const quantity = productbatch.quantity ? productbatch.quantity.toLowerCase() : '';
      
      const searchText = this.searchText.toLowerCase();
      
      return product_id.includes(searchText) ||
        batch_number.includes(searchText) ||
        expiration_date.includes(searchText) ||
        quantity.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterProductbatches();
  }

  onStatusChange(): void {
    this.fetchProductbatches();
  }

  editProductbatch(productbatch: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        productbatch
      }
    };
    this.router.navigate(['/productbatches/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.productbatchService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchProductbatches();
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