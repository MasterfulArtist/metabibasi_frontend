import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VehicleService} from "../../_services/vehicle.service";
import {StorageService} from "../../_services/storage.service";
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../_services/account.service";
import {SinalagiService} from "../../_services/sinalagi.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-vehicle-sell',
  templateUrl: './vehicle-sell.component.html',
  styleUrls: ['./vehicle-sell.component.css']
})
export class VehicleSellComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  displayedColumnsVehicleSelection: string[] = ['vehicleID', 'pinakida', 'checkcolumn'];
  isLinear = true;

  selectVehicleFormGroup!: FormGroup;
  length = 0;
  pageSize = 5;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 20];
  pageIndex = 0;
  selectionVehicle = new SelectionModel<any>(false, []);
  vehicleDataSource: any;
  allVehiclesOfUser: any
  selectDTForm!: FormGroup;
  selectBuyerForm!: FormGroup;
  buyers: any;

  renderSteps = true;

  constructor(private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private vehicleService: VehicleService,
              private storageService: StorageService,
              private accountService: AccountService,
              private sinalagiService: SinalagiService,
              private router: Router) {
  }

  ngOnInit() {
    this.selectVehicleFormGroup = this.formBuilder.group({}, {validator: this.atLeastOneCheckboxChecked()});
    this.vehicleService.getAvailableVehiclesOfSeller(this.storageService.getUser().id).subscribe(
      resp => {

        this.allVehiclesOfUser = resp;
        if (this.allVehiclesOfUser.length > 1) {
          this.renderSteps = true;
          this.length = this.allVehiclesOfUser.length;
          this.vehicleDataSource = new MatTableDataSource<any>(this.allVehiclesOfUser.slice(0, this.pageSize));
          this.allVehiclesOfUser.forEach((item: { id: number, label: string }) => {
            const vehicleControl = this.formBuilder.control(false);
            this.selectVehicleFormGroup.addControl('vehicle' + item.id.toString(), vehicleControl);
          });
        } else {
          this.renderSteps = false;
        }

      },
      error => {
        this.renderSteps = false;
        console.log(error);
      }
    );
    this.selectDTForm = this.formBuilder.group({
      dpName: ['', Validators.required],
    });

    this.selectBuyerForm = this.formBuilder.group({
      buyerControl: ['', Validators.required]
    });

    this.accountService.getAllBuyers().subscribe(
      resp => {
        this.buyers = resp;
      },
      error => {
        console.log(error);
      }
    );

  }

  atLeastOneCheckboxChecked(): any {
    return (formGroup: FormGroup) => {
      const checked = Object.values(formGroup.value).some(value => value === true);
      return checked ? null : {atLeastOneCheckboxChecked: true};
    };
  }


  toggleCover(item: any): void {

    if (this.selectionVehicle.isSelected(item)) {
      this.selectionVehicle.deselect(item);
      this.selectVehicleFormGroup.get('vehicle' + item.id.toString())?.setValue(false);
    } else {
      this.selectionVehicle.select(item);
      this.selectVehicleFormGroup.get('vehicle' + item.id.toString())?.setValue(true);
    }

  }

  vehiclePageChange(event: any, dif: string): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    if (dif === 'vehicle') {
      this.vehicleDataSource = this.allVehiclesOfUser.slice(startIndex, endIndex);
    }
  }

  onSubmit() {
    let sinalagi: any = {};
    sinalagi.seller_id = this.storageService.getUser().id;
    sinalagi.buyer_id = this.selectBuyerForm.controls['buyerControl'].value.id;
    sinalagi.oxima_id = this.selectionVehicle.selected[0]?.id;
    sinalagi.periferia = this.selectDTForm.controls['dpName'].value;

    this.sinalagiService.create(sinalagi).subscribe(
      resp => {
        this.snackBar.open('Application Created and Sent', '', {
          duration: 2000,
        });
        this.router.navigate(['sinalagi-list'])
      },
      error => {
        console.log(error);
      }
    );
  }

}
