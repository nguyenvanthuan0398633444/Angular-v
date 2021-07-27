import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserJobSettingEntity extends BaseEntity {
  @Field(() => [String], { nullable: true })
  business?: string[];

  @Field(() => KeyValueEntity, { nullable: true })
  desired_occupation?: KeyValueEntity;

  @Field(() => [String], { nullable: true })
  residence_status?: string[];

  @Field(() => KeyValueEntity, { nullable: true })
  japanese_skill?: KeyValueEntity;

  @Field(() => [String], { nullable: true })
  prefecture?: string[];

  @Field(() => Float, { nullable: true })
  immigration_date?: number;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  qualification?: string;

  @Field(() => Float, { nullable: true })
  desired_salary?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  salary_type?: KeyValueEntity;
}
