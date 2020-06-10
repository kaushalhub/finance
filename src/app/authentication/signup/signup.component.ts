import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Email from './../../../assets/scripts/smtp.js'; //file path may change →

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  mobile = false;
  isLoading = false;
  alert = '';
  file = './../../../assets/emails/welcome.html';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (window.screen.width <= 600) {
      this.mobile = true;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    let userFromEmail = await this.userService.getUserByEmail(this.email);
    if (userFromEmail) {
      if (userFromEmail.type === 1) {
        let userAdminFromEmail = await this.userService.getUserAdminByEmail(this.email);
        let newUid = await this.authService.signUp(this.email, this.password, (result: string) => {
          this.alert = result;
        });
        if (newUid) {
          userAdminFromEmail.uid = newUid;
          const body = await this.readTextFile(this.file);
          await this.sendEmail(this.email, body);
          this.userService.updateUserAdmin(userAdminFromEmail, userFromEmail.id).catch(err => {
            console.log(err);
          });
        }
      } else {
        let newUid = await this.authService.signUp(this.email, this.password, (result) => {
          this.alert = result;
        });
        if (newUid) {
          userFromEmail.uid = newUid;
          userFromEmail.type = 2;
          const body = await this.readTextFile(this.file);
          await this.sendEmail(this.email, body);
          this.userService.updateUser(userFromEmail, userFromEmail.id).catch(err => {
            console.log(err);
          });
        }
      }
    } else {
      this.alert = 'You havent made an application with this email';
      this.isLoading = false;
    }
  }

  closeAlertModal() {
    this.alert = '';
  }

  async readTextFile(file: string) {
    let returnHTML: string;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          returnHTML = rawFile.responseText;
        }
      }
    }
    rawFile.send(null);
    return returnHTML;
  }

  async sendEmail(email: string, body: string) {
    await Email.send({
      Host: 'smtp.elasticemail.com',
      Username: '', // Add SMTP username
      Password: '', // Add SMTP password
      To: email,
      From: '',     // Add SMTP mail
      Subject: 'Welcome to Guava',
      Body: body
    })
      .then((message: string) => {
        console.log(message);
        this.isLoading = false;
        this.alert = `Welcome to Guava`;
      });
  }

}
