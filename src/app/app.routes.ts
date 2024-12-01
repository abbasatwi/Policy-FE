import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ListPoliciesComponent } from './pages/list-policies/list-policies.component';
import { authGuard } from './guards/auth.guard';
import { PolicyAddUpdateComponent } from './pages/policy-add-update/policy-add-update.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'policies',
    component: ListPoliciesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'policies/add-update/:id',
    component: PolicyAddUpdateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'policies/add-update',
    component: PolicyAddUpdateComponent,
    canActivate: [authGuard],
  },
  {
    path: '**', // Wildcard route to catch undefined paths
    redirectTo: 'login', // Redirect to login
  },
];
