import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBatchesService } from '../product_batches.service'; // Asegúrate de usar el servicio correcto
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../../products/product.service';

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
  private _wizardObj: any;
  private _formEl: any;

  productBatchesForm: FormGroup;
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productBatchesService: ProductBatchesService, // Asegúrate de usar el servicio correcto
    private productService: ProductService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productBatchesForm = this.fb.group({
      product_id: ['', Validators.required],
      batch_number: ['', Validators.required],
      expiration_date: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    this.initWizard();
  }

  private initWizard() {
    this._wizardObj = new KTWizard('kt_wizard', {
      startStep: 1,
      clickableSteps: false
    });
    this._formEl = KTUtil.getById('kt_form');
    this._wizardObj.on('change', (wizard: any) => {
      if (wizard.getStep() > wizard.getNewStep()) {
        return; // Skip if stepped back
      }
      const step = wizard.getStep();

      // Validar el formulario en cada paso
      if (step === 1) {
        const product_id = this.productBatchesForm.value.product_id;
        const batch_number = this.productBatchesForm.value.batch_number;
        
        if (!batch_number) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un numero válida'
          });
          return;
        }
      }

      if (step === 2) {
        const expiration_date = this.productBatchesForm.value.expiration_date;
        const quantity = this.productBatchesForm.value.quantity;
       
      }
    });
    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.productBatchesForm.value);
      if (this.productBatchesForm.valid) {
        this.productBatchesService.createProductBatch(this.productBatchesForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Lote',
                text: 'Lote creado correctamente'
              });
              this.router.navigate(['/product_batches']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el lote: ' + response.error
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el lote: ' + error.error.error
            });
          }
        );
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, revise los errores en su formulario'
        });
      }
    });
  }

  fetchProducts(): void {
    this.productService.getProduct('Activo').subscribe(
      (data) => {
        this.products = data.data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
