import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { CompanyInfoDto, SaveCompanyInfoDto } from './company-info.dto';

@InputType()
export class CompanyInfoRequest extends BaseRequest {
  @Field(() => CompanyInfoDto, { nullable: true })
  condition: CompanyInfoDto;

  @Field(() => [SaveCompanyInfoDto], { nullable: true })
  data: SaveCompanyInfoDto[];
}
