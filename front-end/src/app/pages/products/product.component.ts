import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { SupplierService } from '../suppliers/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule } from '@angular/router';
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
  suppliers: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchSuppliers();
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

  fetchSuppliers(): void {
    this.supplierService.getSupplier(this.selectedStatus).subscribe(
      (data) => {
        this.suppliers = data.data; // Asignar correctamente la lista de proveedores
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : ''; // Devolver cadena vacía si no se encuentra
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const name = product.name ? product.name.toLowerCase() : '';
      const description = product.description ? product.description.toLowerCase() : '';
      const price = product.price ? product.price.toString().toLowerCase() : '';
      const quantity = product.quantity ? product.quantity.toString().toLowerCase() : '';
      const sku = product.sku ? product.sku.toLowerCase() : '';
      const type = product.type ? product.type.toLowerCase() : '';
      const supplierName = this.getSupplierName(product.supplier_id).toLowerCase();
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
        description.includes(searchText) ||
        price.includes(searchText) ||
        quantity.includes(searchText) ||
        sku.includes(searchText) ||
        type.includes(searchText) ||
        supplierName.includes(searchText);
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
      state: { product }
    };
    this.router.navigate(['/products/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.productService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'
        });
        this.fetchProducts();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado: ' + error
        });   
      }
    );
  }
}
