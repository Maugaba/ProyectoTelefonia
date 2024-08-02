import { Component, OnInit } from '@angular/core';
import { FacultadesService } from './facultades.service';
import { Router, NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facultades',
  standalone: true,
  templateUrl: './facultades.component.html',
  styleUrls: ['./facultades.component.css'],
  imports: [CommonModule]
})
export class FacultadesComponent implements OnInit {
  facultades: any[] = [];

  constructor(private facultadesService: FacultadesService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFacultades();
  }

  fetchFacultades(): void {
    this.facultadesService.getFacultades().subscribe(
      (data) => {
        this.facultades = data.data;
      },
      (error) => {
        console.error('Error fetching facultades:', error);
      }
    );
  }

  goToCreate(): void {
    this.router.navigate(['/facultades/crear']);
  }

  editFacultad(facultad: any): void {
    const navigationExtras: NavigationExtras = {
      state: { facultad }
    };
    this.router.navigate(['/facultades/editar'], navigationExtras);
  }
}
