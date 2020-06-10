import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  status = true;
  landingUrl = 'http://mousaicoding.tech/';
  @Input() public isLoggedIn: boolean = false;
  @Input() public menuForm: boolean;
  @Input() public backRoute: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openNavbar() {
    this.status = !this.status;
  }

  goToLogIn() {
    this.router.navigate(['/login']);
  }

  openlanding() {
    window.location.href = this.landingUrl;
  }

  async logOut() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

}
