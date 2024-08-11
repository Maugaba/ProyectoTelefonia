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
  selector: 'app-create-sale', 
  standalone: true,
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateSaleComponent{
  private _wizardObj: any;
  private _formEl: any;

  salesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.salesForm = this.fb.group({
      customer_id: ['', Validators.required],
      total_amount: ['', Validators.required],
      sale_date: ['', Validators.required],
      notes: ['', Validators.required],
      items: this.fb.array([], Validators.required)
    });
  }
}
 