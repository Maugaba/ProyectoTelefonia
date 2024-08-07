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
        const hasNumber = /\d/.test(name);
        const lastname = this.customersForm.value.lastname;
        const hasNumberLastname = /\d/.test(lastname);
        const working_days = this.customersForm.value.working_days;
        if (!name || hasNumber) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un nombre válido'
          });
          return;
        }
        if (!lastname || hasNumberLastname) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un apellido válido'
          });
          return;
        }
        if (!working_days) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un horario válido'
          });
          return;
        }
      }
      if (step === 2) {
        if (!this.customersForm.value.user) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un usuario válido'
          });
          return;
        }
        if (!this.customersForm.value.password) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese una contraseña válida'
          });
          return;
        }
        if (!this.customersForm.value.id_rol) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, seleccione un rol'
          });
          return;
        }
      }
    });

    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.customersForm.value);
      if (this.customersForm.valid) {
        this.userService.createUser(this.customersForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Cliente',
                text: 'Usuario creado correctamente'
              });
              this.router.navigate(['/user']);
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
    private userService: CustomersService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.customersForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      working_days: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      id_rol: ['', Validators.required],
    });
  }
}
