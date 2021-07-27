import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class JobInfoDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  business?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  residence_status?: ConditionDto;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ConditionDto, { nullable: true })
  prefecture?: ConditionDto;

  @Field(() => String, { nullable: true })
  work_location?: string;

  @Field(() => Int, { nullable: true })
  shift_1_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_1_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_1_from_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_1_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_2_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_2_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_2_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_2_from_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_3_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_3_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_3_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_3_from_minute?: number;

  @Field(() => String, { nullable: true })
  holiday?: string;

  @Field(() => ConditionDto, { nullable: true })
  salary_type?: ConditionDto;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => Float, { nullable: true })
  salary?: number;

  @Field(() => String, { nullable: true })
  benefit?: string;

  @Field(() => Float, { nullable: true })
  commission_amount?: number;

  @Field(() => String, { nullable: true })
  probationary_period?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field(() => ConditionDto, { nullable: true })
  gender?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  accommodation?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  dormitory?: ConditionDto;

  @Field(() => String, { nullable: true })
  search_evaluation?: string;

  @Field(() => String, { nullable: true })
  skills?: string;

  @Field(() => ConditionDto, { nullable: true })
  japanese_skill?: ConditionDto;

  @Field(() => String, { nullable: true })
  method?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => ConditionDto, { nullable: true })
  status?: ConditionDto;

  @Field(() => String, { nullable: true })
  company_key?: string;

  @Field(() => ConditionDto, { nullable: true })
  job_company?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  experienced_occupation?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  desired_occupation?: ConditionDto;
}


@InputType()
export class JobInfoDataDto extends BaseDto {
  @Field(() => [String], { nullable: true })
  business?: string[];

  @Field(() => [String], { nullable: true })
  residence_status?: string[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  prefecture?: string[];

  @Field(() => String, { nullable: true })
  work_location?: string;

  @Field(() => Int, { nullable: true })
  shift_1_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_1_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_1_from_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_1_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_2_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_2_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_2_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_2_from_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_3_to_minute?: number;

  @Field(() => Int, { nullable: true })
  shift_3_from_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_3_to_hour?: number;

  @Field(() => Int, { nullable: true })
  shift_3_from_minute?: number;

  @Field(() => String, { nullable: true })
  holiday?: string;

  @Field(() => String, { nullable: true })
  salary_type?: string;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => Float, { nullable: true })
  salary?: number;

  @Field(() => String, { nullable: true })
  benefit?: string;

  @Field(() => Float, { nullable: true })
  commission_amount?: number;

  @Field(() => String, { nullable: true })
  probationary_period?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  accommodation?: string;

  @Field(() => String, { nullable: true })
  dormitory?: string;

  @Field(() => String, { nullable: true })
  search_evaluation?: string;

  @Field(() => String, { nullable: true })
  skills?: string;

  @Field(() => String, { nullable: true })
  japanese_skill?: string;

  @Field(() => String, { nullable: true })
  method?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  company_key?: string;

  @Field(() => String, { nullable: true })
  job_company?: string;

  @Field(() => String, { nullable: true })
  experienced_occupation?: string;

  @Field(() => String, { nullable: true })
  desired_occupation?: string;

  @Field(() => [String], { nullable: true })
  only_apply?: string[];

  @Field(() => [String], { nullable: true })
  only_experienced?: string[];
}
