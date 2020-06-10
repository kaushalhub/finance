import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Information } from '../models/information.model';
import { AdminUser } from '../models/admin-user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users: User[];
  public data: User;
  public admin: AdminUser;
  public localStorageUser: string;

  public adminData: Information;

  tabs = ['overview', 'billing', 'beneficiaries', 'personal'];
  adminTabs = ['users', 'quoted', 'incomplete apps']
  activeTab = '';
  isLoading = true;

  constructor(
    private userService: UserService
  ) {
    this.localStorageUser = JSON.parse(window.localStorage.getItem('user'));
  }

  async ngOnInit() {
    await this.fetchData();
    this.isLoading = false;
    this.admin = await this.userService.getUserAdminByUid(this.localStorageUser);

    this.adminData = {
      newUsers: {
        type1: [10, 40, 28, 51, 42, 109, 100],
        type2: [0, 32, 45, 32, 34, 52, 41],
        dates: [
          "2020-05-19",
          "2020-05-20",
          "2020-05-21",
          "2020-05-22",
          "2020-05-23",
          "2020-05-24",
          "2020-05-25"
        ]
      }
    }
    this.activeTab = this.data.type === 2 ? this.tabs[0] : this.adminTabs[0];
  }


  async fetchData() {
    // - - - GET USER WITH UID - - - //
    this.data = await this.userService.getUserByUid(this.localStorageUser);
  }

  setActiveTab(tab): void {
    this.activeTab = tab;

  }

  updateData(newData) {
    this.data = {
      ...newData
    }
  }

}
