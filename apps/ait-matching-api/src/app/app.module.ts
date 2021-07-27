import { SyncPeHistoryResolver } from './sync-pe-history/sync-pe-history.resolver';
import { HttpModule, Module } from '@nestjs/common';
import { AitCoreModule, AitAuthModule } from '@ait/core';
import { RecommencedUserController } from './recommenced-user/recommenced-user.controller';
import { environment } from '../environments/environment';
import { UserCertificateAwardResolver } from './user-certificate-award/user-certificate-award.resolver';
import { CompanyInfoResolver } from './company-info/company-info.resolver';
import { JobInfoResolver } from './job-info/job-info.resolver';
import { UserJobSettingResolver } from './user-job-setting/user-job-setting.resolver';
import { SyncApiConfigResolver } from './sync-api-config/sync-api-config.resolver';
import { UserProfileResolver } from './user-profile/user-profile.resolver';
import { RecommencedJobController } from './recommenced-job/recommenced-job.controller';
import { SysUserResolver } from './sys-user/sys-user.resolver';
import { SysUserController } from './sys-user/sys-user.controller';
import { UserJobQueryResolver } from './user-job-query/user-job-query.resolver';
import { UserInfoResolver } from './user-info/user-info.resolver';

const CONTROLLERS = [
  RecommencedUserController,
  RecommencedJobController,
  SysUserController
];

const RESOLVERS = [
  UserCertificateAwardResolver,
  CompanyInfoResolver,
  JobInfoResolver,
  UserJobSettingResolver,
  SyncPeHistoryResolver,
  SyncApiConfigResolver,
  UserProfileResolver,
  SysUserResolver,
  UserJobQueryResolver,
  UserInfoResolver,
    {
      provide: 'ENVIRONMENT',
      useValue: environment
    }
];

@Module({
  imports: [
    HttpModule,
    AitCoreModule.forRoot(environment), // chỗ này là env của develop
    AitAuthModule.forRoot(environment)
  ],
  controllers: [...CONTROLLERS],
  providers: [...RESOLVERS],
})
export class AppModule { }
