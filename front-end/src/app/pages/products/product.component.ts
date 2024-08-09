import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.productService.getProduct(estado).subscribe(
      (data) => {
        this.products = data.data;
        this.filteredProducts = this.products;
        this.filterProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const name = product.name ? product.name.toLowerCase() : '';
      const description = product.description ? product.description.toLowerCase() : '';
      const price = product.price ? product.price.toLowerCase() : '';
      const quantity = product.quantity ? product.quantity.toLowerCase() : '';
      const sku = product.sku ? product.sku.toLowerCase() : '';
      const type = product.type ? product.type.toLowerCase() : '';
      const supplier_id = product.supplier_id;
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
        description.includes(searchText) ||
        price.includes(searchText) ||
        quantity.includes(searchText) ||
        sku.includes(searchText) ||
        type.includes(searchText) ||
        supplier_id.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterProducts();
  }

  onStatusChange(): void {
    this.fetchProducts();
  }

  editProduct(product: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        product
      }
    };
    this.router.navigate(['/products/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.productService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchProducts();
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
