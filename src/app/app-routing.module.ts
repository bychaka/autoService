import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import {AccessDeniedComponent} from "./access-denied/access-denied.component";
import {AuthGuard} from "./Guards/auth.guard";
import {RoleAdminGuard} from "./Guards/role-admin.guard";


const routes: Routes = [
  { path: '',
    component: HomeComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleAdminGuard]  },
  { path: 'user/:id', component: UserDashboardComponent, canActivate: [AuthGuard]  },
  { path: 'access-denied', component: AccessDeniedComponent },
  // { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
