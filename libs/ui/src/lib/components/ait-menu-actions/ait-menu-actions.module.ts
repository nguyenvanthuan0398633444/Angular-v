import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitMenuActionsComponent } from './ait-menu-actions.component';
import { NbActionsModule, NbIconLibraries, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [AitMenuActionsComponent],
  imports: [CommonModule, NbActionsModule, NbIconModule, NbEvaIconsModule, NbTooltipModule],
  exports: [AitMenuActionsComponent],
  providers: [NbIconLibraries],
})
export class AitMenuActionsModule { }
