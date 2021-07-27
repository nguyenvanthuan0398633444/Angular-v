import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommencedUserComponent } from './recommenced-user/recommenced-user.component';
import { NbIconModule, NbInputModule, NbLayoutScrollService, NbTooltipModule } from '@nebular/theme';
import {
  AitAuthService,
  AitAutocompleteMasterDataModule,
  AitChipModule,
  AitDatepickerModule,
  AitEnvironmentService,
  AitInputNumberModule,
  AitInputTextModule,
  AitLabelModule,
  AitMasterDataService,
  AitOutputTextModule,
  AitTabsModule,
  AitTranslationService
} from '@ait/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactionService } from '../../../services/aureole-v/reaction.service';
import { RecommencedUserService } from '../../../services/aureole-v/recommenced-user.service';
import { SharedModule } from '../../../shared/shared.module';
import { CardSkeletonComponent } from './components/card-skeleton/card-skeleton.component';
import { AureoleVCardComponent } from './components/card/card.component';
import { RecommencedJobComponent } from './recommenced-job/recommenced-job.component';
import { RecommencedJobService } from '../../../services/aureole-v/recommenced-job.service';
import { LazyLoadDirective } from '../../../directives/image-lazy-load.directive';

@NgModule({
  declarations: [
    CardSkeletonComponent,
    AureoleVCardComponent,
    RecommencedUserComponent,
    RecommencedJobComponent,
    LazyLoadDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    AitAutocompleteMasterDataModule,
    NbTooltipModule,
    AitInputNumberModule,
    AitOutputTextModule,
    NbInputModule,
    AitChipModule,
    SharedModule,
    AitLabelModule,
    AitTabsModule,
    AitInputTextModule,
    AitDatepickerModule
  ],
  exports: [
    RecommencedUserComponent,
    CardSkeletonComponent,
    AureoleVCardComponent,
    RecommencedJobComponent
  ],
  providers: [
    NbLayoutScrollService,
    AitMasterDataService,
    RecommencedUserService,
    ReactionService,
    AitTranslationService,
    AitAuthService,
    AitEnvironmentService,
    RecommencedJobService
  ],
})
export class RecommencedModule { }
