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
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      id_rol: ['', Validators.required],
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
        lastname: this.customers.lastname,
        email: this.customers.email,
        user: this.customers.user,
        id_rol: this.customers.id_rol
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario válido:', this.customersForm.valid);
    console.log('Datos enviados:', this.customersForm.value); 

    if (this.customersForm.valid) {
      this.customersService.updateUser(this.customersId, this.customersForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario',
            text: 'Usuario actualizado correctamente'
          });
          this.router.navigate(['/user']);
        },
        (error) => {
          console.error('Error actualizando usuario:', error);
        }
      );
    }
  }
}
