import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitAutoCompleteMasterDataComponent } from './ait-autocomplete-master-data.component';
import { NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitLabelModule } from '../ait-label/ait-label.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AitAutoCompleteMasterDataComponent],
  imports: [
    CommonModule,
    NbInputModule,
    NbCheckboxModule,
    NbTooltipModule,
    NbIconModule,
    AitErrorMessageModule,
    AitLabelModule,
    FormsModule,
    ReactiveFormsModule],
  exports: [AitAutoCompleteMasterDataComponent],
  providers: [],
})
export class AitAutocompleteMasterDataModule { }
