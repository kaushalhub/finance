import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { DocusignService } from 'src/app/services/docusign.service';
import * as moment from 'moment';

@Component({
  selector: 'app-fifth-part-form',
  templateUrl: './fifth-part-form.component.html',
  styleUrls: ['./fifth-part-form.component.scss']
})
export class FifthPartFormComponent implements OnInit {
  isLoading = false;
  showReview = false;
  alert = "";
  newUser: User;
  userId: string;
  states: any;

  data = {
    accountOwnerSame: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    apt: '',
    zipCode: '',
    city: '',
    state: 'STATE',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: '',
  };

  constructor(
    private router: Router,
    private toPDF: GroupFormToPDFService,
    private userService: UserService,
    private docusign: DocusignService
  ) { }

  ngOnInit(): void {
    this.states = this.docusign.USA_states;
    this.newUser = JSON.parse(localStorage.getItem('newUser'));
    this.userId = JSON.parse(localStorage.getItem('UserId'));
    if (!this.newUser || this.newUser.stepCompleted < 4) {
      this.router.navigate(['']);
    }
  }

  async onSubmit() {
    this.isLoading = true;

    this.newUser = {
      ...this.newUser,
      stepCompleted: 5,
      profile: {
        ...this.newUser.profile,
        middleName: this.data.middleName,
        address: this.data.address,
        apt: this.data.apt,
        zip: this.data.zipCode,
        city: this.data.city,
        state: this.data.state,
      },
      answers: {
        ...this.newUser.answers,
        accountOwnerSame: this.data.accountOwnerSame,
      },
      billingInfo: {
        bankName: this.data.bankName,
        routingNumber: this.data.routingNumber,
        accountNumber: this.data.accountNumber,
        accountNumberEnding: this.data.accountNumber.substr(this.data.accountNumber.length - 4),
        accountType: this.data.accountType,
      },
    };

    // Docusign
    const todayDate: string = moment.utc().format();
    let accountOwnerFullName = this.data.middleName != '' ? `${this.data.firstName} ${this.data.middleName} ${this.data.lastName}` : `${this.data.firstName} ${this.data.lastName}`;
    let data = [
      `${this.newUser.firstName} ${this.newUser.lastName}`,
      this.newUser.profile.email,
      `${this.newUser.firstName} ${this.newUser.lastName}`,
      `Monthly`,
      accountOwnerFullName,
      `${this.data.address} ${this.data.apt}`,
      `${this.data.city} ${this.data.state} ${this.data.zipCode}`,
      this.data.bankName,
      this.data.routingNumber,
      this.data.accountNumber,
      this.data.accountType,
      todayDate,
      todayDate
    ];
    let url = this.docusign.createPaymentsForm(data, this.data.state);
    var win = window.open(url, '_blank');
    win.focus();

    // Update User
    await this.userService.updateUser({ ...this.newUser }, this.newUser.id);
    localStorage.setItem('newUser', JSON.stringify(this.newUser));
    this.isLoading = false;

    // Update Info for PDF
    this.toPDF.getDataFromForm(5, this.data);
    this.router.navigate(['/form6']);
  }

  changeAccountOwnerSame(e) {
    if (this.data.accountOwnerSame === e) {
      this.data.accountOwnerSame = '';
    } else {
      this.data.accountOwnerSame = e;
      if (this.data.accountOwnerSame === 'Yes') {
        this.data.firstName = this.newUser.firstName;
        this.data.lastName = this.newUser.lastName;
        this.data.email = this.newUser.profile.email;
        this.data.phone = this.newUser.profile.phone;
        this.data.state = this.newUser.profile.state;
      } else {
        this.data.firstName = '';
        this.data.lastName = '';
        this.data.email = '';
        this.data.phone = '';
        this.data.state = '';
      }
    }
  }

  changeAccountType(e) {
    if (this.data.accountType === e) {
      this.data.accountType = '';
    } else {
      this.data.accountType = e;
    }
  }

  helpClick() {

  }


  closeAlertModal() {
    this.alert = "";
  }

  review() {
    let error = false;

    const keys = Object.keys(this.data);

    for (const key of keys) {
      if (key === 'apt' || key === 'middleName') {
        continue;
      }

      const v = this.data[key];

      if (!String(v).trim()) {
        error = true;
        break;
      }
    }

    if (error) {
      this.alert = 'Please make sure all fields are filled';
      return;
    }

    this.showReview = true;

  }

  showRoutingExp() {
    this.alert = "You will find this number in your bank account";
  }

  showAccountExp() {
    this.alert = "You will find this number in your bank account";
  }

}
