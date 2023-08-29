import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs";

interface Roles {
  value: string;
  viewValue: string;

}

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  account: any;
  newPassword!: string;
  confirmPassword!: string;

  selectedValue: string = '';
  roles: Roles[] = [
    {value: 'ROLE_ADMIN', viewValue: 'Admin'},
    {value: 'ROLE_AGORASTIS', viewValue: 'Buyer'},
    {value: 'ROLE_POLITIS', viewValue: 'Seller'}
  ];

  creable = true;

  constructor(private service: AccountService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        // @ts-ignore
        return this.service.getAccount(params.get('id'));
      })
    ).subscribe(resp => {
      this.account = resp;
      this.selectedValue = this.account.roles[0].name;
    });

    this.newPassword = '';
    this.confirmPassword = '';
  }


  hasMinLengthError(variable: string) {
    return (variable.length < 3);
  }

  hasConfirmPasswordError() {
    return (this.newPassword !== this.confirmPassword);
  }

  isDisabled() {
    if (!this.creable) {
      return true;
    }
    if (((this.newPassword === '') && (this.confirmPassword === ''))) {
      return false;
    } else {
      return ((this.hasMinLengthError(this.newPassword) || this.hasMinLengthError(this.confirmPassword)) || this.hasConfirmPasswordError());
    }
  }

  update() {
    this.account.password = this.newPassword;
    this.account.roles[0].name = this.selectedValue;
    // @ts-ignore
    this.service.updatePasswordAccount(this.account).subscribe(_ => {
      this.snackBar.open('Updated', '', {
        duration: 2000,
      });
    });
  }


  changeLogin(value: String) {
    this.creable = false;
    if (!value) {
      return;
    }

    this.service.isAlreadyTaken(this.account.username).subscribe(resp => {
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

}
