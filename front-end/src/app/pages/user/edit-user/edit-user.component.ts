import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: number;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      id_rol: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];
    this.userId = this.user?.id || 0; // Inicializar userId en el constructor
  }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/pages/custom/wizard/wizardUsers.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.document.body, script);

    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        user: this.user.user,
        id_rol: this.user.id_rol
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario válido:', this.userForm.valid);
    console.log('Datos enviados:', this.userForm.value); 

    if (this.userForm.valid) {
      this.userService.updateUser(this.userId, this.userForm.value).subscribe(
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
