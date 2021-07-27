import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserJobSettingDto extends BaseDto {
  @Field(() => [String], { nullable: true })
  business?: string[];

  @Field(() => ConditionDto, { nullable: true })
  desired_occupation?: ConditionDto;

  @Field(() => [String], { nullable: true })
  residence_status?: string[];

  @Field(() => ConditionDto, { nullable: true })
  japanese_skill?: ConditionDto;

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

  @Field(() => ConditionDto, { nullable: true })
  salary_type?: ConditionDto;
}
