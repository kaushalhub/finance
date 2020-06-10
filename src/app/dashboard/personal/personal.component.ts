import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { DocusignService } from 'src/app/services/docusign.service';
import * as moment from 'moment';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input() public data: User;
  @Output() newDataOutput = new EventEmitter<User>();
  @Output() uploadPhotoEvent = new EventEmitter<boolean>();

  profileImage: string;
  isEditingFields = false;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apt: string;
  zip: string;
  city: string;
  state: string;
  states: any;

  showReview = false;
  alert = '';

  editPhoto = false;
  readyToUpload = false;
  uploadNow = false;
  isNameChanged = false;
  isAdressChanged = false;

  constructor(
    private userService: UserService,
    private docusign: DocusignService
  ) { }

  ngOnInit(): void {
    this.states = this.docusign.USA_states;
    this.profileImage = this.data.profile.image || '../../../assets/images/black-profile-icon.png';
    this.resetNames(this);
    this.resetContact(this);
    this.resetAddress(this);
  }

  resetNames(self: any) {
    self.firstName = self.data.firstName;
    self.middleName = self.data.profile.middleName || '';
    self.lastName = self.data.lastName;
  }

  resetContact(self: any) {
    self.email = self.data.profile.email;
    self.phone = self.data.profile.phone;
  }

  resetAddress(self: any) {
    self.address = self.data.profile.address;
    self.apt = self.data.profile.apt;
    self.zip = self.data.profile.zip;
    self.city = self.data.profile.city;
    self.state = self.data.profile.state;
  }

  editFields() {
    this.resetNames(this);
    this.resetContact(this);
    this.resetAddress(this);

    this.isEditingFields = !this.isEditingFields;
  }

  whatsEdited() {
    if (this.firstName != this.data.firstName || this.lastName != this.data.lastName) this.isNameChanged = true;
    if (this.address != this.data.profile.address || this.apt != this.data.profile.apt || this.zip != this.data.profile.zip || this.city != this.data.profile.city || this.state != this.data.profile.state) this.isAdressChanged = true;
  }

  save() {
    const newData = {
      ...this.data,
      firstName: this.firstName,
      lastName: this.lastName,
      profile: {
        ...this.data.profile,
        middleName: this.middleName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        apt: this.apt,
        zip: this.zip,
        city: this.city,
        state: this.state,
      }
    };
    this.userService.updateUser({ ...newData }, newData.id)
      .then(() => {
        // update saved data in dashboard
        this.newDataOutput.emit(newData);
      })
      .catch(err => console.log(err));

    this.data = newData;
    this.resetNames(this);
    this.resetContact(this);
    this.resetAddress(this);
    this.showReview = false;
    this.isEditingFields = false;
  }

  review() {
    if (!this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.address.trim() ||
      !this.zip.trim() ||
      !this.city.trim() ||
      !this.state.trim()
    ) {
      this.alert = 'Please make sure all fields are filled';
      return;
    }
    this.isNameChanged = false;
    this.isAdressChanged = false;
    this.whatsEdited();
    if (this.isNameChanged || this.isAdressChanged) {
      this.showReview = true;
    } else {
      this.save();
    }
  }

  openDocusign() {
    const todayDate: string = moment.utc().format();
    let data = []
    // NAME CHANGE
    if (this.isNameChanged) {
      data = [
        `${this.data.firstName} ${this.data.lastName}`,
        this.email,
        this.data.policyId,
        `${this.data.firstName} ${this.data.lastName}`,
        `${this.data.firstName} ${this.data.lastName}`,
        `x`,
        `Insured`,
        `${this.data.firstName} ${this.data.lastName}`,
        `${this.firstName} ${this.lastName}`,
        ``,
        ``,
        ``,
        ``,
        todayDate,
        todayDate
      ];
    }
    // ADDRESS CHANGE 
    if (this.isAdressChanged) {
      data = [
        `${this.data.firstName} ${this.data.lastName}`,
        this.email,
        this.data.policyId,
        `${this.data.firstName} ${this.data.lastName}`,
        `${this.data.firstName} ${this.data.lastName}`,
        ``,
        ``,
        ``,
        ``,
        `x`,
        `x`,
        `${this.address} ${this.apt} ${this.zip} ${this.city} ${this.state}`,
        `${this.phone}`,
        todayDate,
        todayDate
      ];
    }
    if (this.isNameChanged && this.isAdressChanged) {
      data = [
        `${this.data.firstName} ${this.data.lastName}`,
        this.email,
        this.data.policyId,
        `${this.data.firstName} ${this.data.lastName}`,
        `${this.data.firstName} ${this.data.lastName}`,
        `x`,
        `Insured`,
        `${this.data.firstName} ${this.data.lastName}`,
        `${this.firstName} ${this.lastName}`,
        `x`,
        `x`,
        `${this.address} ${this.apt} ${this.zip} ${this.city} ${this.state}`,
        `${this.phone}`,
        todayDate,
        todayDate
      ];
    }

    let url = this.docusign.createChangesForm(data, this.state);
    var win = window.open(url, '_blank');
    win.focus();

    this.save();
  }

  openEditPicModal() {
    if (this.editPhoto) {
      this.editPhoto = false
      this.readyToUpload = false;
      this.uploadNow = false;
    } else {
      this.editPhoto = true;
    }
  }

  savePhoto() {
    if (this.readyToUpload) this.uploadNow = true;
  }

  getInfoFromUploadPhoto(event) {
    if (event.class === 'imageOn') {
      this.readyToUpload = event.variable;
    } else if (event.class === 'finishedLoading') {
      this.editPhoto = event.variable;
      this.readyToUpload = false;
      this.uploadNow = false;
      this.profileImage = event.newImageUrl;
    }
  }

  closeAlertModal() {
    this.alert = '';
  }

}
