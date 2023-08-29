import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {StorageService} from "../../_services/storage.service";
import {VehicleService} from "../../_services/vehicle.service";
import {ConfirmationDialogComponent} from "../../_shared/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SinalagiService} from "../../_services/sinalagi.service";
import {jsPDF} from "jspdf";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-my-car-list',
  templateUrl: './my-car-list.component.html',
  styleUrls: ['./my-car-list.component.css']
})
export class MyCarListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  myCars!: any[];
  displayedColumns: string[] = [
    'id', 'pinakida', 'discard', 'downloadAK'
  ];
  pageIndex = 0;
  pageSizeOptions = [3, 10, 20];
  showFirstLastButtons = true;
  length = 0;
  pageSize = 3;
  isSeller = false;
  currentUser: any;

  constructor(private storageService: StorageService,
              private accountService: AccountService,
              private vehicleService: VehicleService,
              private sinalagiService: SinalagiService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.isSeller = this.storageService.getUser().roles[0] === 'ROLE_POLITIS';

    this.accountService.getAccount(this.storageService.getUser().id).subscribe(
      respUser => {
        this.currentUser = respUser;

      },
      errorUser => {
        console.log(errorUser);
      }
    );


    this.vehicleService.getVehiclesOfUser(this.storageService.getUser().id).subscribe(
      respVehicle => {
        this.myCars = respVehicle;
        this.calculate_deletable_for_each_car();
        this.length = this.myCars.length;
        this.dataSource = new MatTableDataSource<any>(this.myCars.slice(0, this.pageSize));

      },
      errorvehicle => {
        console.log(errorvehicle);
      }
    );
  }

  calculate_deletable_for_each_car() {
    for (let car of this.myCars) {
      this.sinalagiService.isAlreadySinalagiForTheVehicle(car.id).subscribe(
        resp => {
          const sinalagesOfCar = resp;
          if (sinalagesOfCar.length === 0) {
            car.is_deletable = true;
          } else {
            car.is_deletable = false;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  paginatorChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource = new MatTableDataSource<any>(this.myCars.slice(startIndex, endIndex));


  }

  discard(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Do you really want to delete car "' + element.pinakida + '"?', button: 'Delete'}
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 3;
      this.vehicleService.deleteCar(element.id).subscribe(
        resp => {
          this.vehicleService.getVehiclesOfUser(this.storageService.getUser().id).subscribe(
            respVehicle => {
              this.myCars = respVehicle;
              this.calculate_deletable_for_each_car();
              this.length = this.myCars.length;
              this.dataSource = new MatTableDataSource<any>(this.myCars.slice(0, this.pageSize));
            },
            errorvehicle => {
              console.log(errorvehicle);
            }
          );
          this.snackBar.open('Car ' + element.pinakida + ' has been deleted.', '', {
            duration: 2000,
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  downloadAdeia(element: any) {
    const doc = new jsPDF();
    console.log(this.currentUser)
    const title = 'ADEIA KYKLOFORIAS';

    doc.setFontSize(20);
    doc.text(title, 10, 10);

    doc.setFontSize(12);
    doc.text('PINAKIDA KIKLOFORIAS: ' + element.pinakida, 10, 30);

    doc.setFontSize(12);
    doc.text('FIRST NAME OF OWNER: ' + this.currentUser.firstname, 10, 50);

    doc.setFontSize(12);
    doc.text('LAST NAME OF OWNER: ' + this.currentUser.lastname, 10, 70);

    doc.setFontSize(12);
    doc.text('AFM OF OWNER: ' + this.currentUser.afm, 10, 90);

    // Save the PDF
    doc.save('adeia_kikloforias.pdf');
  }

}
