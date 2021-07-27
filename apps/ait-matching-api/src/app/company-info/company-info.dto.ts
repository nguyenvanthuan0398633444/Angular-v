import { BaseDto, ConditionDto, KeyValueDto } from '@ait/core';
import {
  InputType,
  Int,
  Field,
  OmitType,
  IntersectionType,
} from '@nestjs/graphql';

@InputType()
export class NameDto {
  @Field(() => String, { nullable: true })
  ja_JP?: string;

  @Field(() => String, { nullable: true })
  vi_VN?: string;

  @Field(() => String, { nullable: true })
  en_US?: string;
}

@InputType()
export class WebsiteDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  url?: string;
}
@InputType()
export class CompanyInfoDto extends OmitType(BaseDto, ['_key'] as const) {
  @Field(() => ConditionDto, { nullable: true })
  occupation?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  _key?: ConditionDto;

  @Field(() => Int, { nullable: true })
  no?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => ConditionDto, { nullable: true })
  work?: ConditionDto;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  fax?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  agreement?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  prefecture?: ConditionDto;

  @Field(() => String, { nullable: true })
  name_pe?: string;

  @Field(() => ConditionDto, { nullable: true })
  business?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  size?: ConditionDto;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => String, { nullable: true })
  representative?: string;

  @Field(() => String, { nullable: true })
  representative_katakana?: string;

  @Field(() => ConditionDto, { nullable: true })
  representative_position?: ConditionDto;

  @Field(() => String, { nullable: true })
  representative_email?: string;

  @Field(() => String, { nullable: true })
  representative_remark?: string;

  @Field(() => String, { nullable: true })
  acceptance_remark?: string;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}

@InputType()
export class SaveCompanyInfoDto extends OmitType(
  IntersectionType(CompanyInfoDto, BaseDto),
  [
    'occupation',
    'work',
    'business',
    'name',
    'website',
    'size',
    'agreement',
    'agreement_file',
    'representative_position',
  ] as const
) {
  @Field(() => KeyValueDto, { nullable: true })
  occupation?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  work?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  business?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  size?: KeyValueDto;

  @Field(() => WebsiteDto, { nullable: true })
  website?: WebsiteDto;

  @Field(() => NameDto, { nullable: true })
  name?: NameDto;

  @Field(() => [String], { nullable: true })
  agreement?: string[];

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => String, { nullable: true })
  representative_position?: string;
}
