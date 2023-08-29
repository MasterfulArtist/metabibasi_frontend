import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../_services/account.service";
import {StorageService} from "../../_services/storage.service";
import {MatDialogRef} from "@angular/material/dialog";

interface Roles {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit {
  title = ''
  newPassword = '';
  confirmPassword = '';
  account = {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    afm: '',
    roles: [{id: '', name: ''}]
  };

  selectedValue: string = '';

  roles: Roles[] = [];

  creable = false;

  constructor(private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private storageService: StorageService,
              private dialog: MatDialogRef<AccountCreateComponent>) {
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.title = "Create new account";
      this.roles = [
        {value: 'ROLE_ADMIN', viewValue: 'Admin'},
        {value: 'ROLE_AGORASTIS', viewValue: 'Buyer'},
        {value: 'ROLE_POLITIS', viewValue: 'Seller'}
      ];
    } else {
      this.title = "Register new account";
      this.roles = [
        {value: 'ROLE_AGORASTIS', viewValue: 'Buyer'},
        {value: 'ROLE_POLITIS', viewValue: 'Seller'}
      ];
    }
  }

  hasMinLengthError(variable: string) {
    return (variable.length < 3);
  }

  hasConfirmPasswordError() {
    return (this.newPassword !== '') && (this.confirmPassword !== '') && (this.newPassword !== this.confirmPassword);
  }

  changeLogin(value: String) {
    this.creable = false;
    if (!value) {
      return;
    }

    this.accountService.isAlreadyTaken(this.account.username).subscribe(resp => {
      if (resp.username === this.account.username) {
        this.snackBar.open('This Username is already taken.', '', {
          duration: 3000,
        });
      } else {
        this.creable = true;
      }
    }, error => {
      this.creable = true;
    });
  }

  create() {
    if (this.creable) {
      this.account.password = this.newPassword;
      this.account.roles[0].name = this.selectedValue;
      this.accountService.create(this.account).subscribe(_ => {
        if (this.storageService.isLoggedIn()) {
          this.snackBar.open('Created', '', {
            duration: 2000,
          });
          this.dialog.close();
        } else {
          this.snackBar.open('Registered', '', {
            duration: 2000,
          });
          this.dialog.close();
        }
      });
    } else {
      this.snackBar.open('You cannot create the account since this Username is already taken.', '', {
        duration: 3000,
      });
    }
  }

  isDisabled() {
    return this.selectedValue === '' || !this.creable || this.account.afm === ''
      || this.account.username === '' || this.account.firstname === ''
      || this.account.lastname === '' || ((this.newPassword === '') || (this.confirmPassword === '') ||
        (this.hasMinLengthError(this.newPassword) || this.hasMinLengthError(this.confirmPassword)) || this.hasConfirmPasswordError());
  }

}
