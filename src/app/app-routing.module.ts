import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AccountListComponent} from "./account-management/account-list/account-list.component";
import {AuthGuardService, CanActivateAdmin, CanActivateUser} from "./_services/auth-guard.service";
import {AccountDetailComponent} from "./account-management/account-detail/account-detail.component";
import {AccountCreateComponent} from "./account-management/account-create/account-create.component";
import {VehicleSellComponent} from "./vehicle-management/vehicle-sell/vehicle-sell.component";
import {SinalagiListComponent} from "./vehicle-management/sinalagi-list/sinalagi-list.component";
import {MyCarListComponent} from "./vehicle-management/my-car-list/my-car-list.component";
import {CreateCarComponent} from "./vehicle-management/create-car/create-car.component";


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'account-list', component: AccountListComponent, canActivate: [CanActivateAdmin]},
  {
    path: 'account-list/edit/:id',
    component: AccountDetailComponent,
    canActivate: [CanActivateAdmin]
  },
  {
    path: 'account-list/create',
    component: AccountCreateComponent,
    canActivate: [CanActivateAdmin]
  },
  {
    path: 'vehicle-sell',
    component: VehicleSellComponent,
    canActivate: [CanActivateUser]
  },
  {
    path: 'sinalagi-list',
    component: SinalagiListComponent,
    canActivate: [CanActivateUser]
  },
  {
    path: 'my-car-list',
    component: MyCarListComponent,
    canActivate: [CanActivateUser]
  },
  {
    path: 'my-car-list/create-car',
    component: CreateCarComponent,
    canActivate: [CanActivateUser]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CanActivateUser,
    CanActivateAdmin,
  ]
})
export class AppRoutingModule {
}
