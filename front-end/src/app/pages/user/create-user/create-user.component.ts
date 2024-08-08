import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-user', 
  standalone: true,
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateUserComponent implements OnInit {
  private _wizardObj: any;
  private _formEl: any;

  ngOnInit() {
    // Inicialización del formulario con valores predeterminados
    this.userForm.patchValue({
      id_rol: 1, // Establecer el rol por defecto en 1
      state: true // Establecer el estado por defecto en activo
    });
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
        const name = this.userForm.value.name;
        const hasNumber = /\d/.test(name);
        const lastname = this.userForm.value.lastname;
        const hasNumberLastname = /\d/.test(lastname);
        const working_days = this.userForm.value.working_days;
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
        if (!this.userForm.value.user) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un usuario válido'
          });
          return;
        }
        if (!this.userForm.value.password) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese una contraseña válida'
          });
          return;
        }
        // El rol siempre es 1, así que no es necesario validar su existencia
        // if (!this.userForm.value.id_rol) {
        //   wizard.stop(); // Detener la navegación
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Error',
        //     text: 'Por favor, seleccione un rol'
        //   });
        //   return;
        // }
      }
    });

    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.userForm.value);
      if (this.userForm.valid) {
        this.userService.createUser(this.userForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario',
                text: 'Usuario creado correctamente'
              });
              this.router.navigate(['/user']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el usuario' + response.error
              });
            }
          },
          (response) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el usuario' + response.error.error
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

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      user: ['', Validators.required],
      working_days: ['', Validators.required],
      password: ['', Validators.required],
      id_rol: [1, Validators.required], // Valor por defecto para el rol
      state: [true] // Valor por defecto para el estado
    });
  }
}
