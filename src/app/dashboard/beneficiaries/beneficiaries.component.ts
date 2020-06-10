import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Beneficiary } from 'src/app/models/beneficiary.model';
import { Options, LabelType } from 'ng5-slider';
import * as moment from 'moment';
import { DocusignService } from 'src/app/services/docusign.service';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements OnInit {
  @Input() public data: User;
  @Output() newDataOutput = new EventEmitter<User>();
  alert = '';
  showReview = false;
  isEditingFields = false;
  selectedBeneficiaryIndex: number;
  addingMoreInformation = false;
  selectedBeneficiary: Beneficiary = {
    percentage: null,
    firstName: "",
    lastName: "",
    relation: "",
    email: null,
    phone: null
  }

  beneficiaries: any;
  assignedAmount: number;
  isAddingNewOne = false;

  showDeleteReview = false;

  relations = [
    'father',
    'mother',
    'sibling',
    'friend',
    'spouse',
    'son',
    'daughter',
  ]

  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Floor:
          return '0%';
        case LabelType.Ceil:
          return '100%';
        default:
          return value + '%';
      }
    }
  };

  constructor(
    private userService: UserService,
    private docusign: DocusignService
  ) { }

  ngOnInit(): void {
    this.beneficiaries = [...this.data.beneficiaries.map(obj => ({ ...obj, confirmDelete: false }))];
    this.calculateTotalAssigned()
  }

  calculateTotalAssigned() {
    this.assignedAmount = this.beneficiaries.reduce((a, b) => a + (b['percentage'] || 0), 0);
  }

  editButtonBeneficiaryClicked(index: number) {
    const b = this.beneficiaries[index];
    if (b.phone != '' || b.email != '') this.addingMoreInformation = true;
    if (b.confirmDelete) {
      b.confirmDelete = false;
    } else {
      this.isEditingFields = true;
      this.selectedBeneficiaryIndex = index;
      this.selectedBeneficiary = b;
    }
  }

  saveEdition() {
    this.updateUser();
    this.clearSelectedBeneficiary();
    this.addingMoreInformation = false;
    this.isEditingFields = false;
    this.makeDocusign();
  }

  deleteButtonBeneficiaryClicked(index: number) {
    const b = this.beneficiaries[index];
    if (b.confirmDelete) {
      // this.deleteBeneficiary(index);
      this.selectedBeneficiaryIndex = index;
      this.showDeleteReview = true;
    } else {
      b.confirmDelete = true;
    }
  }

  cancelEdition() {
    const index = this.selectedBeneficiaryIndex;
    this.beneficiaries[index] = {
      ...this.data.beneficiaries[index],
      confirmDelete: false,
    };
    this.clearSelectedBeneficiary();
    this.isEditingFields = false;
    this.addingMoreInformation = false;
  }

  deleteReview() {
    this.showDeleteReview = true;
  }

  deleteBeneficiary(index: number) {
    this.showDeleteReview = false;
    this.beneficiaries.splice(index, 1);
    this.updateUser();
    this.clearSelectedBeneficiary();
    this.isEditingFields = false;
    this.makeDocusign();
  }

  updateUser() {
    // Remove added isEditingFields and confirmDelete from each object
    const beneficiaries = [...this.beneficiaries.map(({ confirmDelete, ...obj }) => obj)];

    const newData = {
      ...this.data,
      beneficiaries
    }
    this.userService.updateUser({ ...newData }, newData.id)
      .then(() => {
        // update saved data in dashboard
        this.newDataOutput.emit(newData);

        // Recalculate assigend
        this.calculateTotalAssigned();
      })
      .catch(err => console.log(err));
  }

  clearSelectedBeneficiary() {
    this.selectedBeneficiary = {
      percentage: null,
      firstName: "",
      lastName: "",
      relation: "",
      phone: null,
      email: null
    }
  }

  cancelAddNewOne() {
    this.clearSelectedBeneficiary();
    this.isAddingNewOne = false;
    this.addingMoreInformation = false;
  }

  saveAddNewOne() {
    this.beneficiaries.push({ ...this.selectedBeneficiary });
    this.updateUser();
    this.cancelAddNewOne();
    this.addingMoreInformation = false;
    this.makeDocusign();
  }

  review() {
    if (this.isEditingFields) {
      const b = this.beneficiaries[this.selectedBeneficiaryIndex];

      if (b.percentage < 0 || !b.percentage) {
        this.alert = 'Please make sure the percentage is greater than 0';
        return;
      }

      if (((this.assignedAmount - this.data.beneficiaries[this.selectedBeneficiaryIndex].percentage + b.percentage) > 100)) {
        this.alert = 'Please make sure the total assigned percentage is not over 100';
        return;
      }

      if (!b.firstName.trim() ||
        !b.lastName.trim() ||
        !b.relation.trim()
      ) {
        this.alert = 'Please make sure all fields are filled';
        return;
      }
    } else {
      if (this.selectedBeneficiary.percentage < 0 || !this.selectedBeneficiary.percentage) {
        this.alert = 'Please make sure the percentage is greater than 0';
        return;
      }

      if (((this.assignedAmount + this.selectedBeneficiary.percentage) > 100)) {
        this.alert = 'Please make sure the total assigned percentage is not over 100';
        return;
      }

      if (!this.selectedBeneficiary.firstName.trim() ||
        !this.selectedBeneficiary.lastName.trim() ||
        !this.selectedBeneficiary.relation.trim()
      ) {
        this.alert = 'Please make sure all fields are filled';
        return;
      }
    }
    this.showReview = true;
  }

  makeDocusign() {
    const todayDate: string = moment.utc().format();
    let beneficiariesToDocusign = this.beneficiaries;
    const header = [
      `${this.data.firstName} ${this.data.lastName}`,
      this.data.profile.email,
      this.data.policyId,
      `${this.data.firstName} ${this.data.lastName}`,
      `${this.data.firstName} ${this.data.lastName}`
    ];
    let url = this.docusign.createBeneficiaryForm(header, beneficiariesToDocusign, todayDate, this.data.profile.state);
    var win = window.open(url, '_blank');
    win.focus();
    beneficiariesToDocusign = [];
    this.showReview = false;
  }

}
