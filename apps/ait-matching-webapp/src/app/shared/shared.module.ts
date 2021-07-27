import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AitTranslationService } from '@ait/ui';

@NgModule({
  declarations: [TranslatePipe],
  imports: [CommonModule],
  exports: [TranslatePipe],
  providers: [AitTranslationService],
})
export class SharedModule { }
