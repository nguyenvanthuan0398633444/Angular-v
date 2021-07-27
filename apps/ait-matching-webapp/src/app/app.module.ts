import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  AitAuthGuardService,
  AitAuthScreenService,
  AitAutocompleteMasterDataModule,
  AitChipModule,
  AitDatepickerModule,
  AitInputNumberModule,
  AitLabelModule,
  AitOutputFileModule,
  AitOutputTextModule,
  AitTabsModule,
  AitTemplatePopupModule,
  AitTextareaModule,
  AitTextGradientModule,
  AitUiModule,
  rootReducers
} from '@ait/ui';
import { AitAuthModule } from '@ait/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { aureoleRootReducers } from './state/rootReducers';
import { AureoleRoutingModule } from './app-routing.module';
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UserCertificateAwardService } from './services/aureole-v/user-certificate-award.service';
import { CompanyService } from './services/aureole-v/company.service';
import { ReactionService } from './services/aureole-v/reaction.service';
import { RecommencedUserService } from './services/aureole-v/recommenced-user.service';
import { UserProfileService } from './services/aureole-v/user-profile.service';
import { UserJobQueryService } from './services/aureole-v/user-job-query.service';
import { CompanyModule } from './pages/aureole-v/company/company.module';
import { RecommencedModule } from './pages/aureole-v/recommenced/recommenced.module';
import { UserModule } from './pages/aureole-v/user/user.module';
import { LinkLogComponent } from './pages/aureole-v/sync-pe-history/link/link-log.component';
import { PopupLoggingComponent } from './pages/aureole-v/sync-pe-history/popup/popup-logging.component';
import { IconColumnComponent } from './pages/aureole-v/sync-api-config/components/icon-column.component';
import { ActionColumnComponent } from './pages/aureole-v/sync-api-config/components/action.column.component';
import { LinkAPIComponent } from './pages/aureole-v/sync-pe-history/link-api/link-api.component';
import { SyncApiConfigComponent } from './pages/aureole-v/sync-api-config/sync-api-config.component';
import { SyncPeHistoryComponent } from './pages/aureole-v/sync-pe-history/sync-pe-history.component';
import { JsonPipe } from '@angular/common';
import { SyncApiConfigService } from './services/aureole-v/sync-api-config.service';
import { SyncPeHistoryService } from './services/aureole-v/sync-pe-history.service';
import { JobModule } from './pages/aureole-v/job/job.module';
import { Router } from '@angular/router';


const AIT_UI_MODULES = [
  AitChipModule,
  AitTabsModule,
  AitOutputTextModule,
  AitLabelModule,
  AitInputNumberModule,
  AitAutocompleteMasterDataModule,
  AitTextGradientModule,
  AitOutputFileModule,
  AitDatepickerModule,
  AitTextareaModule,
  AitTemplatePopupModule
]

const AIT_UI_SERVICES = [
  AitAuthGuardService,
  AitAuthScreenService
]

const NB_UI_MODULES = [
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbButtonModule,
  NbSelectModule,
  NbInputModule
]

const AUREOLE_V_COMPONENTS = [
  LinkLogComponent,
  PopupLoggingComponent,
  IconColumnComponent,
  ActionColumnComponent,
  LinkAPIComponent
]

const PAGES = [
  SyncApiConfigComponent,
  SyncPeHistoryComponent
]


@NgModule({
  declarations: [AppComponent, ...AUREOLE_V_COMPONENTS, ...PAGES],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AureoleRoutingModule,
    Ng2SmartTableModule,
    AitUiModule.forRoot(environment),
    AitAuthModule.forRoot(environment),
    StoreModule.forRoot(
      { ...rootReducers, ...aureoleRootReducers },
      {
        initialState: {},
      }
    ),
    ...AIT_UI_MODULES,
    ...NB_UI_MODULES,
    CompanyModule,
    RecommencedModule,
    UserModule,
    JobModule
  ],
  providers: [
    ...AIT_UI_SERVICES,
    ReactionService,
    SyncApiConfigService,
    SyncPeHistoryService,
    RecommencedUserService,
    UserProfileService,
    UserCertificateAwardService,
    UserJobQueryService,
    CompanyService,
    JsonPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log(router)
  }
}
