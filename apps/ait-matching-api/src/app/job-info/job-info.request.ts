import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { JobInfoDataDto, JobInfoDto } from './job-info.dto';

@InputType()
export class JobInfoRequest extends BaseRequest {
  @Field(() => JobInfoDto, { nullable: true })
  condition: JobInfoDto;

  @Field(() => [JobInfoDataDto], { nullable: true })
  data: JobInfoDataDto[];
}
