import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fourth-part-form',
  templateUrl: './fourth-part-form.component.html',
  styleUrls: ['./fourth-part-form.component.scss']
})
export class FourthPartFormComponent implements OnInit {
  complexMedical: string = "";
  filledBankcruptcy: string = "";
  newUser: User;
  alert = "";
  isLoading = false;
  userId: string;

  constructor(
    private router: Router,
    private toPDF: GroupFormToPDFService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.newUser = JSON.parse(localStorage.getItem('newUser'));
    this.userId = JSON.parse(localStorage.getItem('UserId'));
    if (!this.newUser || this.newUser.stepCompleted < 3) {
      this.router.navigate(['']);
    }
  }

  async onSubmit() {
    this.isLoading = true;
    if (!this.complexMedical ||
      !this.filledBankcruptcy) {
      this.alert = 'Please make sure all questions are answered';
      return;
    }

    const data = {
      complexMedical: this.complexMedical,
      filledBankcruptcy: this.filledBankcruptcy
    }

    this.newUser = {
      ...this.newUser,
      stepCompleted: 4,
      answers: {
        ...this.newUser.answers,
        complexMedical: this.complexMedical,
        filledBankcruptcy: this.filledBankcruptcy,
      }
    }

    await this.userService.updateUser({...this.newUser}, this.newUser.id);
    localStorage.setItem('newUser', JSON.stringify(this.newUser));
    this.isLoading = false;

    this.toPDF.getDataFromForm(4, data);
    this.router.navigate(['/form5']);
  }

  changeComplexMedical(e) {
    if (this.complexMedical === e) {
      this.complexMedical = '';
    } else {
      this.complexMedical = e;
    }
  }

  changeBankcruptcy(e) {
    if (this.filledBankcruptcy === e) {
      this.filledBankcruptcy = '';
    } else {
      this.filledBankcruptcy = e;
    }
  }

  helpClick() {
  }

  closeAlertModal() {
    this.alert = "";
  }
}
