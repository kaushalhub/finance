import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { User } from 'src/app/models/user.model';
import { DocusignService } from 'src/app/services/docusign.service';
import { CATCH_STACK_VAR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-first-part-form',
  templateUrl: './first-part-form.component.html',
  styleUrls: ['./first-part-form.component.scss']
})
export class FirstPartFormComponent implements OnInit {
  alert = "";
  isLoading = false;

  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  gender: string = "";
  height: string = "";
  weight: number;
  social: string;

  monthBirth: number;
  dayBirth: number;
  yearBirth: number;

  useNicotine: string = "";
  state: string = "";

  userExist: User;

  states: any;
  heights = [
    '4\'8\"',
    '4\'9\"',
    '4\'10\"',
    '4\'11\"',
    '5\'0\"',
    '5\'1\"',
    '5\'2\"',
    '5\'3\"',
    '5\'4\"',
    '5\'5\"',
    '5\'6\"',
    '5\'7\"',
    '5\'8\"',
    '5\'9\"',
    '5\'10\"',
    '5\'11\"',
    '6\'0\"',
    '6\'1\"',
    '6\'2\"',
    '6\'3\"',
    '6\'4\"',
    '6\'5\"',
    '6\'6\"',
    '6\'7\"',
    '6\'8\"',
    '6\'9\"',
    '6\'10\"',
    '6\'11\"',
  ];

  nicotineOptions = [
    {
      value: '',
      name: 'I use Tobacco/Nicotine products',
    },
    {
      value: 'Yes',
      name: 'Yes',
    },
    {
      value: 'No',
      name: 'No',
    },
  ]

  constructor(
    private router: Router,
    private userService: UserService,
    private toPDF: GroupFormToPDFService,
    private docusign: DocusignService
  ) { }

  ngOnInit(): void {
    this.states = this.docusign.USA_states;
    this.userExist = JSON.parse(localStorage.getItem('newUser'));
    if (this.userExist) {
      this.firstName = this.userExist.firstName;
      this.lastName = this.userExist.lastName;
      this.email = this.userExist.profile.email;
      this.phone = this.userExist.profile.phone;
      this.gender = this.userExist.profile.gender;
      this.height = this.userExist.profile.height;
      this.weight = this.userExist.profile.weight;
      let undoDate = this.unTransformDate(this.userExist.profile.dateOfBirth)
      this.monthBirth = Number(undoDate[0]);
      this.dayBirth = Number(undoDate[1]);
      this.yearBirth = Number(undoDate[2]);
      this.state = this.userExist.profile.state;
      this.useNicotine = this.userExist.profile.useNicotine;
    } else {
      this.state = this.states[0].name;
      this.useNicotine = this.nicotineOptions[0].value;
    }
  }

  unTransformDate(dateReceived: string) {
    return dateReceived.split("/");
  }

  changeGender(gender) {
    this.gender = gender;
  }

  transformDate() {
    return this.addZero(this.monthBirth) + '/' + this.addZero(this.dayBirth) + '/' + this.yearBirth
  }

  addZero(number) {
    return number.toString().length === 1 ? '0' + number.toString() : number.toString();
  }

  validateDate(e, part: string) {
    switch (part) {
      case 'month':
        return Number(e.target.value + e.key) > 12 ? false : true;
      case 'day':
        return Number(e.target.value + e.key) > 31 ? false : true;
      case 'year':
        return Number(e.target.value + e.key) > 2020 ? false : true;
      default:
        break;
    }
  }

  async onSubmit() {
    this.isLoading = true;

    if (!this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.gender.trim() ||
      !this.height.trim() ||
      !String(this.weight).trim() ||
      !this.social.trim()||
      !this.useNicotine.trim() ||
      !this.state.trim() ||
      !String(this.monthBirth).trim() ||
      !String(this.dayBirth).trim() ||
      !String(this.yearBirth).trim()) {
      this.alert = 'Please make sure all fields are filled';
      return;
    }

    const user = await this.userService.getUserByEmail(this.email)
    if (user) {
      // The user has previsouly filled the form with the same email send to the correcponding step
      // this.alert = 'This email has already filled an application';
      if (user.stepCompleted > 4) {
        this.router.navigate(['/signup']);
        return;
      }
      localStorage.setItem('newUser', JSON.stringify(user));
      this.isLoading = false;

      const {
        firstName,
        lastName,
        email,
        phone,
        gender,
        height,
        weight,
        social,
        useNicotine,
        state,
      } = this;

      const data = {
        firstName,
        lastName,
        email,
        phone,
        gender,
        height,
        weight,
        social,
        dateOfBirth: this.transformDate(),
        useNicotine,
        state,
      };

      this.toPDF.getDataFromForm(1, data);
      // this.router.navigate([`/form${user.stepCompleted + 1}`]);
      this.router.navigate([`/form2`]);
      return;
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      height,
      weight,
      social,
      useNicotine,
      state,
    } = this;

    const data = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      height,
      weight,
      social,
      dateOfBirth: this.transformDate(),
      useNicotine,
      state,
    };

    let age = moment().diff(data.dateOfBirth, 'years');
    const months = moment().diff(data.dateOfBirth, 'months') % 12;
    if (months > 6) {
      age += 1;
    }

    if (age > 74 || (age > 70 && data.useNicotine === 'Yes')) {
      this.alert = "Sorry! We currently only have plans for your age";
      return;
    }

    const todayDate: string = moment.utc().format();
    const newUser: User = {
      id: null,
      uid: null,
      type: 2,
      createdAt: todayDate,
      approvedAt: null,
      firstName,
      lastName,
      policyId: null,
      stepCompleted: 1,
      profile: {
        middleName: '',
        email,
        phone,
        gender,
        height,
        weight,
        dateOfBirth: data.dateOfBirth,
        useNicotine: data.useNicotine,
        address: '',
        apt: '',
        zip: '',
        city: '',
        state: data.state,
        image: '',
      },
      answers: {
        declinedLifeInsurance: '',
        criminalHistory: '',
        currentlyDisabled: '',
        groupLifeInsurance: '',
        complexMedical: '',
        filledBankcruptcy: '',
        accountOwnerSame: '',
      },
      termLength: '',
      coverageAmount: 0,
      monthly: 0,
      startDate: '',
      nextPaymentDate: '',
      beneficiaries: [],
      billingInfo: {
        bankName: '',
        routingNumber: '',
        accountNumber: '',
        accountNumberEnding: '',
        accountType: '',
      },
      documents: [],
      payments: []
    }

    const userId = await this.userService.createUser(newUser);

    newUser.id = userId;
    localStorage.setItem('UserId', JSON.stringify(userId));
    localStorage.setItem('newUser', JSON.stringify(newUser));
    this.isLoading = false;

    this.toPDF.getDataFromForm(1, data);
    this.router.navigate(['/form2']);
  }

  helpClick() {

  }

  closeAlertModal() {
    this.alert = '';
    this.isLoading = false;
  }
}
