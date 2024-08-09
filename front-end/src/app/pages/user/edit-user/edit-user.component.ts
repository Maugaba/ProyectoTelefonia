import { Component, OnInit, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

declare var KTWizard: any;
declare var KTUtil: any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class EditUserComponent implements OnInit, AfterViewInit {
  userForm: FormGroup;
  user: any;
  userId: number;
  private _wizardObj: any;
  private _formEl: any;

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
    });

    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];
    this.userId = this.user?.id || 0;
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        lastname: this.user.lastname,
        user: this.user.user,
      });
    }
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
      if (step === 1) {
        // Validaciones o lógica específica para el paso 1
      } else if (step === 2) {
        // Validaciones o lógica específica para el paso 2
      }
    });

    this._wizardObj.on('submit', (wizard: any) => {
      console.log(this.userForm.value);
      if (this.userForm.valid) {
        this.userService.updateUser(this.userId, this.userForm.value).subscribe(
          (response) => {
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario',
                text: 'Usuario modificado correctamente'
              });
              this.router.navigate(['/users']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al modificar el usuario: ' + response.error
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al modificar el usuario: ' + error.error
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, revise los errores en su formulario'
        });
      }
    });
  }

  onSubmit() {
    this._wizardObj.goTo(3); // Navegar a la página de confirmación
    this._wizardObj.submit();
  }
}
