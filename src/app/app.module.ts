import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardHeaderComponent } from './shared/dashboard-header/dashboard-header.component';
import { OrderModalComponent } from './shared/order-modal/order-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DecimalPipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    AccessDeniedComponent,
    DashboardHeaderComponent,
    OrderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [HttpClient, DecimalPipe],
  exports: [
    HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
