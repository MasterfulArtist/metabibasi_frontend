import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const VEHICLE_API = 'http://localhost:9000/api/vehicle';

@Injectable()
export class VehicleService implements OnInit {

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  getVehiclesOfUser(user_id: number): Observable<any> {
    return this.httpClient.get<any>(VEHICLE_API + '/vehicle_list/user_vehicle_list/' + user_id);
  }

  getAvailableVehiclesOfSeller(user_id: number): Observable<any> {
    return this.httpClient.get<any>(VEHICLE_API + '/vehicle_list/user_vehicle_list_available/' + user_id);
  }

  getVehicleByID(oxima_id: number): Observable<any> {
    return this.httpClient.get<any>(VEHICLE_API + '/vehicle_list/vehicle_by_id/' + oxima_id);
  }

  isAlreadyTaken(pinakida: String): Observable<any> {
    return this.httpClient.get<any>(VEHICLE_API + '/vehicle_list/vehicle/' + pinakida);
  }

  create(vehicle: any,): Observable<any> {
    return this.httpClient.post(VEHICLE_API + '/vehicle_list/create', {
      ...vehicle
    });
  }

  deleteCar(id: String): Observable<void> {
    return this.httpClient.delete<void>(VEHICLE_API + '/vehicle_list/my_vehicle/delete/' + id);
  }

}
