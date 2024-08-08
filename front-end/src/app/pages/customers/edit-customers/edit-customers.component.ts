import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../customers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-customers',
  standalone: true,
  templateUrl: './edit-customers.component.html',
  styleUrls: ['./edit-customers.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditCustomersComponent implements OnInit {
  customersForm: FormGroup;
  customersId: number;
  customers: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private customersService: CustomersService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.customersForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    this.customers = navigation?.extras?.state?.['user'];
    this.customersId = this.customers?.id || 0; // Inicializar userId en el constructor
  }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/pages/custom/wizard/wizardUsers.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.document.body, script);

    if (this.customers) {
      this.customersForm.patchValue({
        name: this.customers.name,
        email: this.customers.email,
        phone: this.customers.phone,
        address: this.customers.address
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario válido:', this.customersForm.valid);
    console.log('Datos enviados:', this.customersForm.value); 

    if (this.customersForm.valid) {
      this.customersService.updateCustomers(this.customersId, this.customersForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente',
            text: 'Cliente actualizado correctamente'
          });
          this.router.navigate(['/customers']);
        },
        (error) => {
          console.error('Error actualizando cliente:', error);
        }
      );
    }
  }
}
