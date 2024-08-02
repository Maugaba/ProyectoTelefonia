import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  usuarioId: number;
  usuario: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      id_rol: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras?.state?.['usuario'];
    this.usuarioId = this.usuario?.id || 0; // Inicializar usuarioId en el constructor
  }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/pages/custom/wizard/wizardUsers.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.document.body, script);

    if (this.usuario) {
      this.usuarioForm.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        correo_electronico: this.usuario.correo_electronico,
        usuario: this.usuario.usuario,
        id_rol: this.usuario.id_rol
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario válido:', this.usuarioForm.valid);
    console.log('Datos enviados:', this.usuarioForm.value); 

    if (this.usuarioForm.valid) {
      this.usuarioService.updateUsuario(this.usuarioId, this.usuarioForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario',
            text: 'Usuario actualizado correctamente'
          });
          this.router.navigate(['/usuario']);
        },
        (error) => {
          console.error('Error actualizando usuario:', error);
        }
      );
    }
  }
}
