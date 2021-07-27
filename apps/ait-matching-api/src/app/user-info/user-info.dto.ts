import { BaseDto } from '@ait/core';
import {
  InputType,
  Field,
} from '@nestjs/graphql';
import { SaveUserCertificateAwardDto } from '../user-certificate-award/user-certificate-award.dto';
import { SaveUserJobQueryDto } from '../user-job-query/user-job-query.dto';
import { SaveUserProfileDto } from '../user-profile/user-profile.dto';

@InputType()
export class SaveUserInfoDto extends BaseDto {
  @Field(() => SaveUserProfileDto, { nullable: true })
  userInfo?: SaveUserProfileDto;
  @Field(() => SaveUserJobQueryDto, { nullable: true })
  userJobQuery?: SaveUserJobQueryDto;
  @Field(() => SaveUserCertificateAwardDto, { nullable: true })
  userCertificate?: SaveUserCertificateAwardDto;
}
