import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBatchesService } from '../product_batches.service'; // Cambiar la importación del servicio
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-view-product-batch', // Cambiar el selector
  standalone: true,
  templateUrl: './view-product-batch.component.html', // Cambiar el nombre del archivo HTML
  styleUrls: ['./view-product-batch.component.css'], // Cambiar el nombre del archivo CSS
  imports: [ReactiveFormsModule, CommonModule]
})
export class ViewProductBatchComponent implements OnInit { // Cambiar el nombre del componente
  productBatchForm: FormGroup; // Cambiar el nombre del formulario
  productBatch: any;
  productBatchId: number;

  constructor(
    private fb: FormBuilder,
    private productBatchesService: ProductBatchesService, // Cambiar el nombre del servicio
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productBatchForm = this.fb.group({ // Cambiar el nombre del formulario
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      sku: ['', Validators.required],
      type: ['', Validators.required],
      supplier_id: ['', Validators.required]
    });

    const navigation = this.router.getCurrentNavigation();
    this.productBatch = navigation?.extras?.state?.['productBatch']; // Cambiar el nombre de la propiedad
    this.productBatchId = this.productBatch?.id || 0; // Inicializar productBatchId en el constructor
  }

  ngOnInit(): void {
    if (this.productBatch) {
      // Inicializar el formulario con los datos del producto
      this.productBatchForm.patchValue({
        name: this.productBatch.name,
        description: this.productBatch.description,
        price: this.productBatch.price,
        quantity: this.productBatch.quantity,
        sku: this.productBatch.sku,
        type: this.productBatch.type,
        supplier_id: this.productBatch.supplier_id
      });
    }
  }
}
