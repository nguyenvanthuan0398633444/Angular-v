import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AitAutocompleteMasterDataModule,
  AitAutocompleteMasterModule,
  AitButtonGroupModule,
  AitButtonModule,
  AitCardContentModule,
  AitDatepickerModule,
  AitErrorMessageModule,
  // AitInputFileModule,
  AitInputNumberModule,
  AitInputTextModule,
  AitLabelModule,
  AitOutputFileModule,
  AitOutputTextModule,
  AitSpaceModule,
  AitTextareaModule,
  AitTextGradientModule,
  AitTimePickerModule,
  AitTocMenuModule
} from '@ait/ui';
import { NbCheckboxModule, NbIconModule, NbRadioModule, NbSpinnerModule } from '@nebular/theme';
import { SharedModule } from '../../../shared/shared.module';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobCompanyComponent } from './job-edit/job-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [JobDetailComponent, JobCompanyComponent, TestComponent],
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
    AitTextareaModule,
    NbCheckboxModule,
    AitErrorMessageModule,
    AitAutocompleteMasterDataModule,
    AitAutocompleteMasterModule,
    AitButtonModule,
    AitSpaceModule,
    NbRadioModule,
    FormsModule,
    ReactiveFormsModule,
    AitTimePickerModule,
    AitInputTextModule,
    NbSpinnerModule,
    AitDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    AitButtonGroupModule,
    AitTocMenuModule
    // AitInputFileModule
  ],
  exports: [JobDetailComponent, JobCompanyComponent],
  providers: [],
})
export class JobModule { }
