import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FacultadesService } from '../facultades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-facultad',
  standalone: true,
  templateUrl: './editar-facultad.component.html',
  styleUrls: ['./editar-facultad.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditarFacultadComponent implements OnInit {
  facultadForm: FormGroup;
  facultadId: number;
  facultad: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private facultadesService: FacultadesService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.facultadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    const navigation = this.router.getCurrentNavigation();
    this.facultad = navigation?.extras?.state?.['facultad'];
    this.facultadId = this.facultad?.id || 0;
  }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/pages/custom/wizard/wizardFacultad.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(this.document.body, script);

    if (this.facultad) {
      this.facultadForm.patchValue(this.facultad);
    }
  }

  onSubmit(): void {
    if (this.facultadForm.valid) {
      this.facultadesService.updateFacultad(this.facultadId, this.facultadForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Facultad',
            text: 'Facultad actualizada correctamente'
          }).then(() => {
            this.router.navigate(['/facultades']);
          });
        },
        (error) => {
          console.error('Error actualizando facultad:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error actualizando la facultad'
          });
        }
      );
    }
  }
}
