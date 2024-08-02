import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacultadesService } from '../facultades.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-facultad',
  standalone: true,
  templateUrl: './crear-facultad.component.html',
  styleUrls: ['./crear-facultad.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CrearFacultadComponent implements OnInit {
  facultadForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facultadesService: FacultadesService,
    private router: Router
  ) {
    this.facultadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.facultadForm.valid) {
      this.facultadesService.createFacultad(this.facultadForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Facultad',
            text: 'Facultad creada correctamente'
          });
          this.router.navigate(['/facultades']);
        },
        (error) => {
          console.error('Error creando facultad:', error);
        }
      );
    }
  }
}
