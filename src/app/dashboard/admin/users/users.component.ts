import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MinUser } from 'src/app/models/min-user.model';
import { PaginationService } from 'src/app/services/pagination.service';
import { DownloadService } from 'src/app/services/download.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() public data;
  @Input() public usersType;
  searchQuery: string = '';
  query: string = '';
  selectedUser: User;
  editedUser: User;
  selectedIndex: number;
  files: File[] = [];
  showUserModal = false;
  isLoading = false;
  isEditingFields = false;
  userPolicy: string;
  usersPaginated: MinUser[];

  page: number = 1;

  constructor(
    private paginationService: PaginationService,
    private userService: UserService,
    private downloadService: DownloadService
  ) { }

  async ngOnInit() {
    await this.fetchUsers(0);
  }

  async fetchUsers(page: number) {
    this.isLoading = true;
    this.usersPaginated = await this.paginationService.init(this.usersType);
    this.usersPaginated = this.usersPaginated.map(u => ({
      ...u,
      startDate: u.startDate ? moment.utc(u.startDate).local().format("MM/DD/YYYY") : '',
      createdAt: u.createdAt ? moment.utc(u.createdAt).local().format("MM/DD/YYYY") : '',
    }))
    this.page += 1;
    this.isLoading = false;
  }

  _applySearch(){
    let r = this.applySearch()    
  }

  async applySearch() {
    if (this.query) {
      this.searchQuery = '';
      this.page = 1;
      this.fetchUsers(0);
    } else {
      //getUserByName
      this.isLoading = true;
      let usersFromQuery = await this.userService.getUserByName(this.searchQuery, this.usersType);
      if (usersFromQuery.length > 0) {
        this.usersPaginated = usersFromQuery;
      } else {
        //getUserByEmailMin
        let userFromQueryEmail = await this.userService.getUserByEmailMin(this.searchQuery, this.usersType);
        if (userFromQueryEmail) {
          this.usersPaginated = [];
          this.usersPaginated.push(userFromQueryEmail);
        } else {
          //getUserByPoliza
          let userFromQueryPoliza = await this.userService.getUserByPoliza(this.searchQuery, this.usersType);
          if (userFromQueryPoliza) {
            this.usersPaginated = [];
            this.usersPaginated.push(userFromQueryPoliza);
          } else {
            //getUserByZip
            let userFromQueryZip = await this.userService.getUserByZip(this.searchQuery, this.usersType);
            if (userFromQueryZip) {
              this.usersPaginated = [];
              this.usersPaginated.push(userFromQueryZip);
            } else{
              this.searchQuery = '';
              this.page = 1;
              this.fetchUsers(0);
              alert('Could not found a user');
            }
          }
        }
      }
      this.isLoading = false;
    }

    this.query = this.searchQuery;
    window.scrollTo(0, 0);
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  async selectClient(email: string, index: number) {
    this.isLoading = true;
    this.selectedUser = await this.userService.getUserByEmail(email);
    this.isLoading = false;
    this.editedUser = { ...this.selectedUser };
    this.selectedIndex = index;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
  }

  onUploadError(event) {

  }

  onUploadSuccess(event) {
    console.log(event);

  }

  convertToMin(user: User) {
    const {
      id,
      firstName,
      lastName,
      policyId,
      approvedAt,
      coverageAmount,
      startDate,
      createdAt,
    } = user;
    const {
      email,
      dateOfBirth,
      zip,
      state,
    } = user.profile;

    const min: MinUser = {
      id,
      firstName,
      lastName,
      policyId,
      approvedAt,
      email,
      dateOfBirth,
      zip,
      state,
      coverageAmount,
      startDate,
      createdAt,
    }

    return min
  }

  async saveUser() {

    this.isLoading = true;
    this.userService.updateUser({ ...this.editedUser }, this.editedUser.id)
      .then(() => {
        this.usersPaginated[this.selectedIndex] = {
          ...this.convertToMin(this.editedUser),
        }
        this.isLoading = false;
      })

    this.isEditingFields = false;
  }

  editUser() {
    if (this.isEditingFields) {
      this.editedUser = { ...this.selectedUser };
    }
    this.isEditingFields = !this.isEditingFields;
  }

  async scrollHandler(e) {
    // if (this.query != '') {
    if (this.query === '' && e === 'bottom') {
      this.isLoading = true;
      let helper: MinUser[] = await this.paginationService.more(this.usersType, this.page);
      helper = helper.map(u => ({
        ...u,
        startDate: u.startDate ? moment.utc(u.startDate).local().format("MM/DD/YYYY") : '',
        createdAt: u.createdAt ? moment.utc(u.createdAt).local().format("MM/DD/YYYY") : '',
      }))
      this.page += 1;
      this.usersPaginated = this.usersPaginated.concat(helper);
      this.isLoading = false;
    }
    // }
  }

  async approveUser() {
    this.isLoading = true;
    const approvedAt = moment.utc().format();
    const editedUser = {
      ...this.selectedUser,
      approvedAt,
    }
    this.userService.updateUser({ ...editedUser }, editedUser.id)
      .then(() => {
        this.selectedUser = { ...editedUser }
        this.usersPaginated[this.selectedIndex] = {
          ...this.usersPaginated[this.selectedIndex],
          approvedAt,
        }
        this.isLoading = false;
      })

  }

  async disapproveUser() {
    this.isLoading = true;
    const approvedAt = 'false';
    const editedUser = {
      ...this.selectedUser,
      approvedAt,
    }
    this.userService.updateUser({ ...editedUser }, editedUser.id)
      .then(() => {
        this.selectedUser = { ...editedUser }
        this.usersPaginated[this.selectedIndex] = {
          ...this.usersPaginated[this.selectedIndex],
          approvedAt,
        }
        this.isLoading = false;
      })
  }

  async exportToCsv(){
    //Firebase: Limit value in the structured query is value of 10000.
    let allUsers = await this.paginationService.init(this.usersType, 10000);
    allUsers = allUsers.map(u => ({
      ...u,
      startDate: u.startDate ? moment.utc(u.startDate).local().format("MM/DD/YYYY") : '',
      createdAt: u.createdAt ? moment.utc(u.createdAt).local().format("MM/DD/YYYY") : '',
    }))

    let enumName = {
      5: "users",
      1: "quoted",
      2: "incomplete"
    }

    this.downloadService.downloadFile(allUsers, enumName[this.usersType]+"GuavaExport")

  }


}
