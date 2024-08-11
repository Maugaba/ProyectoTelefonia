import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleService } from '../sale.service';
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
export class ViewSaleComponent implements OnInit {
  productForm: FormGroup;
  product: any;
  productId: number;
  private _wizardObj: any;
  private _formEl: any;

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {  
    if (this.sale) {
    }
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
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
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.['product'];
    this.productId = this.product?.id || 0; // Inicializar productId en el constructor
  }
}
