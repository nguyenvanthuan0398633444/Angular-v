import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class JobInfoEntity extends BaseEntity {
  @Field(() => [KeyValueEntity], { nullable: true })
  business?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  residence_status?: KeyValueEntity[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  prefecture?: KeyValueEntity[];

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

  @Field(() => KeyValueEntity, { nullable: true })
  salary_type?: KeyValueEntity;

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

  @Field(() => KeyValueEntity, { nullable: true })
  gender?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  accommodation?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  dormitory?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  search_evaluation?: string;

  @Field(() => String, { nullable: true })
  skills?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  japanese_skill?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  method?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  status?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  company_key?: string;

  @Field(() => String, { nullable: true })
  job_company?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  experienced_occupation?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  desired_occupation?: KeyValueEntity;

  @Field(() => [String], { nullable: true })
  only_apply?: string[];

  @Field(() => [String], { nullable: true })
  only_experienced?: string[];
}
