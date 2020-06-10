import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstPartFormComponent } from './form/first-part-form/first-part-form.component';
import { SecondPartFormComponent } from './form/second-part-form/second-part-form.component';
import { ThirdPartFormComponent } from './form/third-part-form/third-part-form.component';
import { FourthPartFormComponent } from './form/fourth-part-form/fourth-part-form.component';
import { FifthPartFormComponent } from './form/fifth-part-form/fifth-part-form.component';
import { SixthPartFormComponent } from './form/sixth-part-form/sixth-part-form.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { SecureInnerPagesGuard } from './guards/secure-inner-pages.guard';

var formPath = 'form';

const routes: Routes = [
  { path: '', component: FirstPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: formPath + '2', component: SecondPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: formPath + '3', component: ThirdPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: formPath + '4', component: FourthPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: formPath + '5', component: FifthPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: formPath + '6', component: SixthPartFormComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'login', component: LoginComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
