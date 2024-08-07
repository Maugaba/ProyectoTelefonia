import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditSupplierComponent implements OnInit {
  supplierForm: FormGroup;
  supplierId: number;
  supplier: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private supplierService: SupplierService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      id_rol: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    this.supplier = navigation?.extras?.state?.['supplier'];
    this.supplierId = this.supplier?.id || 0; // Inicializar userId en el constructor
  }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/pages/custom/wizard/wizardUsers.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.document.body, script);

    if (this.supplier) {
      this.supplierForm.patchValue({
        name: this.supplier.name,
        lastname: this.supplier.lastname,
        email: this.supplier.email,
        user: this.supplier.user,
        id_rol: this.supplier.id_rol
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario válido:', this.supplierForm.valid);
    console.log('Datos enviados:', this.supplierForm.value); 

    if (this.supplierForm.valid) {
      this.supplierService.updateSupplier(this.supplierId, this.supplierForm.value).subscribe(
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
