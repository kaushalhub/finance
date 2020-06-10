import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { environment } from '../environments/environment';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// Charts
import { NgApexchartsModule } from 'ng-apexcharts';

// Form Components 
import { FirstPartFormComponent } from './form/first-part-form/first-part-form.component';
import { SecondPartFormComponent } from './form/second-part-form/second-part-form.component';
import { ThirdPartFormComponent } from './form/third-part-form/third-part-form.component';
import { FourthPartFormComponent } from './form/fourth-part-form/fourth-part-form.component';
import { FifthPartFormComponent } from './form/fifth-part-form/fifth-part-form.component';
import { SixthPartFormComponent } from './form/sixth-part-form/sixth-part-form.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

// Services
import { GroupFormToPDFService } from './services/group-form-to-pdf.service';
import { UploadImageService } from './services/upload-image.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PaginationService } from './services/pagination.service';
import { DownloadService } from './services/download.service'

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { BillingComponent } from './dashboard/billing/billing.component';
import { BeneficiariesComponent } from './dashboard/beneficiaries/beneficiaries.component';
import { PersonalComponent } from './dashboard/personal/personal.component';
import { UsersComponent } from './dashboard/admin/users/users.component';
import { AdminOverviewComponent } from './dashboard/admin/overview/overview.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { DatePipe } from '@angular/common';
import { ScrollableDirective } from './directives/scrollable.directive';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { UploadTaskComponent } from './shared/file-upload/upload-task/upload-task.component';
import { PhotoUploadComponent } from './shared/photo-upload/photo-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstPartFormComponent,
    SecondPartFormComponent,
    ThirdPartFormComponent,
    FourthPartFormComponent,
    FifthPartFormComponent,
    SixthPartFormComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    OverviewComponent,
    BillingComponent,
    BeneficiariesComponent,
    PersonalComponent,
    UsersComponent,
    AdminOverviewComponent,
    LoaderComponent,
    ScrollableDirective,
    DropZoneDirective,
    FileUploadComponent,
    UploadTaskComponent,
    PhotoUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    Ng5SliderModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgApexchartsModule
  ],
  providers: [
    DatePipe,
    GroupFormToPDFService,
    AuthService,
    UserService, ,
    PaginationService,
    UploadImageService,
    DownloadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
