import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SinalagiService} from "../../_services/sinalagi.service";
import {StorageService} from "../../_services/storage.service";
import {AccountService} from "../../_services/account.service";
import {VehicleService} from "../../_services/vehicle.service";
import {ConfirmationDialogComponent} from "../../_shared/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-sinalagi-list',
  templateUrl: './sinalagi-list.component.html',
  styleUrls: ['./sinalagi-list.component.css']
})
export class SinalagiListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();

  sinalages!: any;

  displayedColumns: string[] = [];
  pageIndex = 0;
  pageSizeOptions = [3, 10, 20];
  showFirstLastButtons = true;
  length = 0;
  pageSize = 3;

  isSeller!: boolean;

  constructor(private sinalagiService: SinalagiService,
              private storageService: StorageService,
              private vehicleService: VehicleService,
              private accountService: AccountService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.isSeller = this.storageService.getUser().roles[0] === 'ROLE_POLITIS';
    if (this.isSeller) {
      this.displayedColumns = [
        'sinalagiId', 'pinakida', 'buyerinfo', 'dpName', 'status', 'discard', 'historyRemove'
      ];
      this.loadSellerDatasource();
    } else {
      this.displayedColumns = [
        'sinalagiId', 'pinakida', 'sellerinfo', 'dpName', 'status', 'discard', 'accept', 'historyRemove'
      ];
      this.loadBuyerDatasource();
    }
  }

  loadSellerDatasource() {
    this.sinalagiService.getSinalagesOfSeller(this.storageService.getUser().id).subscribe(resp => {
      this.sinalages = resp;
      for (let sinalagi of this.sinalages) {
        this.accountService.getAccount(sinalagi.buyer_id).subscribe(
          resp => {
            sinalagi.buyer_username = resp.username;
            sinalagi.buyer_afm = resp.afm;
            this.vehicleService.getVehicleByID(sinalagi.oxima_id).subscribe(
              respVehicle => {
                sinalagi.oxima_pinakida = respVehicle.pinakida;
              },
              errorvehicle => {
                console.log(errorvehicle);
              }
            );
          },
          error => {
            console.log(error);
          }
        );
      }
      this.length = this.sinalages.length;
      this.dataSource = new MatTableDataSource<any>(this.sinalages.slice(0, this.pageSize));
    }, error => {
      console.log(error);
    });
  }

  loadBuyerDatasource() {
    this.sinalagiService.getSinalagesOfBuyer(this.storageService.getUser().id).subscribe(resp => {
      this.sinalages = resp;
      for (let sinalagi of this.sinalages) {
        this.accountService.getAccount(sinalagi.buyer_id).subscribe(
          resp => {
            sinalagi.seller_username = resp.username;
            sinalagi.seller_afm = resp.afm;
            this.vehicleService.getVehicleByID(sinalagi.oxima_id).subscribe(
              respVehicle => {
                sinalagi.oxima_pinakida = respVehicle.pinakida;
              },
              errorvehicle => {
                console.log(errorvehicle);
              }
            );
          },
          error => {
            console.log(error);
          }
        );
      }
      this.length = this.sinalages.length;
      this.dataSource = new MatTableDataSource<any>(this.sinalages.slice(0, this.pageSize));
    }, error => {
      console.log(error);
    });
  }

  paginatorChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource = this.sinalages.slice(startIndex, endIndex);
  }

  discard(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Do you really want to cancel the application?', button: 'Delete'}
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        return;
      }
      this.sinalagiService.deleteApplication(element.id).subscribe(
        resp => {
          this.loadSellerDatasource();
          this.snackBar.open('The application has been cancelled.', '', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  accept(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Do you really want to accept the application?', button: 'Accept'}
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        return;
      }
      this.sinalagiService.updateSinalagi(element).subscribe(
        resp => {
          this.loadBuyerDatasource();
          this.snackBar.open('The application has been accepted. You own the car ' + element.oxima_pinakida, '', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }


  removeFromHistory(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Do you really want to remove the application from history?', button: 'Remove'}
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        return;
      }
      this.sinalagiService.deleteApplication(element.id).subscribe(
        resp => {
          this.loadSellerDatasource();
          this.snackBar.open('The application has been removed.', '', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

}
