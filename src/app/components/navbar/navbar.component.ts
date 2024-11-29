import { UserDetails } from './../../interfaces/user-details';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  UserDetails: UserDetails | undefined;

  // Inject services into the constructor
  constructor(
    private _authService: AuthService,
    private _matSnackBar: MatSnackBar,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        // Fetch user details when logged in
        this.UserDetails = this._authService.getUserDetail()!;
      } else {
        this.UserDetails = undefined;
      }
    });
  }

  logout() {
    this._authService.logout();
    this.isLoggedIn = false;
    this.UserDetails = undefined;
    this._matSnackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this._router.navigate(['/']);
  }

  login() {
    this._router.navigate(['/']);
  }

  register() {
    this._router.navigate(['/register']);
  }

  policies() {
    this._router.navigate(['/policies']);
    }
}
