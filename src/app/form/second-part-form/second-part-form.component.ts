import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Options, LabelType } from 'ng5-slider';
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import quote from '../../shared/quote';
import * as moment from 'moment';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-second-part-form',
  templateUrl: './second-part-form.component.html',
  styleUrls: ['./second-part-form.component.scss']
})
export class SecondPartFormComponent implements OnInit {
  priceNumber: string;
  priceDecimal: string;
  coverageAmount: number;
  options: Options = {
    floor: 100000,
    ceil: 1000000,
    step: 25000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Floor:
          return '$100 K';
        case LabelType.Ceil:
          return '$1 M';
        default:
          return '$' + value;
      }
    }
  };
  selectedYear: number = 30;
  coverageYears = [10, 15, 20, 25, 30];
  amountClicked: boolean = false;
  priceClicked = false;
  isLoading = true;
  newUser: User;
  age = 0;

  constructor(
    private router: Router,
    private toPDF: GroupFormToPDFService,
    private userService: UserService
  ) {
    this.priceNumber = '22';
    this.priceDecimal = '50';
    this.coverageAmount = 500000;
  }

  async ngOnInit() {
    this.newUser = JSON.parse(localStorage.getItem('newUser'));
    if (!this.newUser) {
      this.router.navigate(['']);
    }
    this.calculateQuote();
  }

  get coverageAmountLabel() {
    return '$' + (this.coverageAmount < 1000000 ? (`${this.coverageAmount / 1000}K`) : ('1M'));
  }

  calculateQuote() {
    this.isLoading = true;

    const gender = this.newUser.profile.gender;
    const plan = this.newUser.profile.useNicotine === 'Yes' ? 'nicotineStandard' : 'standard';

    let bandNumber = '1';
    if (this.coverageAmount < 250000) {
      bandNumber = '1';
    } else if (this.coverageAmount < 500000) {
      bandNumber = '2';
    } else if (this.coverageAmount === 500000) {
      bandNumber = '3';
    } else if (this.coverageAmount < 1000000) {
      bandNumber = '4';
    } else {
      bandNumber = '5';
    }

    const band = `band${bandNumber}`;

    this.age = moment().diff(this.newUser.profile.dateOfBirth, 'years');
    const months = moment().diff(this.newUser.profile.dateOfBirth, 'months') % 12;
    if (months > 6) {
      this.age += 1;
    }

    if (this.age >= 70) {
      this.selectedYear = 10;
    } else if (this.age >= 65) {
      this.selectedYear = 15;
    } else if (this.age >= 60) {
      this.selectedYear = 20;
    } else if (this.age >= 55) {
      this.selectedYear = 25;
    }

    const multiplier = quote[gender][this.selectedYear][plan][band][this.age];

    if (multiplier === undefined) {
      // The age is not valid
      console.log('Invalid age');
      return;
    }

    const grossInsuranceRate = multiplier * (this.coverageAmount / 1000);
    const annualPolicyFee = parseInt(bandNumber) < 4 ? 72 : 60;
    const annualInsurancePremium = annualPolicyFee + grossInsuranceRate;

    const monthlyPremium = (annualInsurancePremium * 0.08333);

    this.priceNumber = String(Math.trunc(monthlyPremium));
    const priceDec = Math.trunc((monthlyPremium - parseInt(this.priceNumber)) * 100);
    this.priceDecimal = priceDec < 10 ? `0${String(priceDec)}` : String(priceDec);

    this.isLoading = false;
  }

  selectYear(year) {
    this.selectedYear = year;
    this.calculateQuote()
  }

  didClickAmount() {
    this.amountClicked = !this.amountClicked;
  }

  didClickPrice() {
    this.priceClicked = !this.priceClicked;
  }

  async onSubmit() {
    this.isLoading = true;
    let total = parseInt(this.priceNumber) + (parseInt(this.priceDecimal) / 100)
    const data = {
      estimatedMonthly: total,
      coverageAmount: this.coverageAmount,
      selectedYear: this.selectedYear.toString() + ' years'
    };

    this.newUser = {
      ...this.newUser,
      stepCompleted: 2,
      termLength: data.selectedYear,
      coverageAmount: data.coverageAmount,
      monthly: data.estimatedMonthly,
    };

    await this.userService.updateUser({ ...this.newUser }, this.newUser.id);
    localStorage.setItem('newUser', JSON.stringify(this.newUser));
    this.isLoading = false;

    this.toPDF.getDataFromForm(2, data);
    this.router.navigate(['/form3']);
  }

  helpClick() {

  }

}