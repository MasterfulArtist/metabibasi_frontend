import {Component, OnInit} from '@angular/core';
import {VehicleService} from "../../_services/vehicle.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../_services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-car',
  templateUrl: './create-car.component.html',
  styleUrls: ['./create-car.component.css']
})
export class CreateCarComponent implements OnInit {
  vehicle = {
    pinakida: '',
    user_id: 1
  };

  creable = false;

  constructor(private storageService: StorageService,
              private snackBar: MatSnackBar,
              private vehicleService: VehicleService,
              private router: Router) {
  }

  ngOnInit() {
  }

  changePinakida(value: String) {
    this.creable = false;
    if (!value) {
      return;
    }

    this.vehicleService.isAlreadyTaken(this.vehicle.pinakida).subscribe(resp => {
      if (resp?.pinakida === this.vehicle.pinakida) {
        this.snackBar.open('This pinakida is already taken.', '', {
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
      this.vehicle.user_id = this.storageService.getUser().id;
      this.vehicleService.create(this.vehicle).subscribe(_ => {
        this.snackBar.open('Created', '', {
          duration: 2000,
        });
        this.router.navigate(['my-car-list']);
      });
    } else {
      this.snackBar.open('You cannot create the account since this pinakida is already taken.', '', {
        duration: 3000,
      });
    }
  }

  isDisabled() {
    return !this.creable || this.vehicle.pinakida === '';
  }

}
