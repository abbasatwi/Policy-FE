import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';  // Import RouterModule
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  // Import ReactiveFormsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    CommonModule, 
    ReactiveFormsModule,  
    MatFormFieldModule,   
    MatInputModule,       
    RouterModule,        
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Dependencies injected through constructor
  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {}

  hide = true;
  form!: FormGroup; // Define form

  // Login method for handling the form submission
  login() {
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/policies']);
      },
      error: (error) => {
        this.matSnackBar.open(error.error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      },
    });
  }

  // ngOnInit method for initializing the form group
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
