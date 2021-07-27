import { BaseDto, ConditionDto, KeyValueDto } from '@ait/core';
import {
  InputType,
  Int,
  Field,
  Float,
  OmitType,
  IntersectionType,
} from '@nestjs/graphql';

@InputType()
export class UserProfileDto extends BaseDto {
  @Field(() => String, { nullable: true })
  accepting_company?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => [String], { nullable: true })
  avatar_url?: string[];

  @Field(() => ConditionDto, { nullable: true })
  country?: ConditionDto;

  @Field(() => Float, { nullable: true })
  current_salary?: number;

  @Field(() => Float, { nullable: true })
  dob?: number;

  @Field(() => String, { nullable: true })
  dob_jp?: string;

  @Field(() => String, { nullable: true })
  class?: string;

  @Field(() => Float, { nullable: true })
  employment_start_date?: number;

  @Field(() => ConditionDto, { nullable: true })
  gender?: ConditionDto;

  @Field(() => Float, { nullable: true })
  immigration_date?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  name_kana?: string;

  @Field(() => Float, { nullable: true })
  no2_permit_date?: number;

  @Field(() => Float, { nullable: true })
  no3_exam_dept_date?: number;

  @Field(() => ConditionDto, { nullable: true })
  no3_exam_dept_pass?: ConditionDto;

  @Field(() => Float, { nullable: true })
  no3_exam_practice_date?: number;

  @Field(() => ConditionDto, { nullable: true })
  no3_exam_practice_pass?: ConditionDto;

  @Field(() => Float, { nullable: true })
  no3_permit_date?: number;

  @Field(() => ConditionDto, { nullable: true })
  occupation?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  prefecture?: ConditionDto;

  @Field(() => String, { nullable: true })
  passport_number?: string;

  @Field(() => String, { nullable: true })
  relation_pic?: string;

  @Field(() => ConditionDto, { nullable: true })
  residence_status?: ConditionDto;

  @Field(() => [String], { nullable: true })
  resume?: string[];

  @Field(() => Float, { nullable: true })
  stay_period?: number;

  @Field(() => String, { nullable: true })
  training_remark?: string;

  @Field(() => String, { nullable: true })
  translate_pic?: string;

  @Field(() => ConditionDto, { nullable: true })
  work?: ConditionDto;

  @Field(() => Int, { nullable: true })
  no?: number;

  @Field(() => Boolean, { nullable: true })
  agreement?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  emp_type?: ConditionDto;
}

@InputType()
export class SaveUserProfileDto extends OmitType(
  IntersectionType(UserProfileDto, BaseDto),
  [
    'emp_type',
    'gender',
    'country',
    'residence_status',
    'occupation',
    'no3_exam_dept_pass',
    'no3_exam_practice_pass',
    'agreement',
    'resume',
    'avatar_url',
    'agreement_file'
  ] as const
) {
  @Field(() => KeyValueDto, { nullable: true })
  emp_type?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  gender?: KeyValueDto;
  
  @Field(() => KeyValueDto, { nullable: true })
  country?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  residence_status?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  occupation?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  no3_exam_dept_pass?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  no3_exam_practice_pass?: KeyValueDto;

  @Field(() => [String], { nullable: true })
  agreement?: string[];

  @Field(() => [String], { nullable: true })
  resume?: string[];

  @Field(() => [String], { nullable: true })
  avatar_url?: string[];

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];
}
