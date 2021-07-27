import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitAutoCompleteMasterComponent } from './ait-autocomplete-master.component';
import { NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitChipModule } from '../ait-chip/ait-chip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitLabelModule } from '../ait-label/ait-label.module';

@NgModule({
  declarations: [AitAutoCompleteMasterComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbEvaIconsModule,
    AitChipModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
    AitErrorMessageModule,
    AitLabelModule,
    NbTooltipModule
  ],
  exports: [AitAutoCompleteMasterComponent],
  providers: [],
})
export class AitAutocompleteMasterModule { }
