import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import {
  AitAutocompleteMasterDataModule,
  AitButtonModule,
  AitCardContentModule,
  AitErrorMessageModule,
  AitInputFileModule,
  AitInputNumberModule,
  AitInputTextModule,
  AitLabelModule,
  AitOutputFileModule,
  AitOutputTextModule,
  AitSpaceModule,
  AitTextareaModule,
  AitTextGradientModule,
  AitTocMenuModule,
  NB_MODULES
} from '@ait/ui';
import { NbIconModule } from '@nebular/theme';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyBasicInfoComponent } from './company-basic-info/company-basic-info.component';

@NgModule({
  declarations: [CompanyDetailComponent, CompanyBasicInfoComponent],
  imports: [
    CommonModule,
    AitOutputTextModule,
    AitCardContentModule,
    AitTextGradientModule,
    AitOutputFileModule,
    NbIconModule,
    AitInputNumberModule,
    SharedModule,
    AitLabelModule,
    AitInputFileModule,
    AitTextareaModule,
    AitSpaceModule,
    AitInputTextModule,
    AitButtonModule,
    AitErrorMessageModule,
    AitAutocompleteMasterDataModule,
    ...NB_MODULES,
    AitTocMenuModule
  ],
  exports: [CompanyDetailComponent],
  providers: [],
})
export class CompanyModule { }
