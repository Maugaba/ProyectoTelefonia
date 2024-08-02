import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsuarios();
  }

  fetchUsuarios(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.usuarioService.getUsuarios(estado).subscribe(
      (data) => {
        this.usuarios = data.data;
        this.filteredUsuarios = this.usuarios;
        this.filterUsuarios();
      },
      (error) => {
        console.error('Error fetching usuarios:', error);
      }
    );
  }

  filterUsuarios(): void {
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearchText = usuario.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
                                usuario.apellido.toLowerCase().includes(this.searchText.toLowerCase()) ||
                                usuario.usuario.toLowerCase().includes(this.searchText.toLowerCase()) ||
                                usuario.correo_electronico.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearchText;
    });
  }

  onSearchTextChange(): void {
    this.filterUsuarios();
  }

  onStatusChange(): void {
    this.fetchUsuarios();
  }

  goToCreate(): void {
    this.router.navigate(['/usuario/crear']);
  }

  editUsuario(usuario: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario
      }
    };
    this.router.navigate(['/usuarios/editar'], navigationExtras);
  }

  changeEstado(id: number): void {
    this.usuarioService.changeEstado(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchUsuarios();
      },
      (error) => {
        console.error('Error cambiando estado:', error);
      }
    );
  }
}
