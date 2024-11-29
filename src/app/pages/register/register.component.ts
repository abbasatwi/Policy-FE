import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../Validators/passwordMatchValidator';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RegisterRequest } from '../../interfaces/register-request';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, // For Angular directives like *ngIf, *ngFor
    ReactiveFormsModule, // For form directives like [formGroup], formControlName
    MatSnackBarModule, // Import MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private _authService: AuthService, 
    private _snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: passwordMatchValidator });
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
  
    const registerData: RegisterRequest = {
      fullName: this.registerForm.get('fullName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };
  
    this._authService.register(registerData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this._snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this._snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      complete: () => console.log('Register API call completed.'),
    });
  }
  
}
