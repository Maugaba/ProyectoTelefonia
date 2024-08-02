import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterModule  } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  currentRoute: string = '';
  
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // Subscribirse a los eventos de navegación para obtener la ruta activa actual
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  logout() {
    const token = localStorage.getItem('angular17token');
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      this.http.get('http://127.0.0.1:8000/api/logout', { headers }).subscribe((res: any) => {
        localStorage.removeItem('angular17token');
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('nombre_usuario');
        localStorage.removeItem('rol');
        
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada.'
        });

        this.router.navigateByUrl('/login');
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cerrar sesión',
          text: 'Hubo un problema al cerrar la sesión'
        });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al cerrar sesión',
        text: 'No hay usuario autenticado'
      });
    }
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }
  
  goTo(routeselect: string): void {
    this.router.navigate([routeselect]);
  }
}
