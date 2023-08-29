import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {httpInterceptorProviders} from './_helpers/http.interceptor';
import {RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {AccountListComponent} from './account-management/account-list/account-list.component';
import {AccountService} from "./_services/account.service";
import {AccountDetailComponent} from './account-management/account-detail/account-detail.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {AccountCreateComponent} from './account-management/account-create/account-create.component';
import {ConfirmationDialogComponent} from './_shared/confirmation-dialog/confirmation-dialog.component';
import {VehicleSellComponent} from './vehicle-management/vehicle-sell/vehicle-sell.component';
import {MatStepperModule} from "@angular/material/stepper";
import {VehicleService} from "./_services/vehicle.service";
import {SinalagiService} from "./_services/sinalagi.service";
import {SinalagiListComponent} from './vehicle-management/sinalagi-list/sinalagi-list.component';
import {MyCarListComponent} from './vehicle-management/my-car-list/my-car-list.component';
import {CreateCarComponent} from './vehicle-management/create-car/create-car.component';
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavBarComponent,
    AccountListComponent,
    AccountDetailComponent,
    AccountCreateComponent,
    ConfirmationDialogComponent,
    VehicleSellComponent,
    SinalagiListComponent,
    MyCarListComponent,
    CreateCarComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatStepperModule,
    MatTooltipModule
  ],
  providers: [httpInterceptorProviders, AccountService, VehicleService, SinalagiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
