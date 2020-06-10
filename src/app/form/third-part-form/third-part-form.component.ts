import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-third-part-form',
  templateUrl: './third-part-form.component.html',
  styleUrls: ['./third-part-form.component.scss']
})
export class ThirdPartFormComponent implements OnInit {
  alert = "";
  isLoading = false;
  declinedLifeInsurance: string = "";
  criminalHistory: string = "";
  currentlyDisabled: string = "";
  groupLifeInsurance: string = "";
  newUser: User;
  userId: string;

  constructor(
    private router: Router,
    private toPDF: GroupFormToPDFService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.newUser = JSON.parse(localStorage.getItem('newUser'));
    this.userId = JSON.parse(localStorage.getItem('UserId'));
    if (!this.newUser || this.newUser.stepCompleted < 2) {
      this.router.navigate(['']);
    }
  }

  async onSubmit() {
    this.isLoading = true;
    if (!this.declinedLifeInsurance ||
      !this.criminalHistory ||
      !this.currentlyDisabled ||
      !this.groupLifeInsurance) {
      this.alert = 'Please make sure all questions are answered';
      return;
    }

    const data = {
      declinedLifeInsurance: this.declinedLifeInsurance,
      criminalHistory: this.criminalHistory,
      currentlyDisabled: this.currentlyDisabled,
      groupLifeInsurance: this.groupLifeInsurance
    }

    this.newUser = {
      ...this.newUser,
      stepCompleted: 3,
      answers: {
        ...this.newUser.answers,
        declinedLifeInsurance: this.declinedLifeInsurance,
        criminalHistory: this.criminalHistory,
        currentlyDisabled: this.currentlyDisabled,
        groupLifeInsurance: this.groupLifeInsurance,
      }
    }

    await this.userService.updateUser({...this.newUser}, this.newUser.id);
    localStorage.setItem('newUser', JSON.stringify(this.newUser));
    this.isLoading = false;

    this.toPDF.getDataFromForm(3, data);
    this.router.navigate(['/form4']);
  }

  changeDeclinedLifeInsurance(e) {
    if (this.declinedLifeInsurance === e) {
      this.declinedLifeInsurance = '';
    } else {
      this.declinedLifeInsurance = e;
    }
  }

  changeCriminalHistory(e) {
    if (this.criminalHistory === e) {
      this.criminalHistory = '';
    } else {
      this.criminalHistory = e;
    }
  }

  changeCurrentlyDisabled(e) {
    if (this.currentlyDisabled === e) {
      this.currentlyDisabled = '';
    } else {
      this.currentlyDisabled = e;
    }
  }

  changeGroupLifeInsurance(e) {
    if (this.groupLifeInsurance === e) {
      this.groupLifeInsurance = '';
    } else {
      this.groupLifeInsurance = e;
    }
  }

  helpClick() {
  }

  closeAlertModal() {
    this.alert = "";
  }
}
