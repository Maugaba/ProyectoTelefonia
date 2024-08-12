import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleService } from '../sale.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-sale',
  standalone: true,
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateSaleComponent implements OnInit {
  salesForm: FormGroup;
  products: { id: number, name: string, price: number }[] = [];
  customers: { id: number, name: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.salesForm = this.fb.group({
      customer_id: ['', Validators.required],
      total_amount: [0],
      sale_date: ['', Validators.required],
      notes: [''],
      items: this.fb.array([this.createItem()], Validators.required)
    });
  }

  ngOnInit() {
    this.saleService.getProduct('Activo').subscribe(productsList => {
      this.products = productsList.data;
    });
    this.saleService.getCustomer('Activo').subscribe(customersList => {
      this.customers = customersList.data;
    });
  }
  createItem(): FormGroup {
    return this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, Validators.required],
      unit_price: [0, Validators.required], // Inicializar con 0
      total_price: [0, Validators.required]  // Inicializar con 0
    });
  }
  


  get items(): FormArray {
    return this.salesForm.get('items') as FormArray;
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
      // Asegúrate de que total_price sea un número
      const totalPrice = parseFloat(item.total_price);
      total += isNaN(totalPrice) ? 0 : totalPrice;
    });
    
    this.salesForm.patchValue({ total_amount: total });
  }

  onSubmit() {
    if (this.salesForm.valid) {
      this.saleService.createSale(this.salesForm.value).subscribe(
        (response) => {
          Swal.fire('Venta creada', 'La venta ha sido creada con éxito', 'success');
          this.router.navigate(['/sales']);
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al crear la venta: ' + error.error.error, 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor, complete el formulario', 'error');
    }
  }
  
}
