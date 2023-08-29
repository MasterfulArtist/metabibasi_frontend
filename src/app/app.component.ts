import {Component} from '@angular/core';
import {StorageService} from './_services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Metabibasi';

  constructor(
    private storageService: StorageService
  ) {
  }


  isAuthenticated() {
    return this.storageService.isLoggedIn();
  }
}
