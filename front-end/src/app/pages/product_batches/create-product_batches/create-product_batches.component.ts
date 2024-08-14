import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBatchesService } from '../product_batches.service'; // Asegúrate de usar el servicio correcto
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-product-batches',
  standalone: true,
  templateUrl: './create-product_batches.component.html',
  styleUrls: ['./create-product_batches.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateProductBatchesComponent implements OnInit { // Ajusta el nombre del componente
  productBatchesForm: FormGroup;
  products: { id: number, name: string, price: number }[] = [];
  
  constructor(
    private fb: FormBuilder,
    private productBatchesService: ProductBatchesService, // Asegúrate de usar el servicio correcto
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productBatchesForm = this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, Validators.required],
      // Agrega otros campos necesarios para el lote de productos
    });
  }

  ngOnInit() {
    this.productBatchesService.getProduct('Activo').subscribe(productsList => {
      this.products = productsList.data;
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, Validators.required],
      unit_price: [0, Validators.required],
      total_price: [0, Validators.required]
    });
  }

  get items(): FormArray {
    return this.productBatchesForm.get('items') as FormArray;
  }

  onProductSelect(index: number) {
    const control = this.items.at(index);
    const selectedProduct = this.products.find(p => p.id == control.get('product_id')?.value);

    if (selectedProduct) {
      control.get('unit_price')?.enable(); // Habilitar el control
      control.patchValue({
        unit_price: selectedProduct.price,
        total_price: selectedProduct.price * control.get('quantity')?.value
      });
    }

    this.calculateTotalAmount(); // Update the total amount
  }

  updateTotalPrice(index: number) {
    const control = this.items.at(index);
    const unitPrice = control.get('unit_price')?.value || 0;
    const quantity = control.get('quantity')?.value || 0;
  
    control.patchValue({ total_price: unitPrice * quantity });
    this.calculateTotalAmount(); // Update the total amount
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotalAmount(); // Update the total amount
  }

  calculateTotalAmount() {
    const itemsArray = this.items.value as { total_price: any }[] || [];
    let total = 0;
    itemsArray.forEach(item => {
      const totalPrice = parseFloat(item.total_price);
      total += isNaN(totalPrice) ? 0 : totalPrice;
    });
    
    this.productBatchesForm.patchValue({ total_amount: total });
  }

  onSubmit() {
    if (this.productBatchesForm.valid) {
      this.productBatchesService.createProductBatch(this.productBatchesForm.value).subscribe(
        (response) => {
          Swal.fire('Lote creado', 'El lote ha sido creado con éxito', 'success');
          this.router.navigate(['/product-batches']);
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al crear el lote: ' + error.error.error, 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor, complete el formulario', 'error');
    }
  }
}
