import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService } from '@ait/ui';
import { RecommencedUserComponent } from './pages/aureole-v/recommenced/recommenced-user/recommenced-user.component';
import { CompanyDetailComponent } from './pages/aureole-v/company/company-detail/company-detail.component';
import { UserDetailComponent } from './pages/aureole-v/user/user-detail/user-detail.component';
import { RecommencedJobComponent } from './pages/aureole-v/recommenced/recommenced-job/recommenced-job.component';
import { SyncApiConfigComponent } from './pages/aureole-v/sync-api-config/sync-api-config.component';
import { SyncPeHistoryComponent } from './pages/aureole-v/sync-pe-history/sync-pe-history.component';
import { JobDetailComponent } from './pages/aureole-v/job/job-detail/job-detail.component';
import { CompanyBasicInfoComponent } from './pages/aureole-v/company/company-basic-info/company-basic-info.component';
import { JobCompanyComponent } from './pages/aureole-v/job/job-edit/job-edit.component';
import { UserInputComponent } from './pages/aureole-v/user/user-input/user-input.component';
import { TestComponent } from './pages/aureole-v/job/test/test.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'recommenced-user',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: RecommencedUserComponent
  },
  {
    path: 'recommenced-job',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: RecommencedJobComponent
  },
  {
    path: 'user/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserDetailComponent
  },
  {
    path: 'company',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: CompanyDetailComponent
  },
  {
    path: 'company-new',
    canActivate: [AitAuthGuardService],
    component: CompanyBasicInfoComponent,
  },
  // {
  //   path: 'company/:id',
  //   canActivate: [AitAuthGuardService],
  //   component: CompanyBasicInfoComponent,
  // },
  {
    path: 'job',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: JobDetailComponent
  },
  {
    path: 'job/test',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: TestComponent
  },
  {
    path: 'job/new',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: JobCompanyComponent
  },
  {
    path: 'job/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: JobCompanyComponent
  },
  {
    path: 'sync-pe-api-setting',
    canActivate: [AitAuthGuardService],
    component: SyncApiConfigComponent,
  },
  {
    path: 'sync-pe-api-history',
    canActivate: [AitAuthGuardService],
    component: SyncPeHistoryComponent,
  },
  {
    path: 'candidate/:id',
    canActivate: [AitAuthGuardService],
    component: UserInputComponent,
  },
  {
    path: 'candidate',
    canActivate: [AitAuthGuardService],
    component: UserInputComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('access_token') ? 'recommenced-user' : 'sign-in'
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AureoleRoutingModule { }
