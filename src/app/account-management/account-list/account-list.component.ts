import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../_services/account.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../_shared/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AccountCreateComponent} from "../account-create/account-create.component";

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {

  allAccounts: any;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'loginId', 'username', 'firstName', 'lastName', 'afm', 'role', 'discard'
  ];

  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  length = 0;
  pageSize = 10;

  usernameFilter = '';

  constructor(private accountService: AccountService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.accountService.getAccountsList().subscribe(
      resp => {
        this.allAccounts = resp.body;
        this.length = this.allAccounts.length;
        this.dataSource = new MatTableDataSource<any>(this.allAccounts.slice(0, this.pageSize));
      },
      error => {
        console.log(error);
      }
    );
  }

  paginatorChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource = this.allAccounts.slice(startIndex, endIndex);
  }

  search() {
    if (this.usernameFilter !== '') {
      this.dataSource = new MatTableDataSource<any>(this.allAccounts.filter((item: any) => item.username.toLowerCase().includes(this.usernameFilter.toLowerCase())).slice(0, this.pageSize));
      this.length = this.dataSource.data.length;
    }
    if (this.usernameFilter === '') {
      this.dataSource = new MatTableDataSource<any>(this.allAccounts.slice(0, this.pageSize));
      this.length = this.allAccounts.length;
    }

  }

  discard(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Do you really want to delete user "' + element.username + '"?', button: 'Delete'}
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        return;
      }
      this.accountService.deleteAccount(element.id).subscribe(
        resp => {
          this.accountService.getAccountsList().subscribe(
            resp => {
              this.allAccounts = resp.body;
              this.length = this.allAccounts.length;
              this.dataSource = new MatTableDataSource<any>(this.allAccounts.slice(0, this.pageSize));
            },
            error => {
              console.log(error);
            }
          );
          this.snackBar.open('User ' + element.username + ' has been deleted.', '', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  openCreateAccountDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = window.innerWidth + 'px';
    dialogConfig.maxHeight = '90vh';

    const dialogRef = this.dialog.open(AccountCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.accountService.getAccountsList().subscribe(
        resp => {
          this.allAccounts = resp.body;
          this.length = this.allAccounts.length;
          this.dataSource = new MatTableDataSource<any>(this.allAccounts.slice(0, this.pageSize));
        },
        error => {
          console.log(error);
        }
      );
    });
  }

}
