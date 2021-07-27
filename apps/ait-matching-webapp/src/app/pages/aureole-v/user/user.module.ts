import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import {
  AitAutocompleteMasterDataModule,
  AitButtonModule,
  AitCardContentModule,
  AitDatepickerModule,
  AitErrorMessageModule,
  AitInputFileModule,
  AitInputNumberModule,
  AitInputTextModule,
  AitLabelModule,
  AitMasterDataService,
  AitOutputFileModule,
  AitOutputTextModule,
  AitSpaceModule,
  AitTextareaModule,
  AitTextGradientModule,
  AitTranslatePipe,
  AitTranslationService,
  NB_MODULES,
} from '@ait/ui';
import { UserBasicInfoComponent } from './user-basic-info/user-basic-info.component';
import { UserTrainingInfoComponent } from './user-training-info/user-training-info.component';
import { UserCertificateInfoComponent } from './user-certificate-info/user-certificate-info.component';
import { UserInputComponent } from './user-input/user-input.component';

@NgModule({
  declarations: [
    UserDetailComponent,
    UserBasicInfoComponent,
    UserTrainingInfoComponent,
    UserCertificateInfoComponent,
    UserInputComponent,
  ],
  imports: [
    CommonModule,
    AitOutputTextModule,
    AitInputFileModule,
    AitOutputFileModule,
    AitCardContentModule,
    AitLabelModule,
    AitSpaceModule,
    AitDatepickerModule,
    AitInputNumberModule,
    AitTextGradientModule,
    AitTextareaModule,
    AitInputTextModule,
    AitButtonModule,
    AitErrorMessageModule,
    AitAutocompleteMasterDataModule,
    SharedModule,
    ...NB_MODULES,
  ],
  exports: [UserDetailComponent, UserBasicInfoComponent],
  providers: [AitTranslationService, AitMasterDataService, AitTranslatePipe],
})
export class UserModule {}
