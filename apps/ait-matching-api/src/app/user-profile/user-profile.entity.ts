import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';


@ObjectType()
export class UserProfileEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  accepting_company?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  agreement_file?: string[];

  @Field(() => [String], { nullable: true })
  avatar_url?: string[];

  @Field(() => KeyValueEntity, { nullable: true })
  country?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  current_salary?: number;

  @Field(() => Float, { nullable: true })
  dob?: number;

  @Field(() => String, { nullable: true })
  dob_jp?: string;

  @Field(() => Float, { nullable: true })
  employment_start_date?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  gender?: KeyValueEntity;

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

  @Field(() => KeyValueEntity, { nullable: true })
  no3_exam_dept_pass?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  no3_exam_practice_date?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  no3_exam_practice_pass?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  no3_permit_date?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  occupation?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  prefecture?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  passport_number?: string;

  @Field(() => String, { nullable: true })
  relation_pic?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  residence_status?: KeyValueEntity;

  @Field(() => [String], { nullable: true })
  resume?: string[];

  @Field(() => Float, { nullable: true })
  stay_period?: number;

  @Field(() => String, { nullable: true })
  training_remark?: string;

  @Field(() => String, { nullable: true })
  translate_pic?: string;

  @Field(() => Int, { nullable: true })
  no?: number;

  @Field(() => Boolean, { nullable: true })
  agreement?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;

  @Field(() => KeyValueEntity, { nullable: true })
  emp_type?: KeyValueEntity;
}
