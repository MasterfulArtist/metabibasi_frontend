import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
const SINALAGI_API = 'http://localhost:9000/api/sinalagi';
@Injectable()
export class SinalagiService implements OnInit {

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  create(sinalagi: any,): Observable<any> {
    return this.httpClient.post(SINALAGI_API+'/sinalagi_list/create', {
      ...sinalagi
    });
  }

  getSinalagesOfSeller(user_id: number): Observable<any> {
    return this.httpClient.get<any>(SINALAGI_API+'/sinalagi_list/sinalagi/seller/' + user_id);
  }

  getSinalagesOfBuyer(user_id: number): Observable<any> {
    return this.httpClient.get<any>(SINALAGI_API+'/sinalagi_list/sinalagi/buyer/' + user_id);
  }

  deleteApplication(app_id: String): Observable<void> {
    return this.httpClient.delete<void>(SINALAGI_API+'/sinalagi_list/delete/' + app_id);
  }

  updateSinalagi(sinalagi: any): Observable<any> {
    return this.httpClient.post(SINALAGI_API+'/sinalagi_list/update', {
      ...sinalagi
    });
  }

  isAlreadySinalagiForTheVehicle(oxima_id: String): Observable<any> {
    return this.httpClient.get<any>(SINALAGI_API+'/sinalagi_list/sinalagi_exists/' + oxima_id);
  }

}
