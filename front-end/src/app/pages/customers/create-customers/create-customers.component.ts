import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '../customers.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-customers', 
  standalone: true,
  templateUrl: './create-customers.component.html',
  styleUrls: ['./create-customers.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateCustomersComponent{
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
        const name = this.customersForm.value.name;
        const address = this.customersForm.value.address;
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
            text: 'Por favor, ingrese una direccion válido'
          });
          return;
        }
      }
      if (step === 2) {
        const phone = this.customersForm.value.phone;
        const email = this.customersForm.value.email;
        const correctEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
        const hasletter = /[a-zA-Z]/.test(phone);
        if (!email || !correctEmail) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un correo válido'
          });
          return;
        }
        if (!phone || hasletter) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese una numero de telefono válido'
          });
          return;
        }
      
      }
    });
    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.customersForm.value);
      if (this.customersForm.valid) {
        this.customersService.createCustomers(this.customersForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Cliente',
                text: 'Cliente creado correctamente'
              });
              this.router.navigate(['/customers']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el cliente' + response.error
              });
            }
          },
          (response) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el cliente' + response.error.error
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

  customersForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.customersForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
}
