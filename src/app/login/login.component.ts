import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {StorageService} from '../_services/storage.service';
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AccountCreateComponent} from "../account-management/account-create/account-create.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {username: '', password: ''};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  login(): void {
    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigate(['home']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  register() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = window.innerWidth + 'px';
    dialogConfig.maxHeight = '90vh';
    const dialogRef = this.dialog.open(AccountCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(type => {
    });
  }
}
