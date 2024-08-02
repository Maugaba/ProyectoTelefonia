import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


declare var KTWizard: any; // Declara la variable para evitar errores de TypeScript
declare var KTUtil: any; // Declara la variable para evitar errores de TypeScript

@Component({
  selector: 'app-create-usuario', 
  standalone: true,
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CreateUsuarioComponent{
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
        const name = this.usuarioForm.value.name;
        const hasNumber = /\d/.test(name);
        const lastname = this.usuarioForm.value.lastname;
        const hasNumberLastname = /\d/.test(lastname);
        const email = this.usuarioForm.value.email;
        const trueemail = /\S+@\S+\.\S+/.test(email);
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
        if (!trueemail || !email) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico válido'
          });
          return;
        }
      }
      if (step === 2) {
        if (!this.usuarioForm.value.user) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un usuario válido'
          });
          return;
        }
        if (!this.usuarioForm.value.password) {
          wizard.stop(); // Detener la navegación
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese una contraseña válida'
          });
          return;
        }
        if (!this.usuarioForm.value.rol) {
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
      console.log(this.usuarioForm.value);
      if (this.usuarioForm.valid) {
        this.usuarioService.createUsuario(this.usuarioForm.value).subscribe(
          (response) => {
            if(response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario',
                text: 'Usuario creado correctamente'
              });
              this.router.navigate(['/usuarios']);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al crear el usuario' + response.error
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear el usuario' + error
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

  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.usuarioForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }
}
