import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {StorageService} from "../_services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userToken!: any;

  constructor(private auth: AuthService,
              private router: Router,
              private storageService: StorageService) {

  }

  ngOnInit() {
    // apokodikopoisi toy user token pou einai stored sto localstorage
    this.userToken = this.storageService.getUser();
  }


  logout(): void {
    this.auth.logout().subscribe({
      next: res => {
        this.storageService.clean();
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
