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
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  product: any;
  productId: number;
  suppliers: any[] = []; // Añadido para almacenar proveedores
  private _wizardObj: any;
  private _formEl: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      sku: ['', Validators.required],
      type: ['', Validators.required],
      supplier_id: ['', Validators.required]
    });

    // Obtener el producto de la navegación
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.['product'];
    this.productId = this.product?.id || 0; // Inicializar productId en el constructor
  }

  ngOnInit(): void {
    this.fetchSuppliers();
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        quantity: this.product.quantity,
        sku: this.product.sku,
        type: this.product.type,
        supplier_id: this.product.supplier_id
      });
    }
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
        const name = this.productForm.value.name;
        const description = this.productForm.value.description;
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
            text: 'Por favor, ingrese una descripción válida'
          });
          return;
        }
      }
      if (step === 2) {
        const price = this.productForm.value.price;
        const quantity = this.productForm.value.quantity;
        const sku = this.productForm.value.sku;
        const type = this.productForm.value.type;
        const supplier_id = this.productForm.value.supplier_id;
        // Agregar validaciones o lógica específica para el paso 2
      }
    });

    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.productForm.value);
      if (this.productForm.valid) {
        this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
          (response) => {
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Producto',
                text: 'Producto modificado correctamente'
              });
              this.router.navigate(['/products']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al modificar el producto: ' + response.error
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al modificar el producto: ' + error.error.error
            });
          }
        );
      } else {
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
