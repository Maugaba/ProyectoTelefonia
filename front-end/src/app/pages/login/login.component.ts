import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginObj: Login;
  password: string;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
    this.password = '';
  }

  onLogin() {
    this.loginObj.password = this.password;

    this.http.post('http://localhost:8000/api/login', this.loginObj).subscribe((res: any) => {
      if (res.token) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido',
          customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            icon: 'swal-icon'
          }
        });
        // Almacenar los datos en el localStorage
        localStorage.setItem('angular17token', res.token);
        localStorage.setItem('user_id', res.user_id.toString());
        localStorage.setItem('user_name', res.user_name);
        localStorage.setItem('rol', res.rol.toString());
        this.router.navigateByUrl('/dashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: 'Credenciales inválidas',
          customClass: {
            icon: 'icon-right'
          }
        });
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Credenciales inválidas' + error.message,
        customClass: {
          icon: 'icon-right'
        }
      });
    });
  }
  
}

export class Login {
  user: string;
  password: string;
  constructor() {
    this.user = '';
    this.password = '';
  }
}
