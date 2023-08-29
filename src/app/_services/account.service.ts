import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const ACCOUNT_API = 'http://localhost:9000/api/account';

@Injectable()
export class AccountService implements OnInit {

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  getAccountsList(): Observable<any> {
    return this.httpClient.get<any>(ACCOUNT_API + '/accounts_list', {observe: 'response'});
  }

  getAccount(user_id: String): Observable<any> {
    return this.httpClient.get<any>(ACCOUNT_API + '/accounts_list/account/' + user_id);
  }

  updatePasswordAccount(account: any): Observable<any> {
    return this.httpClient.post(ACCOUNT_API + '/accounts_list/update', {
      ...account
    });
  }

  create(account: any,): Observable<any> {
    return this.httpClient.post(ACCOUNT_API + '/accounts_list/create', {
      ...account
    });
  }

  isAlreadyTaken(username: String): Observable<any> {
    return this.httpClient.get<any>(ACCOUNT_API + '/accounts_list/find_user/' + username);
  }

  deleteAccount(loginId: String): Observable<void> {
    return this.httpClient.delete<void>(ACCOUNT_API + '/accounts_list/delete/' + loginId);
  }

  getAllBuyers(): Observable<any> {
    return this.httpClient.get<any>(ACCOUNT_API + '/accounts_list/buyers');
  }


}
