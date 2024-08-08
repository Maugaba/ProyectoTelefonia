import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../supplier.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-supplier', 
  standalone: true,
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateSupplierComponent{
  private _wizardObj: any;
  private _formEl: any;

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
        const address = this.supplierForm.value.address;
        const name = this.supplierForm.value.name;
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
        if (!address) {
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
        const contact_phone = this.supplierForm.value.contact_phone;
        const contact_name = this.supplierForm.value.contact_name;
        const hasletter = /[a-zA-Z]/.test(contact_phone);
        const contact_email = this.supplierForm.value.contact_email;
        const hasNumbercontactname = /\d/.test(contact_name);
        const correctEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(contact_email);
        if (!contact_name || hasNumbercontactname) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un nombre de contacto válido'
          });
          return;
        }
        if (!contact_email || !correctEmail) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un correo de contacto válido'
          });
          return;
        }
        if (!contact_phone || hasletter) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un teléfono de contacto válido'
          });
          return;
        }
        
      }
    });

    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.supplierForm.value);
      if (this.supplierForm.valid) {
        this.supplierService.createSupplier(this.supplierForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Proveedor',
                text: 'Proveedor creado correctamente'
              });
              this.router.navigate(['/suppliers']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el proveedor' + response.error
              });
            }
          },
          (response) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el proveedor' + response.error.error
            });
          }
        );
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, tiene errores en su formulario'
        });
      }
    });
  }

  supplierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contact_name: ['', Validators.required],
      contact_email: ['', Validators.required],
      contact_phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
}
