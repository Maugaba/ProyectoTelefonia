import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { SupplierService } from '../../suppliers/supplier.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateProductComponent implements OnInit {
  private _wizardObj: any;
  private _formEl: any;

  productsForm: FormGroup;
  suppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      sku: ['', Validators.required],
      type: ['', Validators.required],
      supplier_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchSuppliers();
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
        const name = this.productsForm.value.name;
        const description = this.productsForm.value.description;
        const hasNumber = /\d/.test(name);
        if (!name || hasNumber) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un nombre válido'
          });
          return;
        }
        if (!description) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese una dirección válida'
          });
          return;
        }
      }
      if (step === 2) {
        const price = this.productsForm.value.price;
        const quantity = this.productsForm.value.quantity;
        const sku = this.productsForm.value.sku;
        const type = this.productsForm.value.type;
        const supplier_id = this.productsForm.value.supplier_id;
       
      }
    });
    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.productsForm.value);
      if (this.productsForm.valid) {
        this.productService.createProduct(this.productsForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Producto',
                text: 'Producto creado correctamente'
              });
              this.router.navigate(['/products']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el producto: ' + response.error
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el producto: ' + error.error.error
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

  fetchSuppliers(): void {
    this.supplierService.getSupplier('Activo').subscribe(
      (data) => {
        this.suppliers = data.data;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }
}
