import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { DocusignService } from 'src/app/services/docusign.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  @Input() public data: User;
  @Output() newDataOutput = new EventEmitter<User>();

  isEditingFields = false;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  paymentfrequency: string = 'Monthly';
  showReview = false;
  constructor(
    private userService: UserService,
    private docusign: DocusignService
  ) { }

  ngOnInit(): void {
    const { bankName, routingNumber, accountNumber, accountType } = this.data.billingInfo;
    this.bankName = bankName;
    this.routingNumber = routingNumber;
    this.accountNumber = accountNumber;
    this.accountType = accountType;
  }

  editFields() {
    if (this.isEditingFields) {
      const { bankName, routingNumber, accountNumber, accountType } = this.data.billingInfo;
      this.bankName = bankName;
      this.routingNumber = routingNumber;
      this.accountNumber = accountNumber;
      this.accountType = accountType;
    }
    this.isEditingFields = !this.isEditingFields;
  }

  save() {
    if (!this.bankName.trim() ||
      !this.routingNumber.trim() ||
      !this.accountNumber.trim() ||
      !this.accountType.trim()
    ) {
      alert('Please make sure all fields are filled');
      return;
    }
    const newData = {
      ...this.data,
      billingInfo: {
        ...this.data.billingInfo,
        bankName: this.bankName,
        routingNumber: this.routingNumber,
        accountNumber: this.accountNumber,
        accountNumberEnding: this.accountNumber.substr(this.accountNumber.length - 4),
        accountType: this.accountType,
      }
    }
    this.userService.updateUser({ ...newData }, newData.id)
      .then(() => {
        // update saved data in dashboard
        this.newDataOutput.emit(newData);
        this.makeDocusign(newData);
      })
      .catch(err => console.log(err));
    this.isEditingFields = false;
  }

  changeAccountType(e) {
    if (!this.isEditingFields) {
      return;
    }
    this.accountType = e;
  }

  makeDocusign(dataUser: User) {
    // Docusign
    const todayDate: string = moment.utc().format();
    let docusignInfo = [
      `${dataUser.firstName} ${dataUser.profile.middleName} ${dataUser.lastName}`,
      dataUser.profile.email,
      `${dataUser.firstName} ${dataUser.profile.middleName} ${dataUser.lastName}`,
      this.paymentfrequency,
      `${dataUser.firstName} ${dataUser.profile.middleName} ${dataUser.lastName}`,
      `${dataUser.profile.address} ${dataUser.profile.apt}`,
      `${dataUser.profile.city} ${dataUser.profile.state} ${dataUser.profile.zip}`,
      dataUser.billingInfo.bankName,
      dataUser.billingInfo.routingNumber,
      dataUser.billingInfo.accountNumber,
      dataUser.billingInfo.accountType,
      todayDate,
      todayDate
    ];
    let url = this.docusign.createPaymentsForm(docusignInfo, dataUser.profile.state);
    var win = window.open(url, '_blank');
    win.focus();
    this.showReview = false;
  }

  closeAlertModal() {
    this.showReview = false;
  }

}
