import { Component, OnInit, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
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
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditUserComponent implements OnInit, AfterViewInit {
  userForm: FormGroup;
  user: any;
  userId: number;
  private _wizardObj: any;
  private _formEl: any;
  availableDays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  allDays: string[] = [...this.availableDays]; // Define allDays with the same initial values

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
      working_days: this.fb.array([], Validators.required), // Cambiar para manejar los días de trabajo
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
      if (this.user.working_days) {
        // Decodificar el campo working_days
        const workingDaysString = this.user.working_days; // Por ejemplo: "Viernes_5, Martes_5"
        const workingDaysArray = workingDaysString.split(', ').map((dayHours: any) => {
          const [day, hours] = dayHours.split(':');
          return { day, hours: Number(hours) };
        });

        for (const workingDay of workingDaysArray) {
          this.addWorkingDay(workingDay.day, workingDay.hours);
        }
      }
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
        const workingDays = this.workingDaysArray.controls.map(control => {
          return `${control.value.day}:${control.value.hours}`;
        }).join(', ');
        this.userService.updateUser(this.userId, this.userForm.value, workingDays).subscribe(
          (response) => {
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario',
                text: 'Usuario modificado correctamente'
              });
              this.router.navigate(['/user']);
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

  get workingDaysArray() {
    return this.userForm.get('working_days') as FormArray;
  }

  addWorkingDay(day: string, hours: number) {
    // Verificar si el día ya ha sido agregado
    const existingDayControl = this.workingDaysArray.controls.find(control => control.value.day === day);
  
    if (existingDayControl) {
      // Verificar si las horas a agregar superan el límite de 8 horas para el día
      const currentHours = existingDayControl.value.hours;
      if (currentHours + hours > 8) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pueden asignar más de 8 horas por día'
        });
        return;
      }
  
      // Actualizar las horas del día existente
      existingDayControl.get('hours')?.setValue(currentHours + hours);
      return;
    }
  
    // Verificar el límite de horas totales
    const totalHours = this.getTotalHours() + hours;
    if (totalHours > 40) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las horas totales no pueden exceder 40 horas'
      });
      return;
    }
  
    if (hours > 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pueden asignar más de 8 horas por día'
      });
      return;
    }
  
    // Agregar el nuevo día
    this.workingDaysArray.push(this.fb.group({
      day: [day, Validators.required],
      hours: [hours, [Validators.required, Validators.min(1)]]
    }));
  
    // Actualizar la lista de días disponibles
    this.updateAvailableDays();
  }
  
  removeWorkingDay(index: number) {
    const dayToRemove = this.workingDaysArray.at(index).value.day;
    this.workingDaysArray.removeAt(index);

    // Volver a añadir el día a la lista disponible
    if (!this.availableDays.includes(dayToRemove)) {
      this.availableDays.push(dayToRemove);
    }
  }

  updateAvailableDays() {
    const selectedDays = this.workingDaysArray.controls.map(control => control.value.day);
    this.availableDays = this.allDays.filter(day => !selectedDays.includes(day));
  }

  getTotalHours() {
    return this.workingDaysArray.controls
      .map(control => control.value.hours)
      .reduce((a, b) => a + b, 0);
  }
}
