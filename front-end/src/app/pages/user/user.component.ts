import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  selectedStatus: string = 'Activo'; 

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const estado = this.selectedStatus === 'todos' ? '' : this.selectedStatus;
    this.userService.getUsers(estado).subscribe(
      (data) => {
        this.users = data.data;
        this.filteredUsers = this.users;
        this.filterUsers();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const name = user.name ? user.name.toLowerCase() : '';
      const lastname = user.lastname ? user.lastname.toLowerCase() : '';
      const username = user.user ? user.user.toLowerCase() : '';
      const email = user.email ? user.email.toLowerCase() : '';
      
      const searchText = this.searchText.toLowerCase();
      
      return name.includes(searchText) ||
             lastname.includes(searchText) ||
             username.includes(searchText) ||
             email.includes(searchText);
    });
  }
  

  onSearchTextChange(): void {
    this.filterUsers();
  }

  onStatusChange(): void {
    this.fetchUsers();
  }

  goToCreate(): void {
    this.router.navigate(['/user/create']);
  }

  editUser(user: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        user
      }
    };
    this.router.navigate(['/user/edit'], navigationExtras);
  }

  changeState(id: number): void {
    this.userService.changeState(id).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado',
          text: 'Estado actualizado correctamente'})
        this.fetchUsers();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado'+ error})   
      }
    );
  }
}
