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
export class CreateProductBatchesComponent implements OnInit {
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
      batch_number: ['', Validators.required],
      expiration_date: ['', Validators.required],
      quantity: [1, Validators.required],
      state: ['Activo'], // Estado predeterminado
      items: this.fb.array([]),
      total_amount: [0]
    });
  }

  ngOnInit() {
    this.productBatchesService.getProductBatches('Activo').subscribe(productsList => {
      this.products = productsList.data;
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, Validators.required],
      unit_price: [{ value: 0, disabled: true }, Validators.required],
      total_price: [{ value: 0, disabled: true }]
    });
  }

  get items(): FormArray {
    return this.productBatchesForm.get('items') as FormArray;
  }

  onProductSelect(index: number) {
    const control = this.items.at(index);
    const selectedProduct = this.products.find(p => p.id === control.get('product_id')?.value);

    if (selectedProduct) {
      control.get('unit_price')?.setValue(selectedProduct.price, { emitEvent: false });
      control.get('total_price')?.setValue(selectedProduct.price * control.get('quantity')?.value, { emitEvent: false });
    }

    this.calculateTotalAmount();
  }

  updateTotalPrice(index: number) {
    const control = this.items.at(index);
    const unitPrice = control.get('unit_price')?.value || 0;
    const quantity = control.get('quantity')?.value || 0;

    control.get('total_price')?.setValue(unitPrice * quantity, { emitEvent: false });
    this.calculateTotalAmount();
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotalAmount();
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
          this.router.navigate(['/product_batches']);
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
