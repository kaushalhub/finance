import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  emailForgot: string;
  password: string;
  mobile = false;
  showForgotModal = false;
  recoverySent = false;
  alert = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (window.screen.width <= 600) {
      this.mobile = true;
    }
  }

  async onSubmit() {
    this.authService.signIn(this.email, this.password, (result) => {
      this.alert = result;
    });
  }

  async forgotPassword() {
    this.showForgotModal = true;
  }

  async signUp() {
    this.router.navigate(['/signup']);
  }

  async recoverPassword() {
    await this.authService.sendEmailResetPassword(this.emailForgot, (result) => {
      this.alert = result;
    });
    this.recoverySent = true;
  }

  closeForgotModal() {
    this.recoverySent = false;
    this.showForgotModal = false;
  }

  closeAlertModal() {
    this.alert = '';
  }

}