import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserCertificateAwardDto, SaveUserCertificateAwardDto } from './user-certificate-award.dto';

@InputType()
export class UserCertificateAwardRequest extends BaseRequest {
  @Field(() => UserCertificateAwardDto, { nullable: true })
  condition: UserCertificateAwardDto;

  @Field(() => [SaveUserCertificateAwardDto], { nullable: true })
  data: SaveUserCertificateAwardDto[];
}
